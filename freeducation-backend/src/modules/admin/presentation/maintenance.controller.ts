import type { RequestContext } from '../../../shared/kernel/router';
import { jsonResponse } from '../../../shared/kernel/http';
import { MaintenanceService } from '../application/maintenance.service';

export class MaintenanceController {
  constructor(private service: MaintenanceService) {}

  async reconcile(ctx: RequestContext): Promise<Response> {
    try {
      const result = await this.service.reconcileSchema();
      return jsonResponse(200, { success: true, data: result });
    } catch (error) {
      return jsonResponse(500, {
        success: false,
        error: error instanceof Error ? error.message : 'Maintenance failed'
      });
    }
  }
}
