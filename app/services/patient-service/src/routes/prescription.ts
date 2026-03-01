import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkRole, ROLES } from '@ananta/auth-client';
import { PrescriptionService } from '../services/prescription-service.js';
import { z } from 'zod';

const confirmSchema = z.object({
  medications: z.array(z.object({
    medicationDisplay: z.string(),
    medicationCode: z.string().optional(),
    dosageText: z.string().optional(),
    dosageFrequency: z.string().optional(),
    dosageRoute: z.string().optional(),
    effectiveStart: z.string().optional(),
    effectiveEnd: z.string().optional(),
  })),
});

export async function prescriptionRoutes(app: FastifyInstance) {
  const service = new PrescriptionService();

  // Upload prescription image
  app.post('/:patientId/prescriptions', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR)],
  }, async (request: FastifyRequest<{ Params: { patientId: string } }>, reply: FastifyReply) => {
    // In production, this would handle multipart file upload to S3
    // For MVP, accept a JSON body with imageUrl
    const body = request.body as { imageUrl: string };
    if (!body.imageUrl) {
      reply.code(400).send({ error: { code: 'VALIDATION_ERROR', message: 'imageUrl is required' } });
      return;
    }

    const prescription = await service.create(request.params.patientId, body.imageUrl, request.user!.sub);
    reply.code(201).send(prescription);
  });

  // List prescriptions
  app.get('/:patientId/prescriptions', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR)],
  }, async (request: FastifyRequest<{ Params: { patientId: string } }>) => {
    return service.listByPatient(request.params.patientId);
  });

  // Get prescription with OCR status
  app.get('/:patientId/prescriptions/:id', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    const prescription = await service.getById(request.params.id);
    if (!prescription) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Prescription not found' } });
      return;
    }
    return prescription;
  });

  // Confirm extracted medications from prescription
  app.post('/:patientId/prescriptions/:id/confirm', {
    preHandler: [checkRole(ROLES.PATIENT, ROLES.DOCTOR)],
  }, async (request: FastifyRequest<{ Params: { patientId: string; id: string } }>, reply: FastifyReply) => {
    const body = confirmSchema.parse(request.body);
    const result = await service.confirmExtraction(
      request.params.patientId,
      request.params.id,
      body.medications,
      request.user!.sub,
    );
    return result;
  });
}
