import type { FastifyInstance } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { ImmunizationService } from '../services/immunization-service.js';
import { z } from 'zod';

const immunizationSchema = z.object({
  vaccineCode: z.string().optional(),
  vaccineSystem: z.string().optional(),
  vaccineDisplay: z.string().min(1),
  status: z.enum(['completed', 'entered-in-error', 'not-done']),
  occurrenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lotNumber: z.string().optional(),
  siteDisplay: z.string().optional(),
  doseQuantity: z.string().optional(),
  doseUnit: z.string().optional(),
});

export async function immunizationRoutes(app: FastifyInstance) {
  const service = new ImmunizationService();

  app.post<{ Params: { patientId: string } }>('/:patientId/immunizations', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const body = immunizationSchema.parse(request.body);
    const immunization = await service.create(request.params.patientId, body, request.user!.sub);
    reply.code(201).send(immunization);
  });

  app.get<{ Params: { patientId: string } }>('/:patientId/immunizations', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request) => {
    return service.listByPatient(request.params.patientId);
  });

  app.get<{ Params: { patientId: string; id: string } }>('/:patientId/immunizations/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const imm = await service.getById(request.params.id);
    if (!imm) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Immunization not found' } });
      return;
    }
    return imm;
  });

  app.put<{ Params: { patientId: string; id: string } }>('/:patientId/immunizations/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    const body = immunizationSchema.partial().parse(request.body);
    const imm = await service.update(request.params.id, body);
    if (!imm) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Immunization not found' } });
      return;
    }
    return imm;
  });

  app.delete<{ Params: { patientId: string; id: string } }>('/:patientId/immunizations/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request, reply) => {
    await service.delete(request.params.id);
    reply.code(204).send();
  });
}
