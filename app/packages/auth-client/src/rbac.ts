import type { FastifyRequest, FastifyReply } from 'fastify';

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  EMERGENCY_RESPONDER: 'emergency-responder',
  NURSE: 'nurse',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export function checkRole(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
      return;
    }

    const userRoles = request.user.realm_access?.roles || [];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      reply.code(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    }
  };
}

export function checkPermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
      return;
    }

    const clientAccess = request.user.resource_access?.['ananta-backend'];
    const hasPermission = clientAccess?.roles?.includes(permission);

    if (!hasPermission) {
      reply.code(403).send({ error: { code: 'FORBIDDEN', message: `Missing permission: ${permission}` } });
    }
  };
}
