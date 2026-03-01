import { v4 as uuidv4 } from 'uuid';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { getDb, patients, type NewPatient } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import type { Patient as FhirPatient } from '@ananta/fhir-models';
import { createLogger } from '@ananta/common';

const logger = createLogger('patient-service');

export class PatientService {
  private db = getDb();

  async create(data: Omit<NewPatient, 'id' | 'fhirId' | 'createdAt' | 'updatedAt' | 'version'>, createdBy: string) {
    const fhirId = uuidv4();

    // Insert into PostgreSQL
    const [patient] = await this.db.insert(patients).values({
      ...data,
      fhirId,
      createdBy,
    }).returning();

    // Create FHIR resource for MongoDB
    const fhirPatient = this.toFhirResource(patient);
    await FhirResource.create({
      resourceType: 'Patient',
      fhirId,
      resource: fhirPatient,
      meta: {
        versionId: '1',
        lastUpdated: new Date(),
        source: 'patient-service',
      },
      patientRef: fhirId,
    });

    logger.info({ patientId: patient.id, fhirId }, 'Patient created');
    return { ...patient, fhir: fhirPatient };
  }

  async getById(id: string) {
    const [patient] = await this.db.select().from(patients).where(eq(patients.id, id)).limit(1);
    if (!patient) return null;
    return { ...patient, fhir: this.toFhirResource(patient) };
  }

  async getByFhirId(fhirId: string) {
    const [patient] = await this.db.select().from(patients).where(eq(patients.fhirId, fhirId)).limit(1);
    if (!patient) return null;
    return { ...patient, fhir: this.toFhirResource(patient) };
  }

  async update(id: string, data: Partial<NewPatient>, updatedBy: string) {
    const [patient] = await this.db
      .update(patients)
      .set({ ...data, updatedAt: new Date(), createdBy: updatedBy })
      .where(eq(patients.id, id))
      .returning();

    if (!patient) return null;

    // Update FHIR resource in MongoDB
    const fhirPatient = this.toFhirResource(patient);
    await FhirResource.findOneAndUpdate(
      { resourceType: 'Patient', fhirId: patient.fhirId },
      {
        resource: fhirPatient,
        'meta.lastUpdated': new Date(),
        'meta.versionId': String((patient.version || 1) + 1),
      },
    );

    logger.info({ patientId: id }, 'Patient updated');
    return { ...patient, fhir: fhirPatient };
  }

  async search(query?: string, limit = 20, offset = 0) {
    let whereClause;
    if (query) {
      whereClause = or(
        ilike(patients.givenName, `%${query}%`),
        ilike(patients.familyName, `%${query}%`),
        ilike(patients.phone, `%${query}%`),
        ilike(patients.email, `%${query}%`),
      );
    }

    const results = await this.db.select().from(patients)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const [countResult] = await this.db.select({ count: sql<number>`count(*)` })
      .from(patients)
      .where(whereClause);

    return {
      data: results,
      total: Number(countResult.count),
      limit,
      offset,
    };
  }

  private toFhirResource(patient: typeof patients.$inferSelect): FhirPatient {
    return {
      resourceType: 'Patient',
      id: patient.fhirId,
      meta: {
        versionId: String(patient.version || 1),
        lastUpdated: patient.updatedAt?.toISOString(),
      },
      active: patient.active ?? true,
      name: [{
        use: 'official',
        family: patient.familyName,
        given: [patient.givenName],
      }],
      gender: patient.gender as FhirPatient['gender'],
      birthDate: patient.birthDate,
      telecom: [
        ...(patient.phone ? [{ system: 'phone' as const, value: patient.phone, use: 'mobile' as const }] : []),
        ...(patient.email ? [{ system: 'email' as const, value: patient.email }] : []),
      ],
      address: patient.addressCity ? [{
        use: 'home',
        line: patient.addressLine ? [patient.addressLine] : undefined,
        city: patient.addressCity ?? undefined,
        state: patient.addressState ?? undefined,
        postalCode: patient.addressPostal ?? undefined,
        country: patient.addressCountry ?? undefined,
      }] : undefined,
      identifier: [
        {
          system: 'https://ananta.health/fhir/patient-id',
          value: patient.fhirId,
        },
      ],
    };
  }
}
