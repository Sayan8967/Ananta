import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { PatientSummaryService } from '../services/patient-summary-service.js';
import { ilike, or, sql } from 'drizzle-orm';
import { getDb, patients } from '@ananta/db-client';

export async function patientLookupRoutes(app: FastifyInstance) {
  const summaryService = new PatientSummaryService();

  // GET /api/v1/doctor/patients/search - Search patients (doctor/admin only)
  app.get('/patients/search', {
    preHandler: [checkRole(ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{
    Querystring: { q?: string; phone?: string; limit?: string };
  }>, reply: FastifyReply) => {
    const { q, phone, limit = '10' } = request.query;
    const maxLimit = Math.min(parseInt(limit, 10) || 10, 50);
    const db = getDb();

    const conditions = [];

    if (q) {
      conditions.push(
        or(
          ilike(patients.givenName, `%${q}%`),
          ilike(patients.familyName, `%${q}%`),
          ilike(patients.email, `%${q}%`),
        ),
      );
    }

    if (phone) {
      conditions.push(ilike(patients.phone, `%${phone}%`));
    }

    if (conditions.length === 0) {
      reply.code(400).send({
        error: { code: 'VALIDATION_ERROR', message: 'At least one search parameter (q or phone) is required' },
      });
      return;
    }

    const whereClause = conditions.length === 1 ? conditions[0] : or(...conditions);

    const results = await db.select({
      id: patients.id,
      fhirId: patients.fhirId,
      givenName: patients.givenName,
      familyName: patients.familyName,
      birthDate: patients.birthDate,
      gender: patients.gender,
      phone: patients.phone,
      email: patients.email,
    }).from(patients)
      .where(whereClause)
      .limit(maxLimit);

    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(patients)
      .where(whereClause);

    return {
      data: results,
      total: Number(countResult.count),
      limit: maxLimit,
    };
  });

  // GET /api/v1/doctor/patients/:patientId/summary - AI-generated patient summary
  app.get('/patients/:patientId/summary', {
    preHandler: [checkRole(ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { patientId: string } }>, reply: FastifyReply) => {
    const summary = await summaryService.generateSummary(request.params.patientId);
    if (!summary) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
      return;
    }
    return summary;
  });
}
