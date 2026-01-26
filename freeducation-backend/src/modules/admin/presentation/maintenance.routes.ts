import type { Router, Handler } from '../../../shared/kernel/router';
import { MaintenanceService } from '../application/maintenance.service';
import { MaintenanceController } from './maintenance.controller';

export function registerMaintenanceRoutes(router: Router, db: D1Database, adminGuard: (handler: Handler) => Handler): void {
  const service = new MaintenanceService(db);
  const controller = new MaintenanceController(service);

  router.add('POST', '/api/v1/admin/maintenance/reconcile', adminGuard((ctx) => controller.reconcile(ctx)));
}
