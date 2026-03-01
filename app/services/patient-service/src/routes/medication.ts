import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
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

  app.post('/:patientId/medications', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string } }>, reply: FastifyReply) => {
    const body = medicationSchema.parse(request.body);
    const medication = await service.create(request.params.patientId, body, request.user!.sub);
    reply.code(201).send(medication);
  });

  app.get('/:patientId/medications', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string }; Querystring: { status?: string } }>) => {
    return service.listByPatient(request.params.patientId, request.query.status);
  });

  app.get('/:patientId/medications/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    const medication = await service.getById(request.params.id);
    if (!medication) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Medication not found' } });
      return;
    }
    return medication;
  });

  app.put('/:patientId/medications/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    const body = medicationSchema.partial().parse(request.body);
    const medication = await service.update(request.params.id, body);
    if (!medication) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Medication not found' } });
      return;
    }
    return medication;
  });

  app.delete('/:patientId/medications/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    await service.delete(request.params.id);
    reply.code(204).send();
  });
}
