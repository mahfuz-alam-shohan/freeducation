import type { RequestContext } from '../../../shared/kernel/router';
import { jsonResponse } from '../../../shared/kernel/http';
import { DatabaseService } from '../application/database.service';

export class DatabaseController {
  constructor(private service: DatabaseService) {}

  async listTables(ctx: RequestContext): Promise<Response> {
    try {
      const tables = await this.service.listTables();
      return jsonResponse(200, { success: true, tables });
    } catch (error) {
      return jsonResponse(500, { success: false, error: this.formatError(error) });
    }
  }

  async getTable(ctx: RequestContext): Promise<Response> {
    try {
      const table = ctx.params.table;
      const limit = Number(ctx.query.get('limit') || 50);
      const offset = Number(ctx.query.get('offset') || 0);

      const data = await this.service.getTableData(table, limit, offset);
      return jsonResponse(200, { success: true, data });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async deleteRow(ctx: RequestContext): Promise<Response> {
    try {
      const table = ctx.params.table;
      const payload = await ctx.request.json();
      const primaryKey = String(payload.primaryKey || '');
      const value = payload.value;

      if (!primaryKey || value === undefined) {
        return jsonResponse(400, { success: false, error: 'primaryKey and value are required' });
      }

      await this.service.deleteRow(table, primaryKey, value);
      return jsonResponse(200, { success: true });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async truncateTable(ctx: RequestContext): Promise<Response> {
    try {
      const table = ctx.params.table;
      await this.service.truncateTable(table);
      return jsonResponse(200, { success: true });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async dropTable(ctx: RequestContext): Promise<Response> {
    try {
      const table = ctx.params.table;
      await this.service.dropTable(table);
      return jsonResponse(200, { success: true });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  private formatError(error: unknown): string {
    return error instanceof Error ? error.message : 'Database request failed';
  }
}
