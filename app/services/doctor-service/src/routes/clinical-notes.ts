import type { FastifyInstance } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { ClinicalNotesService } from '../services/clinical-notes-service.js';
import { z } from 'zod';

const createNoteSchema = z.object({
  noteType: z.string().min(1),
  content: z.string().min(1),
  encounterDate: z.string().optional(),
});

export async function clinicalNotesRoutes(app: FastifyInstance) {
  const service = new ClinicalNotesService();

  // POST /api/v1/doctor/patients/:patientId/notes - Create clinical note (doctor only)
  app.post<{ Params: { patientId: string } }>('/patients/:patientId/notes', {
    preHandler: [checkRole(ROLES.DOCTOR)],
  }, async (request, reply) => {
    const body = createNoteSchema.parse(request.body);
    const note = await service.create(
      request.params.patientId,
      request.user!.sub,
      body,
    );
    reply.code(201).send(note);
  });

  // GET /api/v1/doctor/patients/:patientId/notes - List notes for patient (doctor/admin)
  app.get<{
    Params: { patientId: string };
    Querystring: { limit?: string; offset?: string };
  }>('/patients/:patientId/notes', {
    preHandler: [checkRole(ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request) => {
    const { limit = '20', offset = '0' } = request.query;
    return service.listByPatient(
      request.params.patientId,
      parseInt(limit, 10),
      parseInt(offset, 10),
    );
  });
}
