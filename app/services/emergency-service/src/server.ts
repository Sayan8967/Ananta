import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createLogger } from '@ananta/common';
import { connectMongo } from '@ananta/db-client';
import { authPlugin } from '@ananta/auth-client';
import { healthRoutes } from './routes/health.js';
import { emergencyCardRoutes } from './routes/emergency-card.js';

const logger = createLogger('emergency-service');

export async function buildApp() {
  const app = Fastify({
    logger: false,
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Health check routes (no auth)
  await app.register(healthRoutes, { prefix: '/health' });

  // Emergency card routes (mixed auth - handled per-route)
  await app.register(emergencyCardRoutes, { prefix: '/api/v1/emergency' });

  // Global error handler
  app.setErrorHandler((error: Error & { statusCode?: number; code?: string }, request, reply) => {
    logger.error({ err: error, url: request.url }, 'Request error');

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  });

  return app;
}

async function start() {
  const port = parseInt(process.env.PORT || '3003', 10);

  try {
    await connectMongo();
    logger.info('Connected to MongoDB');

    const app = await buildApp();
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`Emergency service listening on port ${port}`);
  } catch (err) {
    logger.error(err, 'Failed to start emergency service');
    process.exit(1);
  }
}

start();
