import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createLogger } from '@ananta/common';
import { authPlugin } from '@ananta/auth-client';
import { healthRoutes } from './routes/health.js';
import { consentRoutes } from './routes/consent.js';
import { sessionRoutes } from './routes/session.js';

const logger = createLogger('auth-service');

export async function buildApp() {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(authPlugin);
  await app.register(consentRoutes, { prefix: '/api/v1/auth/consent' });
  await app.register(sessionRoutes, { prefix: '/api/v1/auth' });

  app.setErrorHandler((error, _request, reply) => {
    logger.error({ err: error }, 'Request error');
    reply.code((error as any).statusCode || 500).send({
      error: { code: (error as any).code || 'INTERNAL_ERROR', message: error.message },
    });
  });
  return app;
}

async function start() {
  const port = parseInt(process.env.PORT || '3004', 10);
  try {
    const app = await buildApp();
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`Auth service listening on port ${port}`);
  } catch (err) {
    logger.error(err, 'Failed to start auth service');
    process.exit(1);
  }
}
start();
