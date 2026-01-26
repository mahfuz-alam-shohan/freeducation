import type { Router, Handler } from '../../../shared/kernel/router';
import { ApiManagementService } from '../application/api-management.service';
import { ApiManagementController } from './api.controller';

export function registerApiManagementRoutes(router: Router, db: D1Database, adminGuard: (handler: Handler) => Handler): void {
  const service = new ApiManagementService(db);
  const controller = new ApiManagementController(service);

  router.add('GET', '/api/v1/admin/api/endpoints', adminGuard((ctx) => controller.list(ctx)));
  router.add('POST', '/api/v1/admin/api/endpoints', adminGuard((ctx) => controller.create(ctx)));
  router.add('GET', '/api/v1/admin/api/endpoints/:id', adminGuard((ctx) => controller.get(ctx)));
  router.add('PATCH', '/api/v1/admin/api/endpoints/:id', adminGuard((ctx) => controller.update(ctx)));
  router.add('POST', '/api/v1/admin/api/endpoints/:id/keys', adminGuard((ctx) => controller.createKey(ctx)));
  router.add('PATCH', '/api/v1/admin/api/keys/:keyId', adminGuard((ctx) => controller.updateKey(ctx)));
  router.add('POST', '/api/v1/admin/api/keys/:keyId/rotate', adminGuard((ctx) => controller.rotateKey(ctx)));
  router.add('DELETE', '/api/v1/admin/api/keys/:keyId', adminGuard((ctx) => controller.deleteKey(ctx)));
}
