import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/live', async () => ({ status: 'ok', service: 'auth-service' }));
  app.get('/ready', async () => ({ status: 'ready', service: 'auth-service' }));
}
