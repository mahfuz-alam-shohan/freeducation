import type { Router } from '../../../shared/kernel/router';
import type { AppConfig } from '../../../config/env';
import { AuthService } from '../application/auth.service';
import { AuthController } from './auth.controller';

export function registerAuthRoutes(router: Router, authService: AuthService, config: AppConfig): void {
  const controller = new AuthController(authService, config);

  router.add('POST', '/api/v1/admin/bootstrap', (ctx) => controller.bootstrap(ctx));
  router.add('GET', '/api/v1/admin/bootstrap/status', (ctx) => controller.bootstrapStatus(ctx));
  router.add('POST', '/api/v1/admin/login', (ctx) => controller.login(ctx));
  router.add('POST', '/api/v1/admin/logout', (ctx) => controller.logout(ctx));
  router.add('GET', '/api/v1/admin/session', (ctx) => controller.session(ctx));
}
