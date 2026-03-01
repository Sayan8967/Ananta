import type { FastifyInstance, FastifyRequest } from 'fastify';

export async function sessionRoutes(app: FastifyInstance) {
  app.get('/session', async (request: FastifyRequest) => {
    if (!request.user) return { authenticated: false };
    return {
      authenticated: true,
      user: {
        id: request.user.sub,
        email: request.user.email,
        name: request.user.name,
        roles: request.user.realm_access?.roles || [],
      },
    };
  });

  app.post('/logout', async (_request, reply) => {
    reply.code(200).send({ message: 'Logged out' });
  });
}
