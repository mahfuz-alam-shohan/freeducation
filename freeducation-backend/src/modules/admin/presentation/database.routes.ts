import type { Router, Handler } from '../../../shared/kernel/router';
import { DatabaseService } from '../application/database.service';
import { DatabaseController } from './database.controller';

export function registerDatabaseRoutes(router: Router, db: D1Database, adminGuard: (handler: Handler) => Handler): void {
  const service = new DatabaseService(db);
  const controller = new DatabaseController(service);

  router.add('GET', '/api/v1/admin/db/tables', adminGuard((ctx) => controller.listTables(ctx)));
  router.add('GET', '/api/v1/admin/db/table/:table', adminGuard((ctx) => controller.getTable(ctx)));
  router.add('DELETE', '/api/v1/admin/db/table/:table', adminGuard((ctx) => controller.dropTable(ctx)));
  router.add('POST', '/api/v1/admin/db/table/:table/truncate', adminGuard((ctx) => controller.truncateTable(ctx)));
  router.add('DELETE', '/api/v1/admin/db/table/:table/row', adminGuard((ctx) => controller.deleteRow(ctx)));
}
