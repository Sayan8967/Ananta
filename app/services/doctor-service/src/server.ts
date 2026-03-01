import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createLogger } from '@ananta/common';
import { connectMongo } from '@ananta/db-client';
import { authPlugin } from '@ananta/auth-client';
import { healthRoutes } from './routes/health.js';
import { patientLookupRoutes } from './routes/patient-lookup.js';
import { clinicalNotesRoutes } from './routes/clinical-notes.js';

const logger = createLogger('doctor-service');

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

  // Auth middleware
  await app.register(authPlugin);

  // API routes
  await app.register(patientLookupRoutes, { prefix: '/api/v1/doctor' });
  await app.register(clinicalNotesRoutes, { prefix: '/api/v1/doctor' });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    logger.error({ err: error, url: request.url }, 'Request error');

    const statusCode = (error as any).statusCode || 500;
    reply.code(statusCode).send({
      error: {
        code: (error as any).code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  });

  return app;
}

async function start() {
  const port = parseInt(process.env.PORT || '3002', 10);

  try {
    await connectMongo();
    logger.info('Connected to MongoDB');

    const app = await buildApp();
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`Doctor service listening on port ${port}`);
  } catch (err) {
    logger.error(err, 'Failed to start doctor service');
    process.exit(1);
  }
}

start();
