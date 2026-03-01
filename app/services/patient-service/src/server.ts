import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createLogger } from '@ananta/common';
import { connectMongo } from '@ananta/db-client';
import { authPlugin } from '@ananta/auth-client';
import { patientRoutes } from './routes/patient.js';
import { conditionRoutes } from './routes/condition.js';
import { medicationRoutes } from './routes/medication.js';
import { allergyRoutes } from './routes/allergy.js';
import { immunizationRoutes } from './routes/immunization.js';
import { timelineRoutes } from './routes/timeline.js';
import { prescriptionRoutes } from './routes/prescription.js';
import { healthRoutes } from './routes/health.js';

const logger = createLogger('patient-service');

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
  await app.register(patientRoutes, { prefix: '/api/v1/patient/patients' });
  await app.register(conditionRoutes, { prefix: '/api/v1/patient/patients' });
  await app.register(medicationRoutes, { prefix: '/api/v1/patient/patients' });
  await app.register(allergyRoutes, { prefix: '/api/v1/patient/patients' });
  await app.register(immunizationRoutes, { prefix: '/api/v1/patient/patients' });
  await app.register(timelineRoutes, { prefix: '/api/v1/patient/patients' });
  await app.register(prescriptionRoutes, { prefix: '/api/v1/patient/patients' });

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
  const port = parseInt(process.env.PORT || '3001', 10);

  try {
    await connectMongo();
    logger.info('Connected to MongoDB');

    const app = await buildApp();
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`Patient service listening on port ${port}`);
  } catch (err) {
    logger.error(err, 'Failed to start patient service');
    process.exit(1);
  }
}

start();
