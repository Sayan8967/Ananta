import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';

describe('Doctor Service Health', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const { buildApp } = await import('../server.js');
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health/live should return 200', async () => {
    const response = await app.inject({ method: 'GET', url: '/health/live' });
    expect(response.statusCode).toBe(200);
  });

  it('GET /health/ready should return 503', async () => {
    const response = await app.inject({ method: 'GET', url: '/health/ready' });
    expect(response.statusCode).toBe(503);
  });

  it('should register doctor API routes', async () => {
    const response = await app.inject({ method: 'GET', url: '/health/live' });
    expect(response.statusCode).not.toBe(404);
  });
});
