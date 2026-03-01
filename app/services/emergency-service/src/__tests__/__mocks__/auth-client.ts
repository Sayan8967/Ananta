import type { FastifyInstance } from 'fastify';

export const authPlugin = async (fastify: FastifyInstance) => {
  fastify.decorateRequest('user', undefined);
};
(authPlugin as any)[Symbol.for('skip-override')] = true;
(authPlugin as any)[Symbol.for('fastify.display-name')] = 'ananta-auth';

export const verifyToken = async () => ({
  sub: 'test-user',
  realm_access: { roles: ['patient'] },
});

export const checkRole = (..._roles: string[]) => async () => {};
export const checkPermission = (_perm: string) => async () => {};

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  EMERGENCY_RESPONDER: 'emergency-responder',
  NURSE: 'nurse',
} as const;
