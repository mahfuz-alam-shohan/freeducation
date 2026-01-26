import type { RequestContext, Handler } from './router';
import type { AuthSession } from '../types/auth';
import { getCookie, jsonResponse } from './http';

export interface SessionValidator {
  validateSession(token: string): Promise<AuthSession | null>;
}

export function createAdminGuard(sessionValidator: SessionValidator, cookieName: string) {
  return (handler: Handler): Handler => {
    return async (ctx: RequestContext): Promise<Response> => {
      const token = getCookie(ctx.request, cookieName);
      if (!token) {
        return jsonResponse(401, { success: false, error: 'Authentication required' });
      }

      const session = await sessionValidator.validateSession(token);
      if (!session) {
        return jsonResponse(401, { success: false, error: 'Invalid session' });
      }

      if (session.role !== 'admin') {
        return jsonResponse(403, { success: false, error: 'Insufficient permissions' });
      }

      ctx.auth = session;
      return await handler(ctx);
    };
  };
}
