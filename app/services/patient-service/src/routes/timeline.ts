import type { FastifyInstance, FastifyRequest } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { TimelineService } from '../services/timeline-service.js';

export async function timelineRoutes(app: FastifyInstance) {
  const service = new TimelineService();

  app.get('/:patientId/timeline', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{
    Params: { patientId: string };
    Querystring: { from?: string; to?: string; types?: string; limit?: string; offset?: string };
  }>) => {
    const { from, to, types, limit = '50', offset = '0' } = request.query;
    const typeList = types?.split(',') || undefined;
    return service.getTimeline(
      request.params.patientId,
      { from, to, types: typeList, limit: parseInt(limit, 10), offset: parseInt(offset, 10) },
    );
  });
}
