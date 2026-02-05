import type { RequestContext } from '../../../shared/kernel/router';
import { jsonResponse } from '../../../shared/kernel/http';
import { ModuleTemplateService } from '../application/module-template.service';

export class ModuleTemplateController {
  constructor(private service: ModuleTemplateService) {}

  async listCategories(_ctx: RequestContext): Promise<Response> {
    const categories = await this.service.listCategories();
    return jsonResponse(200, { success: true, data: categories });
  }

  async listSubjectTemplates(_ctx: RequestContext): Promise<Response> {
    const templates = await this.service.listSubjectTemplates();
    return jsonResponse(200, { success: true, data: templates });
  }

  async getSubjectTemplate(ctx: RequestContext): Promise<Response> {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return jsonResponse(400, { success: false, error: 'Invalid module id' });
    }

    const result = await this.service.getSubjectTemplate(id);
    if (!result) {
      return jsonResponse(404, { success: false, error: 'Module not found' });
    }

    return jsonResponse(200, { success: true, data: result });
  }
}
