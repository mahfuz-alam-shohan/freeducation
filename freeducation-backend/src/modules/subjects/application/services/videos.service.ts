import type { TopicVideoItem, VideoItem } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class VideosService {
  constructor(private repo: SubjectRepository) {}

  async addChapterVideo(chapterId: number, payload: { mode: VideoItem['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<VideoItem> {
    const title = payload.title.trim();
    if (!title) {
      throw new Error('Video title is required');
    }
    if (payload.mode === 'link' && !payload.url) {
      throw new Error('Video link is required');
    }
    if (payload.mode === 'upload' && !payload.fileKey) {
      throw new Error('Video file is required');
    }
    return await this.repo.addVideo(chapterId, { ...payload, title });
  }

  async deleteChapterVideo(videoId: number): Promise<boolean> {
    return await this.repo.deleteVideo(videoId);
  }

  async addTopicVideo(topicId: number, payload: { mode: TopicVideoItem['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<TopicVideoItem> {
    const title = payload.title.trim();
    if (!title) {
      throw new Error('Video title is required');
    }
    if (payload.mode === 'link' && !payload.url) {
      throw new Error('Video link is required');
    }
    if (payload.mode === 'upload' && !payload.fileKey) {
      throw new Error('Video file is required');
    }
    return await this.repo.addTopicVideo(topicId, { ...payload, title });
  }

  async deleteTopicVideo(videoId: number): Promise<boolean> {
    return await this.repo.deleteTopicVideo(videoId);
  }
}
