import { SchemaManager, type ReconcileResult } from '../../../shared/infrastructure/schema.manager';
import { TABLE_DEFINITIONS } from '../../../migrations/schema';

export class MaintenanceService {
  constructor(private db: D1Database) {}

  async reconcileSchema(): Promise<ReconcileResult> {
    const manager = new SchemaManager(this.db, TABLE_DEFINITIONS);
    return await manager.reconcile();
  }
}
