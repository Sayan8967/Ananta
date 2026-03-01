import { describe, it, expect, vi } from 'vitest';
import { checkRole, checkPermission, ROLES } from '../rbac.js';

function createMockRequest(user?: any) {
  return { user } as any;
}

function createMockReply() {
  const reply: any = {};
  reply.code = vi.fn().mockReturnValue(reply);
  reply.send = vi.fn().mockReturnValue(reply);
  return reply;
}

describe('checkRole', () => {
  it('should allow access when user has required role', async () => {
    const middleware = checkRole(ROLES.PATIENT);
    const request = createMockRequest({
      sub: 'user-1',
      realm_access: { roles: ['patient'] },
    });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).not.toHaveBeenCalled();
  });

  it('should deny access when user lacks required role', async () => {
    const middleware = checkRole(ROLES.DOCTOR);
    const request = createMockRequest({
      sub: 'user-1',
      realm_access: { roles: ['patient'] },
    });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });

  it('should return 401 when no user on request', async () => {
    const middleware = checkRole(ROLES.PATIENT);
    const request = createMockRequest(undefined);
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).toHaveBeenCalledWith(401);
  });

  it('should allow when any of multiple roles match', async () => {
    const middleware = checkRole(ROLES.DOCTOR, ROLES.ADMIN);
    const request = createMockRequest({
      sub: 'user-1',
      realm_access: { roles: ['admin'] },
    });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).not.toHaveBeenCalled();
  });

  it('should handle missing realm_access gracefully', async () => {
    const middleware = checkRole(ROLES.PATIENT);
    const request = createMockRequest({ sub: 'user-1' });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });
});

describe('checkPermission', () => {
  it('should allow access with correct permission', async () => {
    const middleware = checkPermission('read:patients');
    const request = createMockRequest({
      sub: 'user-1',
      resource_access: { 'ananta-backend': { roles: ['read:patients'] } },
    });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).not.toHaveBeenCalled();
  });

  it('should deny access without permission', async () => {
    const middleware = checkPermission('write:patients');
    const request = createMockRequest({
      sub: 'user-1',
      resource_access: { 'ananta-backend': { roles: ['read:patients'] } },
    });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });

  it('should return 401 when no user', async () => {
    const middleware = checkPermission('read:patients');
    const request = createMockRequest(undefined);
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).toHaveBeenCalledWith(401);
  });

  it('should deny when client access is missing', async () => {
    const middleware = checkPermission('read:patients');
    const request = createMockRequest({
      sub: 'user-1',
      resource_access: {},
    });
    const reply = createMockReply();

    await middleware(request, reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });
});
