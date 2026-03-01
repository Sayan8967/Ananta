import type { FastifyInstance } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { ConsentService } from '../services/consent-service.js';
import { z } from 'zod';

const createConsentSchema = z.object({
  consentType: z.enum(['data-sharing', 'emergency-access', 'doctor-access', 'research']),
  grantedTo: z.string().uuid().optional(),
  scopeResources: z.array(z.string()),
  periodStart: z.string().optional().transform(v => v ? new Date(v) : undefined),
  periodEnd: z.string().optional().transform(v => v ? new Date(v) : undefined),
});

export async function consentRoutes(app: FastifyInstance) {
  const service = new ConsentService();

  app.get('/', { preHandler: [checkRole(ROLES.PATIENT, ROLES.ADMIN)] }, async (request) => {
    return service.listByPatient(request.user!.sub);
  });

  app.post('/', { preHandler: [checkRole(ROLES.PATIENT)] }, async (request, reply) => {
    const body = createConsentSchema.parse(request.body);
    const consent = await service.create(request.user!.sub, body);
    reply.code(201).send(consent);
  });

  app.put<{ Params: { id: string } }>('/:id', { preHandler: [checkRole(ROLES.PATIENT)] }, async (request, reply) => {
    const body = createConsentSchema.partial().parse(request.body);
    const consent = await service.update(request.params.id, body);
    if (!consent) { reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Consent not found' } }); return; }
    return consent;
  });

  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [checkRole(ROLES.PATIENT)] }, async (request, reply) => {
    await service.revoke(request.params.id);
    reply.code(204).send();
  });
}
