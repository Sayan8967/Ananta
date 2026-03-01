import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';

// Workspace packages are aliased to mock files via vitest.config.ts resolve.alias

describe('Patient Service Health', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const { buildApp } = await import('../server.js');
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /health/live should return 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health/live',
    });
    expect(response.statusCode).toBe(200);
  });

  it('GET /health/ready should return 503 when DB is not connected', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health/ready',
    });
    // Without a real DB connection, readiness check returns 503
    expect(response.statusCode).toBe(503);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('not ready');
  });

  it('should return non-404 for protected routes (route is registered)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/patient/patients',
    });
    expect(response.statusCode).not.toBe(404);
  });

  it('should have all health route prefixes registered', async () => {
    const routes = ['/health/live', '/health/ready'];
    for (const url of routes) {
      const response = await app.inject({ method: 'GET', url });
      expect(response.statusCode).not.toBe(404);
    }
  });
});
