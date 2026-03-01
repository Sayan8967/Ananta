import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { getDb, prescriptions, medicationStatements } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import { createLogger } from '@ananta/common';

const logger = createLogger('prescription-service');

interface MedicationExtraction {
  medicationDisplay: string;
  medicationCode?: string;
  dosageText?: string;
  dosageFrequency?: string;
  dosageRoute?: string;
  effectiveStart?: string;
  effectiveEnd?: string;
}

export class PrescriptionService {
  private db = getDb();

  async create(patientId: string, imageUrl: string, createdBy: string) {
    const [prescription] = await this.db.insert(prescriptions).values({
      patientId,
      imageUrl,
      ocrStatus: 'pending',
      createdBy,
    }).returning();

    // Trigger OCR processing asynchronously
    // In production: publish to message queue, ai-service picks up
    this.triggerOcr(prescription.id, imageUrl).catch(err => {
      logger.error({ err, prescriptionId: prescription.id }, 'Failed to trigger OCR');
    });

    return prescription;
  }

  async listByPatient(patientId: string) {
    return this.db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId));
  }

  async getById(id: string) {
    const [prescription] = await this.db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
    return prescription || null;
  }

  async confirmExtraction(patientId: string, prescriptionId: string, medications: MedicationExtraction[], createdBy: string) {
    const created = [];

    for (const med of medications) {
      const fhirId = uuidv4();
      const [row] = await this.db.insert(medicationStatements).values({
        fhirId,
        patientId,
        medicationDisplay: med.medicationDisplay,
        medicationCode: med.medicationCode,
        status: 'active',
        dosageText: med.dosageText,
        dosageFrequency: med.dosageFrequency,
        dosageRoute: med.dosageRoute,
        effectiveStart: med.effectiveStart,
        effectiveEnd: med.effectiveEnd,
        sourceType: 'ocr',
        prescriptionId,
        createdBy,
      }).returning();

      await FhirResource.create({
        resourceType: 'MedicationStatement',
        fhirId,
        resource: {
          resourceType: 'MedicationStatement',
          id: fhirId,
          status: 'active',
          medicationCodeableConcept: { text: med.medicationDisplay },
          subject: { reference: `Patient/${patientId}` },
          dosage: med.dosageText ? [{ text: med.dosageText }] : undefined,
        },
        meta: { versionId: '1', lastUpdated: new Date(), source: 'prescription-ocr' },
        patientRef: patientId,
      });

      created.push(row);
    }

    // Update prescription status
    await this.db.update(prescriptions)
      .set({ ocrStatus: 'confirmed', updatedAt: new Date() })
      .where(eq(prescriptions.id, prescriptionId));

    logger.info({ prescriptionId, count: created.length }, 'Prescription medications confirmed');
    return { confirmed: created.length, medications: created };
  }

  private async triggerOcr(prescriptionId: string, imageUrl: string) {
    try {
      // Call AI service for OCR
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:3005';
      const response = await fetch(`${aiServiceUrl}/api/v1/ai/ocr/prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, prescriptionId }),
      });

      if (response.ok) {
        const result = await response.json() as { text: string; medications: MedicationExtraction[] };
        await this.db.update(prescriptions)
          .set({
            ocrStatus: 'completed',
            ocrRawText: result.text,
            extractedData: result.medications,
            updatedAt: new Date(),
          })
          .where(eq(prescriptions.id, prescriptionId));
      } else {
        await this.db.update(prescriptions)
          .set({ ocrStatus: 'failed', updatedAt: new Date() })
          .where(eq(prescriptions.id, prescriptionId));
      }
    } catch (err) {
      await this.db.update(prescriptions)
        .set({ ocrStatus: 'failed', updatedAt: new Date() })
        .where(eq(prescriptions.id, prescriptionId));
    }
  }
}
