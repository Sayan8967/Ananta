import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { AllergyService } from '../services/allergy-service.js';
import { z } from 'zod';

const allergySchema = z.object({
  codeSystem: z.string().optional(),
  codeValue: z.string().optional(),
  codeDisplay: z.string().min(1),
  clinicalStatus: z.enum(['active', 'inactive', 'resolved']),
  verificationStatus: z.enum(['unconfirmed', 'confirmed', 'refuted', 'entered-in-error']).optional(),
  type: z.enum(['allergy', 'intolerance']).optional(),
  category: z.enum(['food', 'medication', 'environment', 'biologic']).optional(),
  criticality: z.enum(['low', 'high', 'unable-to-assess']).optional(),
  reactionManifestation: z.string().optional(),
  reactionSeverity: z.enum(['mild', 'moderate', 'severe']).optional(),
  onsetDate: z.string().optional(),
});

export async function allergyRoutes(app: FastifyInstance) {
  const service = new AllergyService();

  app.post('/:patientId/allergies', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string } }>, reply: FastifyReply) => {
    const body = allergySchema.parse(request.body);
    const allergy = await service.create(request.params.patientId, body, request.user!.sub);
    reply.code(201).send(allergy);
  });

  app.get('/:patientId/allergies', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN, ROLES.EMERGENCY_RESPONDER)],
  }, async (request: FastifyRequest<{ Params: { patientId: string } }>) => {
    return service.listByPatient(request.params.patientId);
  });

  app.get('/:patientId/allergies/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    const allergy = await service.getById(request.params.id);
    if (!allergy) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Allergy not found' } });
      return;
    }
    return allergy;
  });

  app.put('/:patientId/allergies/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    const body = allergySchema.partial().parse(request.body);
    const allergy = await service.update(request.params.id, body);
    if (!allergy) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Allergy not found' } });
      return;
    }
    return allergy;
  });

  app.delete('/:patientId/allergies/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    await service.delete(request.params.id);
    reply.code(204).send();
  });
}
