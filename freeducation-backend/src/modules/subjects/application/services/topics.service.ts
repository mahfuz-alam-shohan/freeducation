import type { Topic } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class TopicsService {
  constructor(private repo: SubjectRepository) {}

  async listTopics(chapterId: number): Promise<Topic[]> {
    return await this.repo.listTopics(chapterId);
  }

  async createTopic(chapterId: number, name: string, imageKey: string | null): Promise<Topic> {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      throw new Error('Topic name is too short');
    }
    return await this.repo.createTopic(chapterId, trimmed, imageKey);
  }

  async updateTopic(topicId: number, updates: { name?: string; imageKey?: string | null }): Promise<Topic | null> {
    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
      if (updates.name.length < 2) {
        throw new Error('Topic name is too short');
      }
    }
    return await this.repo.updateTopic(topicId, updates);
  }

  async deleteTopic(topicId: number): Promise<boolean> {
    return await this.repo.deleteTopic(topicId);
  }
}
