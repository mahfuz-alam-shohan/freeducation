import type { RequestContext } from '../../../../shared/kernel/router';
import { jsonResponse } from '../../../../shared/kernel/http';
import { SubjectService } from '../../application/subject.service';
import { chapterCreateSchema, chapterUpdateSchema } from '../schemas/chapters.schema';
import { noteCreateSchema } from '../schemas/notes.schema';
import { questionCreateSchema, questionUpdateSchema } from '../schemas/questions.schema';
import { videoCreateSchema } from '../schemas/videos.schema';

export class ChaptersController {
  constructor(private service: SubjectService) {}

  async list(ctx: RequestContext): Promise<Response> {
    const subjectId = Number(ctx.params.id);
    const nodeId = Number(ctx.query.get('nodeId') || 0);
    if (!Number.isFinite(subjectId) || !Number.isFinite(nodeId) || !nodeId) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter request' });
    }
    const chapters = await this.service.listChapters(subjectId, nodeId);
    return jsonResponse(200, { success: true, data: chapters });
  }

  async create(ctx: RequestContext): Promise<Response> {
    const subjectId = Number(ctx.params.id);
    if (!Number.isFinite(subjectId)) {
      return jsonResponse(400, { success: false, error: 'Invalid subject id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = chapterCreateSchema.parse(payload);
      const chapter = await this.service.createChapter(subjectId, data.nodeId, data.name, data.imageKey ?? null);
      return jsonResponse(201, { success: true, data: chapter });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async update(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = chapterUpdateSchema.parse(payload);
      const chapter = await this.service.updateChapter(chapterId, data);
      if (!chapter) {
        return jsonResponse(404, { success: false, error: 'Chapter not found' });
      }
      return jsonResponse(200, { success: true, data: chapter });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async remove(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    const ok = await this.service.deleteChapter(chapterId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Chapter not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async get(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    const result = await this.service.getChapterDetail(chapterId);
    if (!result) {
      return jsonResponse(404, { success: false, error: 'Chapter not found' });
    }
    return jsonResponse(200, { success: true, data: result });
  }

  async addNote(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = noteCreateSchema.parse(payload);
      const note = await this.service.addNote(chapterId, data.note, data.imageKey ?? null);
      return jsonResponse(201, { success: true, data: note });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async deleteNote(ctx: RequestContext): Promise<Response> {
    const noteId = Number(ctx.params.noteId);
    if (!Number.isFinite(noteId)) {
      return jsonResponse(400, { success: false, error: 'Invalid note id' });
    }
    const ok = await this.service.deleteNote(noteId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Note not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async addVideo(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = videoCreateSchema.parse(payload);
      const video = await this.service.addVideo(chapterId, data);
      return jsonResponse(201, { success: true, data: video });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async deleteVideo(ctx: RequestContext): Promise<Response> {
    const videoId = Number(ctx.params.videoId);
    if (!Number.isFinite(videoId)) {
      return jsonResponse(400, { success: false, error: 'Invalid video id' });
    }
    const ok = await this.service.deleteVideo(videoId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Video not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async addQuestion(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = questionCreateSchema.parse(payload);
      const question = await this.service.addQuestion(chapterId, data);
      return jsonResponse(201, { success: true, data: question });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async updateQuestion(ctx: RequestContext): Promise<Response> {
    const questionId = Number(ctx.params.questionId);
    if (!Number.isFinite(questionId)) {
      return jsonResponse(400, { success: false, error: 'Invalid question id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = questionUpdateSchema.parse(payload);
      const question = await this.service.updateQuestion(questionId, data);
      if (!question) {
        return jsonResponse(404, { success: false, error: 'Question not found' });
      }
      return jsonResponse(200, { success: true, data: question });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async deleteQuestion(ctx: RequestContext): Promise<Response> {
    const questionId = Number(ctx.params.questionId);
    if (!Number.isFinite(questionId)) {
      return jsonResponse(400, { success: false, error: 'Invalid question id' });
    }
    const ok = await this.service.deleteQuestion(questionId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Question not found' });
    }
    return jsonResponse(200, { success: true });
  }
}
