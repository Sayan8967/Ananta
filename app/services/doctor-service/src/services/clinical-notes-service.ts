import { v4 as uuidv4 } from 'uuid';
import { eq, desc, sql } from 'drizzle-orm';
import { getDb, clinicalNotes, type NewClinicalNote } from '@ananta/db-client';
import { FhirResource } from '@ananta/db-client';
import type { DocumentReference } from '@ananta/fhir-models';
import { createLogger } from '@ananta/common';

const logger = createLogger('clinical-notes-service');

interface CreateNoteInput {
  noteType: string;
  content: string;
  encounterDate?: string;
}

export class ClinicalNotesService {
  private db = getDb();

  async create(patientId: string, doctorId: string, data: CreateNoteInput) {
    const fhirId = uuidv4();
    const encounterDate = data.encounterDate
      ? new Date(data.encounterDate)
      : new Date();

    // Insert into PostgreSQL
    const [note] = await this.db.insert(clinicalNotes).values({
      fhirId,
      patientId,
      doctorId,
      noteType: data.noteType,
      content: data.content,
      encounterDate,
    }).returning();

    // Create FHIR DocumentReference in MongoDB
    const fhirDocRef = this.toFhirDocumentReference(note, patientId, doctorId);
    await FhirResource.create({
      resourceType: 'DocumentReference',
      fhirId,
      resource: fhirDocRef,
      meta: {
        versionId: '1',
        lastUpdated: new Date(),
        source: 'doctor-service',
      },
      patientRef: patientId,
    });

    logger.info({ noteId: note.id, patientId, doctorId }, 'Clinical note created');
    return note;
  }

  async listByPatient(patientId: string, limit = 20, offset = 0) {
    const results = await this.db.select().from(clinicalNotes)
      .where(eq(clinicalNotes.patientId, patientId))
      .orderBy(desc(clinicalNotes.encounterDate))
      .limit(limit)
      .offset(offset);

    const [countResult] = await this.db.select({ count: sql<number>`count(*)` })
      .from(clinicalNotes)
      .where(eq(clinicalNotes.patientId, patientId));

    return {
      data: results,
      total: Number(countResult.count),
      limit,
      offset,
    };
  }

  async getById(id: string) {
    const [note] = await this.db.select().from(clinicalNotes)
      .where(eq(clinicalNotes.id, id))
      .limit(1);
    return note || null;
  }

  private toFhirDocumentReference(
    note: typeof clinicalNotes.$inferSelect,
    patientId: string,
    doctorId: string,
  ): DocumentReference {
    return {
      resourceType: 'DocumentReference',
      id: note.fhirId,
      status: 'current',
      type: {
        coding: [{
          system: 'http://loinc.org',
          code: '11506-3',
          display: note.noteType ?? undefined,
        }],
        text: note.noteType ?? undefined,
      },
      subject: { reference: `Patient/${patientId}` },
      author: [{ reference: `Practitioner/${doctorId}` }],
      date: note.createdAt?.toISOString(),
      description: `Clinical note: ${note.noteType}`,
      content: [{
        attachment: {
          contentType: 'text/plain',
          data: Buffer.from(note.content).toString('base64'),
          title: note.noteType ?? undefined,
          creation: note.encounterDate?.toISOString(),
        },
      }],
      context: {
        period: {
          start: note.encounterDate?.toISOString(),
        },
      },
    };
  }
}
