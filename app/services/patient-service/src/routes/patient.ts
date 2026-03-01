import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { PatientService } from '../services/patient-service.js';
import { z } from 'zod';

const createPatientSchema = z.object({
  givenName: z.string().min(1),
  familyName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  addressLine: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressPostal: z.string().optional(),
  addressCountry: z.string().optional(),
  bloodType: z.string().optional(),
});

const updatePatientSchema = createPatientSchema.partial();

export async function patientRoutes(app: FastifyInstance) {
  const service = new PatientService();

  // GET /me - current patient profile
  app.get('/me', {
    preHandler: [checkRole(ROLES.PATIENT)],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const patientId = request.user!.ananta_patient_id || request.user!.sub;
    const patient = await service.getByFhirId(patientId);
    if (!patient) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Patient profile not found' } });
      return;
    }
    return patient;
  });

  // POST / - create patient
  app.post('/', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.ADMIN, ROLES.DOCTOR)],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createPatientSchema.parse(request.body);
    const patient = await service.create(body, request.user!.sub);
    reply.code(201).send(patient);
  });

  // GET /:id - get patient by ID
  app.get('/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const patient = await service.getById(request.params.id);
    if (!patient) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
      return;
    }
    return patient;
  });

  // PUT /:id - update patient
  app.put('/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const body = updatePatientSchema.parse(request.body);
    const patient = await service.update(request.params.id, body, request.user!.sub);
    if (!patient) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
      return;
    }
    return patient;
  });

  // GET / - list patients (doctor/admin)
  app.get('/', {
    preHandler: [checkRole(ROLES.DOCTOR, ROLES.ADMIN)],
  }, async (request: FastifyRequest<{ Querystring: { q?: string; limit?: string; offset?: string } }>) => {
    const { q, limit = '20', offset = '0' } = request.query;
    return service.search(q, parseInt(limit, 10), parseInt(offset, 10));
  });
}
