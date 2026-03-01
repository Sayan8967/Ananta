import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyToken, type TokenPayload } from './keycloak.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

async function authPluginFn(fastify: FastifyInstance) {
  const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
  const realm = process.env.KEYCLOAK_REALM || 'ananta';

  fastify.decorateRequest('user', undefined);

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip auth for health endpoints
    if (request.url.startsWith('/health')) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } });
      return;
    }

    const token = authHeader.slice(7);
    try {
      request.user = await verifyToken(token, keycloakUrl, realm);
    } catch {
      reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
    }
  });
}

export const authPlugin = fp(authPluginFn, {
  name: 'ananta-auth',
  fastify: '5.x',
});
