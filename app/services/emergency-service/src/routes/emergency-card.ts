import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, type TokenPayload } from '@ananta/auth-client';
import { EmergencyCardService } from '../services/emergency-card-service.js';
import { createLogger } from '@ananta/common';

const logger = createLogger('emergency-card-routes');

// Helper to verify auth for specific routes (since this plugin has mixed auth)
async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<TokenPayload | null> {
  const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
  const realm = process.env.KEYCLOAK_REALM || 'ananta';

  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } });
    return null;
  }

  const token = authHeader.slice(7);
  try {
    return await verifyToken(token, keycloakUrl, realm);
  } catch {
    reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
    return null;
  }
}

export async function emergencyCardRoutes(app: FastifyInstance) {
  const service = new EmergencyCardService();

  // POST /api/v1/emergency/cards - Generate emergency card (patient-auth required)
  app.post('/cards', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await requireAuth(request, reply);
    if (!user) return;

    const userRoles = user.realm_access?.roles || [];
    if (!userRoles.includes('patient') && !userRoles.includes('admin')) {
      reply.code(403).send({ error: { code: 'FORBIDDEN', message: 'Only patients can generate emergency cards' } });
      return;
    }

    const patientId = user.ananta_patient_id || user.sub;
    const card = await service.generateCard(patientId);

    reply.code(201).send(card);
  });

  // GET /api/v1/emergency/cards/:accessCode - View emergency card (NO auth - access code is authentication)
  app.get('/cards/:accessCode', async (request: FastifyRequest<{
    Params: { accessCode: string };
  }>, reply: FastifyReply) => {
    const card = await service.getByAccessCode(request.params.accessCode);

    if (!card) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Emergency card not found or expired' } });
      return;
    }

    return card;
  });

  // DELETE /api/v1/emergency/cards/:cardId - Revoke card (patient-auth required)
  app.delete('/cards/:cardId', async (request: FastifyRequest<{
    Params: { cardId: string };
  }>, reply: FastifyReply) => {
    const user = await requireAuth(request, reply);
    if (!user) return;

    const userRoles = user.realm_access?.roles || [];
    if (!userRoles.includes('patient') && !userRoles.includes('admin')) {
      reply.code(403).send({ error: { code: 'FORBIDDEN', message: 'Only the patient or admin can revoke cards' } });
      return;
    }

    await service.revokeCard(request.params.cardId);
    reply.code(204).send();
  });
}
