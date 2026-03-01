import type { FastifyInstance } from 'fastify';
import { getDb } from '@ananta/db-client';
import { sql } from 'drizzle-orm';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/live', async () => {
    return { status: 'ok', service: 'doctor-service' };
  });

  app.get('/ready', async (_request, reply) => {
    try {
      const db = getDb();
      await db.execute(sql`SELECT 1`);
      return { status: 'ready', service: 'doctor-service' };
    } catch {
      reply.code(503).send({ status: 'not ready', service: 'doctor-service' });
    }
  });
}
