import type { FastifyInstance } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { MedicationService } from '../services/medication-service.js';
import { z } from 'zod';

const medicationSchema = z.object({
  medicationCode: z.string().optional(),
  medicationSystem: z.string().optional(),
  medicationDisplay: z.string().min(1),
  status: z.enum(['active', 'completed', 'entered-in-error', 'intended', 'stopped', 'on-hold', 'unknown', 'not-taken']),
  dosageText: z.string().optional(),
  dosageRoute: z.string().optional(),
  dosageFrequency: z.string().optional(),
  effectiveStart: z.string().optional(),
  effectiveEnd: z.string().optional(),
  sourceType: z.string().optional(),
  prescriptionId: z.string().uuid().optional(),
});

export async function medicationRoutes(app: FastifyInstance) {
  const service = new MedicationService();

  app.post<{ Params: { patientId: string } }>('/:patientId/medications', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const body = medicationSchema.parse(request.body);
    const medication = await service.create(request.params.patientId, body, request.user!.sub);
    reply.code(201).send(medication);
  });

  app.get<{ Params: { patientId: string }; Querystring: { status?: string } }>('/:patientId/medications', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request) => {
    return service.listByPatient(request.params.patientId, request.query.status);
  });

  app.get<{ Params: { patientId: string; id: string } }>('/:patientId/medications/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const medication = await service.getById(request.params.id);
    if (!medication) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Medication not found' } });
      return;
    }
    return medication;
  });

  app.put<{ Params: { patientId: string; id: string } }>('/:patientId/medications/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const body = medicationSchema.partial().parse(request.body);
    const medication = await service.update(request.params.id, body);
    if (!medication) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Medication not found' } });
      return;
    }
    return medication;
  });

  app.delete<{ Params: { patientId: string; id: string } }>('/:patientId/medications/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    await service.delete(request.params.id);
    reply.code(204).send();
  });
}
