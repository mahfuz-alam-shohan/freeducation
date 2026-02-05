import type { RequestContext } from '../../../../shared/kernel/router';
import { jsonResponse } from '../../../../shared/kernel/http';
import { SubjectService } from '../../application/subject.service';
import { nodeOverrideSchema } from '../schemas/nodes.schema';
import { createSubjectSchema, labelUpdateSchema, updateSubjectSchema } from '../schemas/subjects.schema';

export class SubjectsController {
  constructor(private service: SubjectService) {}

  async list(ctx: RequestContext): Promise<Response> {
    const subjects = await this.service.listSubjects();
    return jsonResponse(200, { success: true, data: subjects });
  }

  async create(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const data = createSubjectSchema.parse(payload);
      const subject = await this.service.createSubject(data.name, data.templateId);
      return jsonResponse(201, { success: true, data: subject });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async get(ctx: RequestContext): Promise<Response> {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return jsonResponse(400, { success: false, error: 'Invalid subject id' });
    }
    const result = await this.service.getSubjectDetail(id);
    if (!result) {
      return jsonResponse(404, { success: false, error: 'Subject not found' });
    }
    return jsonResponse(200, { success: true, data: result });
  }

  async update(ctx: RequestContext): Promise<Response> {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return jsonResponse(400, { success: false, error: 'Invalid subject id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = updateSubjectSchema.parse(payload);
      const subject = await this.service.updateSubject(id, data);
      if (!subject) {
        return jsonResponse(404, { success: false, error: 'Subject not found' });
      }
      return jsonResponse(200, { success: true, data: subject });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async remove(ctx: RequestContext): Promise<Response> {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return jsonResponse(400, { success: false, error: 'Invalid subject id' });
    }
    const ok = await this.service.deleteSubject(id);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Subject not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async updateNode(ctx: RequestContext): Promise<Response> {
    const subjectId = Number(ctx.params.id);
    const nodeId = Number(ctx.params.nodeId);
    if (!Number.isFinite(subjectId) || !Number.isFinite(nodeId)) {
      return jsonResponse(400, { success: false, error: 'Invalid node request' });
    }
    try {
      const payload = await ctx.request.json();
      const data = nodeOverrideSchema.parse(payload);
      const displayName = data.displayName !== undefined ? data.displayName?.trim() || null : null;
      const imageKey = data.imageKey !== undefined ? data.imageKey || null : null;
      await this.service.updateNodeOverride(subjectId, nodeId, displayName, imageKey);
      return jsonResponse(200, { success: true });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async updateLabels(ctx: RequestContext): Promise<Response> {
    const subjectId = Number(ctx.params.id);
    if (!Number.isFinite(subjectId)) {
      return jsonResponse(400, { success: false, error: 'Invalid subject id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = labelUpdateSchema.parse(payload);
      await this.service.updateQuestionLabels(subjectId, data.typeLabels || {}, data.sectionLabels || {});
      return jsonResponse(200, { success: true });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }
}
