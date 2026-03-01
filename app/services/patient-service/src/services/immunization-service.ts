import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { getDb, immunizations, type NewImmunization } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import type { Immunization as FhirImmunization } from '@ananta/fhir-models';
import { CVX_SYSTEM } from '@ananta/fhir-models';

export class ImmunizationService {
  private db = getDb();

  async create(patientId: string, data: Omit<NewImmunization, 'id' | 'fhirId' | 'patientId' | 'createdAt' | 'updatedAt'>, createdBy: string) {
    const fhirId = uuidv4();

    const [imm] = await this.db.insert(immunizations).values({
      ...data,
      patientId,
      fhirId,
      createdBy,
    }).returning();

    await FhirResource.create({
      resourceType: 'Immunization',
      fhirId,
      resource: this.toFhir(imm, patientId),
      meta: { versionId: '1', lastUpdated: new Date(), source: 'patient-service' },
      patientRef: patientId,
    });

    return imm;
  }

  async listByPatient(patientId: string) {
    return this.db.select().from(immunizations).where(eq(immunizations.patientId, patientId));
  }

  async getById(id: string) {
    const [imm] = await this.db.select().from(immunizations).where(eq(immunizations.id, id)).limit(1);
    return imm || null;
  }

  async update(id: string, data: Partial<NewImmunization>) {
    const [imm] = await this.db
      .update(immunizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(immunizations.id, id))
      .returning();

    if (imm) {
      await FhirResource.findOneAndUpdate(
        { resourceType: 'Immunization', fhirId: imm.fhirId },
        { resource: this.toFhir(imm, imm.patientId), 'meta.lastUpdated': new Date() },
      );
    }
    return imm || null;
  }

  async delete(id: string) {
    const [imm] = await this.db.delete(immunizations).where(eq(immunizations.id, id)).returning();
    if (imm) {
      await FhirResource.deleteOne({ resourceType: 'Immunization', fhirId: imm.fhirId });
    }
  }

  private toFhir(row: typeof immunizations.$inferSelect, patientId: string): FhirImmunization {
    return {
      resourceType: 'Immunization',
      id: row.fhirId,
      status: row.status as 'completed' | 'entered-in-error' | 'not-done',
      vaccineCode: {
        coding: row.vaccineCode ? [{
          system: row.vaccineSystem || CVX_SYSTEM,
          code: row.vaccineCode,
          display: row.vaccineDisplay,
        }] : undefined,
        text: row.vaccineDisplay,
      },
      patient: { reference: `Patient/${patientId}` },
      occurrenceDateTime: row.occurrenceDate,
      lotNumber: row.lotNumber ?? undefined,
      site: row.siteDisplay ? { text: row.siteDisplay } : undefined,
      doseQuantity: row.doseQuantity ? {
        value: parseFloat(row.doseQuantity),
        unit: row.doseUnit ?? undefined,
      } : undefined,
    };
  }
}
