import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { getDb, medicationStatements, type NewMedicationStatement } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import type { MedicationStatement as FhirMed } from '@ananta/fhir-models';
import { RXNORM_SYSTEM } from '@ananta/fhir-models';

export class MedicationService {
  private db = getDb();

  async create(patientId: string, data: Omit<NewMedicationStatement, 'id' | 'fhirId' | 'patientId' | 'createdAt' | 'updatedAt'>, createdBy: string) {
    const fhirId = uuidv4();

    const [med] = await this.db.insert(medicationStatements).values({
      ...data,
      patientId,
      fhirId,
      createdBy,
    }).returning();

    const fhirMed = this.toFhir(med, patientId);
    await FhirResource.create({
      resourceType: 'MedicationStatement',
      fhirId,
      resource: fhirMed,
      meta: { versionId: '1', lastUpdated: new Date(), source: 'patient-service' },
      patientRef: patientId,
    });

    return med;
  }

  async listByPatient(patientId: string, status?: string) {
    if (status) {
      return this.db.select().from(medicationStatements).where(
        and(eq(medicationStatements.patientId, patientId), eq(medicationStatements.status, status))
      );
    }
    return this.db.select().from(medicationStatements).where(eq(medicationStatements.patientId, patientId));
  }

  async getById(id: string) {
    const [med] = await this.db.select().from(medicationStatements).where(eq(medicationStatements.id, id)).limit(1);
    return med || null;
  }

  async update(id: string, data: Partial<NewMedicationStatement>) {
    const [med] = await this.db
      .update(medicationStatements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(medicationStatements.id, id))
      .returning();

    if (med) {
      await FhirResource.findOneAndUpdate(
        { resourceType: 'MedicationStatement', fhirId: med.fhirId },
        { resource: this.toFhir(med, med.patientId), 'meta.lastUpdated': new Date() },
      );
    }
    return med || null;
  }

  async delete(id: string) {
    const [med] = await this.db.delete(medicationStatements).where(eq(medicationStatements.id, id)).returning();
    if (med) {
      await FhirResource.deleteOne({ resourceType: 'MedicationStatement', fhirId: med.fhirId });
    }
  }

  private toFhir(row: typeof medicationStatements.$inferSelect, patientId: string): FhirMed {
    return {
      resourceType: 'MedicationStatement',
      id: row.fhirId,
      status: row.status as FhirMed['status'],
      medicationCodeableConcept: {
        coding: row.medicationCode ? [{
          system: row.medicationSystem || RXNORM_SYSTEM,
          code: row.medicationCode,
          display: row.medicationDisplay,
        }] : undefined,
        text: row.medicationDisplay,
      },
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: row.effectiveStart ?? undefined,
      effectivePeriod: row.effectiveStart ? {
        start: row.effectiveStart,
        end: row.effectiveEnd ?? undefined,
      } : undefined,
      dosage: row.dosageText ? [{
        text: row.dosageText,
        route: row.dosageRoute ? { text: row.dosageRoute } : undefined,
      }] : undefined,
    };
  }
}
