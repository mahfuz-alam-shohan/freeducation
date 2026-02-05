import type { RequestContext } from '../../../../shared/kernel/router';
import { jsonResponse } from '../../../../shared/kernel/http';
import { SubjectService } from '../../application/subject.service';
import { noteCreateSchema } from '../schemas/notes.schema';
import { questionCreateSchema, questionUpdateSchema } from '../schemas/questions.schema';
import { topicCreateSchema, topicUpdateSchema } from '../schemas/topics.schema';
import { videoCreateSchema } from '../schemas/videos.schema';

export class TopicsController {
  constructor(private service: SubjectService) {}

  async list(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    const topics = await this.service.listTopics(chapterId);
    return jsonResponse(200, { success: true, data: topics });
  }

  async create(ctx: RequestContext): Promise<Response> {
    const chapterId = Number(ctx.params.chapterId);
    if (!Number.isFinite(chapterId)) {
      return jsonResponse(400, { success: false, error: 'Invalid chapter id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = topicCreateSchema.parse(payload);
      const topic = await this.service.createTopic(chapterId, data.name, data.imageKey ?? null);
      return jsonResponse(201, { success: true, data: topic });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async update(ctx: RequestContext): Promise<Response> {
    const topicId = Number(ctx.params.topicId);
    if (!Number.isFinite(topicId)) {
      return jsonResponse(400, { success: false, error: 'Invalid topic id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = topicUpdateSchema.parse(payload);
      const topic = await this.service.updateTopic(topicId, data);
      if (!topic) {
        return jsonResponse(404, { success: false, error: 'Topic not found' });
      }
      return jsonResponse(200, { success: true, data: topic });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async remove(ctx: RequestContext): Promise<Response> {
    const topicId = Number(ctx.params.topicId);
    if (!Number.isFinite(topicId)) {
      return jsonResponse(400, { success: false, error: 'Invalid topic id' });
    }
    const ok = await this.service.deleteTopic(topicId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Topic not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async get(ctx: RequestContext): Promise<Response> {
    const topicId = Number(ctx.params.topicId);
    if (!Number.isFinite(topicId)) {
      return jsonResponse(400, { success: false, error: 'Invalid topic id' });
    }
    const result = await this.service.getTopicDetail(topicId);
    if (!result) {
      return jsonResponse(404, { success: false, error: 'Topic not found' });
    }
    return jsonResponse(200, { success: true, data: result });
  }

  async addNote(ctx: RequestContext): Promise<Response> {
    const topicId = Number(ctx.params.topicId);
    if (!Number.isFinite(topicId)) {
      return jsonResponse(400, { success: false, error: 'Invalid topic id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = noteCreateSchema.parse(payload);
      const note = await this.service.addTopicNote(topicId, data.note, data.imageKey ?? null);
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
    const ok = await this.service.deleteTopicNote(noteId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Note not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async addVideo(ctx: RequestContext): Promise<Response> {
    const topicId = Number(ctx.params.topicId);
    if (!Number.isFinite(topicId)) {
      return jsonResponse(400, { success: false, error: 'Invalid topic id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = videoCreateSchema.parse(payload);
      const video = await this.service.addTopicVideo(topicId, data);
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
    const ok = await this.service.deleteTopicVideo(videoId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Video not found' });
    }
    return jsonResponse(200, { success: true });
  }

  async addQuestion(ctx: RequestContext): Promise<Response> {
    const topicId = Number(ctx.params.topicId);
    if (!Number.isFinite(topicId)) {
      return jsonResponse(400, { success: false, error: 'Invalid topic id' });
    }
    try {
      const payload = await ctx.request.json();
      const data = questionCreateSchema.parse(payload);
      const question = await this.service.addTopicQuestion(topicId, data);
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
      const question = await this.service.updateTopicQuestion(questionId, data);
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
    const ok = await this.service.deleteTopicQuestion(questionId);
    if (!ok) {
      return jsonResponse(404, { success: false, error: 'Question not found' });
    }
    return jsonResponse(200, { success: true });
  }
}
