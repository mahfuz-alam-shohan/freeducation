import type { RequestContext } from '../../../shared/kernel/router';
import { jsonResponse } from '../../../shared/kernel/http';
import { ApiManagementService } from '../application/api-management.service';

export class ApiManagementController {
  constructor(private service: ApiManagementService) {}

  async list(ctx: RequestContext): Promise<Response> {
    try {
      const data = await this.service.listEndpoints();
      return jsonResponse(200, { success: true, data });
    } catch (error) {
      return jsonResponse(500, { success: false, error: this.formatError(error) });
    }
  }

  async get(ctx: RequestContext): Promise<Response> {
    try {
      const endpoint = await this.service.getEndpoint(ctx.params.id);
      if (!endpoint) {
        return jsonResponse(404, { success: false, error: 'Endpoint not found' });
      }
      return jsonResponse(200, { success: true, data: endpoint });
    } catch (error) {
      return jsonResponse(500, { success: false, error: this.formatError(error) });
    }
  }

  async create(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const created = await this.service.createEndpoint(payload);
      return jsonResponse(201, { success: true, data: created });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async update(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const updated = await this.service.updateEndpoint(ctx.params.id, payload);
      return jsonResponse(200, { success: true, data: updated });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async createKey(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const label = String(payload.label || 'Primary key');
      const result = await this.service.createKey(ctx.params.id, label);
      return jsonResponse(201, { success: true, data: result.keyInfo, key: result.key });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async updateKey(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const updated = await this.service.updateKey(ctx.params.keyId, payload);
      return jsonResponse(200, { success: true, data: updated });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async rotateKey(ctx: RequestContext): Promise<Response> {
    try {
      const result = await this.service.rotateKey(ctx.params.keyId);
      return jsonResponse(200, { success: true, data: result.keyInfo, key: result.key });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  async deleteKey(ctx: RequestContext): Promise<Response> {
    try {
      await this.service.deleteKey(ctx.params.keyId);
      return jsonResponse(200, { success: true });
    } catch (error) {
      return jsonResponse(400, { success: false, error: this.formatError(error) });
    }
  }

  private formatError(error: unknown): string {
    return error instanceof Error ? error.message : 'API request failed';
  }
}
