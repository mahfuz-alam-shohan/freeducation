import type { Chapter } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class ChaptersService {
  constructor(private repo: SubjectRepository) {}

  async listChapters(subjectId: number, nodeId: number): Promise<Chapter[]> {
    return await this.repo.listChapters(subjectId, nodeId);
  }

  async createChapter(subjectId: number, nodeId: number, name: string, imageKey: string | null): Promise<Chapter> {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      throw new Error('Chapter name is too short');
    }
    return await this.repo.createChapter(subjectId, nodeId, trimmed, imageKey);
  }

  async updateChapter(chapterId: number, updates: { name?: string; imageKey?: string | null }): Promise<Chapter | null> {
    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
      if (updates.name.length < 2) {
        throw new Error('Chapter name is too short');
      }
    }
    return await this.repo.updateChapter(chapterId, updates);
  }

  async deleteChapter(chapterId: number): Promise<boolean> {
    return await this.repo.deleteChapter(chapterId);
  }
}
