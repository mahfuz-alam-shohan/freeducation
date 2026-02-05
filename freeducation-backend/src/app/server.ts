import type { Env } from '../shared/types/env';
import { loadConfig } from '../config/env';
import { Router } from '../shared/kernel/router';
import { getCookie, jsonResponse } from '../shared/kernel/http';
import { createAdminGuard } from '../shared/kernel/middleware';
import { AuthService } from '../modules/auth/application/auth.service';
import { UserService } from '../modules/users/application/user.service';
import { registerAuthRoutes } from '../modules/auth/presentation/auth.routes';
import { registerUserRoutes } from '../modules/users/presentation/user.routes';
import { getAdminAsset } from '../modules/admin/presentation/admin.assets';
import { registerMaintenanceRoutes } from '../modules/admin/presentation/maintenance.routes';
import { registerDatabaseRoutes } from '../modules/admin/presentation/database.routes';
import { registerApiManagementRoutes } from '../modules/admin/presentation/api.routes';
import { ApiAccessService } from '../modules/api-access/application/api-access.service';
import { ModuleTemplateService } from '../modules/module-templates/application/module-template.service';
import { registerModuleTemplateRoutes } from '../modules/module-templates/presentation/module-template.routes';
import { SubjectService } from '../modules/subjects/application/subject.service';
import { registerSubjectRoutes } from '../modules/subjects/presentation/subject.routes';
import { registerMediaRoutes } from '../modules/admin/presentation/media.routes';

export function createServer(env: Env) {
  const config = loadConfig(env);
  const authService = new AuthService(env.DB, config);
  const userService = new UserService(env.DB);
  const apiAccessService = new ApiAccessService(env.DB);
  const moduleTemplateService = new ModuleTemplateService(env.DB);
  const subjectService = new SubjectService(env.DB);
  const adminGuard = createAdminGuard(authService, config.sessionCookieName);
  const router = new Router();

  router.add('GET', '/api/v1/health', async () => {
    return jsonResponse(200, { success: true, status: 'ok' });
  });

  registerAuthRoutes(router, authService, config);
  registerUserRoutes(router, userService, adminGuard);
  registerModuleTemplateRoutes(router, moduleTemplateService, adminGuard);
  registerSubjectRoutes(router, subjectService, adminGuard);
  registerMaintenanceRoutes(router, env.DB, adminGuard);
  registerDatabaseRoutes(router, env.DB, adminGuard);
  registerApiManagementRoutes(router, env.DB, adminGuard);
  registerMediaRoutes(router, adminGuard);

  async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method.toUpperCase() === 'OPTIONS') {
      return applyCors(new Response(null, { status: 204 }), config);
    }

    if (!pathname.startsWith('/api/')) {
      const targetPath = pathname === '/' ? '/admin' : pathname;
      const adminAsset = getAdminAsset(targetPath) || getAdminAsset('/admin');
      if (adminAsset) {
        return applyCors(adminAsset, config, true);
      }
    }

    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/v1/admin/api')) {
      const adminSession = await resolveAdminSession(request, authService, config.sessionCookieName);
      const apiKey = extractApiKey(request);
      const userId = adminSession?.userId ?? parseUserId(request.headers.get('x-user-id'));

      const decision = await apiAccessService.authorize({
        method: request.method,
        path: pathname,
        apiKey,
        userId,
        userRole: adminSession?.role ?? null,
        bypassKey: Boolean(adminSession)
      });

      if (!decision.allowed) {
        return applyCors(jsonResponse(decision.status, { success: false, error: decision.error || 'Access denied' }), config);
      }
    }

    const matched = await router.handle(request, env);
    if (matched) {
      return applyCors(matched, config);
    }

    return applyCors(jsonResponse(404, { success: false, error: 'Not found' }), config);
  }

  return { handle };
}

async function resolveAdminSession(request: Request, authService: AuthService, cookieName: string) {
  const token = getCookie(request, cookieName);
  if (!token) return null;
  return await authService.validateSession(token);
}

function extractApiKey(request: Request): string | null {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey) return headerKey.trim();
  const auth = request.headers.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  return null;
}

function parseUserId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function applyCors(response: Response, config: ReturnType<typeof loadConfig>, isAsset: boolean = false): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', config.corsOrigin);
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-KEY, X-User-Id, X-Admin-Setup-Secret');
  if (config.corsOrigin !== '*') {
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Vary', 'Origin');
  }

  if (isAsset) {
    headers.set('Cache-Control', 'public, max-age=300');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
