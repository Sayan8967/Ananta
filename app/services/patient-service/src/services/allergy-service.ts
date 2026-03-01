import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { getDb, allergyIntolerances, type NewAllergyIntolerance } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import type { AllergyIntolerance as FhirAllergy } from '@ananta/fhir-models';
import { ALLERGY_CLINICAL_STATUS_SYSTEM, ALLERGY_VERIFICATION_STATUS_SYSTEM } from '@ananta/fhir-models';

export class AllergyService {
  private db = getDb();

  async create(patientId: string, data: Omit<NewAllergyIntolerance, 'id' | 'fhirId' | 'patientId' | 'createdAt' | 'updatedAt'>, createdBy: string) {
    const fhirId = uuidv4();

    const [allergy] = await this.db.insert(allergyIntolerances).values({
      ...data,
      patientId,
      fhirId,
      createdBy,
    }).returning();

    await FhirResource.create({
      resourceType: 'AllergyIntolerance',
      fhirId,
      resource: this.toFhir(allergy, patientId),
      meta: { versionId: '1', lastUpdated: new Date(), source: 'patient-service' },
      patientRef: patientId,
    });

    return allergy;
  }

  async listByPatient(patientId: string) {
    return this.db.select().from(allergyIntolerances).where(eq(allergyIntolerances.patientId, patientId));
  }

  async getById(id: string) {
    const [allergy] = await this.db.select().from(allergyIntolerances).where(eq(allergyIntolerances.id, id)).limit(1);
    return allergy || null;
  }

  async update(id: string, data: Partial<NewAllergyIntolerance>) {
    const [allergy] = await this.db
      .update(allergyIntolerances)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(allergyIntolerances.id, id))
      .returning();

    if (allergy) {
      await FhirResource.findOneAndUpdate(
        { resourceType: 'AllergyIntolerance', fhirId: allergy.fhirId },
        { resource: this.toFhir(allergy, allergy.patientId), 'meta.lastUpdated': new Date() },
      );
    }
    return allergy || null;
  }

  async delete(id: string) {
    const [allergy] = await this.db.delete(allergyIntolerances).where(eq(allergyIntolerances.id, id)).returning();
    if (allergy) {
      await FhirResource.deleteOne({ resourceType: 'AllergyIntolerance', fhirId: allergy.fhirId });
    }
  }

  private toFhir(row: typeof allergyIntolerances.$inferSelect, patientId: string): FhirAllergy {
    return {
      resourceType: 'AllergyIntolerance',
      id: row.fhirId,
      clinicalStatus: {
        coding: [{ system: ALLERGY_CLINICAL_STATUS_SYSTEM, code: row.clinicalStatus }],
      },
      verificationStatus: row.verificationStatus ? {
        coding: [{ system: ALLERGY_VERIFICATION_STATUS_SYSTEM, code: row.verificationStatus }],
      } : undefined,
      type: row.type as FhirAllergy['type'],
      category: row.category ? [row.category as 'food' | 'medication' | 'environment' | 'biologic'] : undefined,
      criticality: row.criticality as FhirAllergy['criticality'],
      code: { text: row.codeDisplay },
      patient: { reference: `Patient/${patientId}` },
      reaction: row.reactionManifestation ? [{
        manifestation: [{ text: row.reactionManifestation }],
        severity: row.reactionSeverity as 'mild' | 'moderate' | 'severe' | undefined,
      }] : undefined,
    };
  }
}
