import type { FastifyInstance } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { ConditionService } from '../services/condition-service.js';
import { z } from 'zod';

const conditionSchema = z.object({
  codeSystem: z.string().optional(),
  codeValue: z.string().optional(),
  codeDisplay: z.string().min(1),
  clinicalStatus: z.enum(['active', 'recurrence', 'relapse', 'inactive', 'remission', 'resolved']),
  verificationStatus: z.enum(['unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error']).optional(),
  severity: z.enum(['severe', 'moderate', 'mild']).optional(),
  onsetDate: z.string().optional(),
  abatementDate: z.string().optional(),
});

export async function conditionRoutes(app: FastifyInstance) {
  const service = new ConditionService();

  app.post<{ Params: { patientId: string } }>('/:patientId/conditions', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const body = conditionSchema.parse(request.body);
    const condition = await service.create(request.params.patientId, body, request.user!.sub);
    reply.code(201).send(condition);
  });

  app.get<{ Params: { patientId: string }; Querystring: { status?: string } }>('/:patientId/conditions', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request) => {
    return service.listByPatient(request.params.patientId, request.query.status);
  });

  app.get<{ Params: { patientId: string; id: string } }>('/:patientId/conditions/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const condition = await service.getById(request.params.id);
    if (!condition) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Condition not found' } });
      return;
    }
    return condition;
  });

  app.put<{ Params: { patientId: string; id: string } }>('/:patientId/conditions/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const body = conditionSchema.partial().parse(request.body);
    const condition = await service.update(request.params.id, body);
    if (!condition) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Condition not found' } });
      return;
    }
    return condition;
  });

  app.delete<{ Params: { patientId: string; id: string } }>('/:patientId/conditions/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    await service.delete(request.params.id);
    reply.code(204).send();
  });
}
