import type { VideoRecord, TopicVideoRecord } from '../../domain/subject.types';

export class VideosRepository {
  constructor(private db: D1Database) {}

  async listVideos(chapterId: number): Promise<VideoRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, chapter_id, mode, title, url, author, file_key
      FROM subject_videos
      WHERE chapter_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(chapterId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      chapterId: Number(row.chapter_id),
      mode: String(row.mode) as VideoRecord['mode'],
      title: String(row.title),
      url: row.url ? String(row.url) : null,
      author: row.author ? String(row.author) : null,
      fileKey: row.file_key ? String(row.file_key) : null
    }));
  }

  async addVideo(chapterId: number, payload: { mode: VideoRecord['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<VideoRecord> {
    await this.db.prepare(`
      INSERT INTO subject_videos (chapter_id, mode, title, url, author, file_key, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_videos WHERE chapter_id = ?), 1))
    `).bind(
      chapterId,
      payload.mode,
      payload.title,
      payload.url ?? null,
      payload.author ?? null,
      payload.fileKey ?? null,
      chapterId
    ).run();

    const row = await this.db.prepare(`
      SELECT id, chapter_id, mode, title, url, author, file_key
      FROM subject_videos
      WHERE chapter_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(chapterId).first();

    if (!row) {
      throw new Error('Video creation failed');
    }

    return {
      id: Number((row as any).id),
      chapterId: Number((row as any).chapter_id),
      mode: String((row as any).mode) as VideoRecord['mode'],
      title: String((row as any).title),
      url: (row as any).url ? String((row as any).url) : null,
      author: (row as any).author ? String((row as any).author) : null,
      fileKey: (row as any).file_key ? String((row as any).file_key) : null
    };
  }

  async deleteVideo(videoId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_videos WHERE id = ?`).bind(videoId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  async listTopicVideos(topicId: number): Promise<TopicVideoRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, topic_id, mode, title, url, author, file_key
      FROM subject_topic_videos
      WHERE topic_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(topicId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      topicId: Number(row.topic_id),
      mode: String(row.mode) as TopicVideoRecord['mode'],
      title: String(row.title),
      url: row.url ? String(row.url) : null,
      author: row.author ? String(row.author) : null,
      fileKey: row.file_key ? String(row.file_key) : null
    }));
  }

  async addTopicVideo(topicId: number, payload: { mode: TopicVideoRecord['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<TopicVideoRecord> {
    await this.db.prepare(`
      INSERT INTO subject_topic_videos (topic_id, mode, title, url, author, file_key, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_topic_videos WHERE topic_id = ?), 1))
    `).bind(
      topicId,
      payload.mode,
      payload.title,
      payload.url ?? null,
      payload.author ?? null,
      payload.fileKey ?? null,
      topicId
    ).run();

    const row = await this.db.prepare(`
      SELECT id, topic_id, mode, title, url, author, file_key
      FROM subject_topic_videos
      WHERE topic_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(topicId).first();

    if (!row) {
      throw new Error('Topic video creation failed');
    }

    return {
      id: Number((row as any).id),
      topicId: Number((row as any).topic_id),
      mode: String((row as any).mode) as TopicVideoRecord['mode'],
      title: String((row as any).title),
      url: (row as any).url ? String((row as any).url) : null,
      author: (row as any).author ? String((row as any).author) : null,
      fileKey: (row as any).file_key ? String((row as any).file_key) : null
    };
  }

  async deleteTopicVideo(videoId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_topic_videos WHERE id = ?`).bind(videoId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }
}
