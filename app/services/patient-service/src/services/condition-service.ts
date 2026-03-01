import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { getDb, conditions, type NewCondition } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import type { Condition as FhirCondition } from '@ananta/fhir-models';
import { CONDITION_CLINICAL_STATUS_SYSTEM, CONDITION_VERIFICATION_STATUS_SYSTEM } from '@ananta/fhir-models';

export class ConditionService {
  private db = getDb();

  async create(patientId: string, data: Omit<NewCondition, 'id' | 'fhirId' | 'patientId' | 'createdAt' | 'updatedAt'>, createdBy: string) {
    const fhirId = uuidv4();

    const [condition] = await this.db.insert(conditions).values({
      ...data,
      patientId,
      fhirId,
      createdBy,
    }).returning();

    const fhirCondition = this.toFhir(condition, patientId);
    await FhirResource.create({
      resourceType: 'Condition',
      fhirId,
      resource: fhirCondition,
      meta: { versionId: '1', lastUpdated: new Date(), source: 'patient-service' },
      patientRef: patientId,
    });

    return condition;
  }

  async listByPatient(patientId: string, status?: string) {
    let query = this.db.select().from(conditions).where(eq(conditions.patientId, patientId));
    if (status) {
      query = this.db.select().from(conditions).where(
        and(eq(conditions.patientId, patientId), eq(conditions.clinicalStatus, status))
      );
    }
    return query;
  }

  async getById(id: string) {
    const [condition] = await this.db.select().from(conditions).where(eq(conditions.id, id)).limit(1);
    return condition || null;
  }

  async update(id: string, data: Partial<NewCondition>) {
    const [condition] = await this.db
      .update(conditions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(conditions.id, id))
      .returning();

    if (condition) {
      await FhirResource.findOneAndUpdate(
        { resourceType: 'Condition', fhirId: condition.fhirId },
        { resource: this.toFhir(condition, condition.patientId), 'meta.lastUpdated': new Date() },
      );
    }

    return condition || null;
  }

  async delete(id: string) {
    const [condition] = await this.db.delete(conditions).where(eq(conditions.id, id)).returning();
    if (condition) {
      await FhirResource.deleteOne({ resourceType: 'Condition', fhirId: condition.fhirId });
    }
  }

  private toFhir(row: typeof conditions.$inferSelect, patientId: string): FhirCondition {
    return {
      resourceType: 'Condition',
      id: row.fhirId,
      clinicalStatus: {
        coding: [{ system: CONDITION_CLINICAL_STATUS_SYSTEM, code: row.clinicalStatus }],
      },
      verificationStatus: row.verificationStatus ? {
        coding: [{ system: CONDITION_VERIFICATION_STATUS_SYSTEM, code: row.verificationStatus }],
      } : undefined,
      severity: row.severity ? { text: row.severity } : undefined,
      code: {
        coding: row.codeSystem ? [{ system: row.codeSystem, code: row.codeValue ?? undefined, display: row.codeDisplay }] : undefined,
        text: row.codeDisplay,
      },
      subject: { reference: `Patient/${patientId}` },
      onsetDateTime: row.onsetDate ?? undefined,
      abatementDateTime: row.abatementDate ?? undefined,
      recordedDate: row.recordedDate?.toISOString(),
    };
  }
}
