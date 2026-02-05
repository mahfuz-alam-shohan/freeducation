import type { TopicRecord } from '../../domain/subject.types';

export class TopicsRepository {
  constructor(private db: D1Database) {}

  async listTopics(chapterId: number): Promise<TopicRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, chapter_id, name, image_key, sort_order
      FROM subject_topics
      WHERE chapter_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(chapterId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      chapterId: Number(row.chapter_id),
      name: String(row.name),
      imageKey: row.image_key ? String(row.image_key) : null,
      sortOrder: Number(row.sort_order || 0)
    }));
  }

  async createTopic(chapterId: number, name: string, imageKey: string | null): Promise<TopicRecord> {
    await this.db.prepare(`
      INSERT INTO subject_topics (chapter_id, name, image_key, sort_order)
      VALUES (?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_topics WHERE chapter_id = ?), 1))
    `).bind(chapterId, name, imageKey, chapterId).run();

    const row = await this.db.prepare(`
      SELECT id, chapter_id, name, image_key, sort_order
      FROM subject_topics
      WHERE chapter_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(chapterId).first();

    if (!row) {
      throw new Error('Topic creation failed');
    }

    return {
      id: Number((row as any).id),
      chapterId: Number((row as any).chapter_id),
      name: String((row as any).name),
      imageKey: (row as any).image_key ? String((row as any).image_key) : null,
      sortOrder: Number((row as any).sort_order || 0)
    };
  }

  async updateTopic(topicId: number, updates: { name?: string; imageKey?: string | null }): Promise<TopicRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }

    if (updates.imageKey !== undefined) {
      fields.push('image_key = ?');
      values.push(updates.imageKey);
    }

    if (fields.length === 0) {
      return await this.findTopicById(topicId);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(topicId);

    await this.db.prepare(`
      UPDATE subject_topics SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return await this.findTopicById(topicId);
  }

  async deleteTopic(topicId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_topics WHERE id = ?`).bind(topicId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  async findTopicById(topicId: number): Promise<TopicRecord | null> {
    const row = await this.db.prepare(`
      SELECT id, chapter_id, name, image_key, sort_order
      FROM subject_topics
      WHERE id = ?
      LIMIT 1
    `).bind(topicId).first();

    if (!row) return null;
    return {
      id: Number((row as any).id),
      chapterId: Number((row as any).chapter_id),
      name: String((row as any).name),
      imageKey: (row as any).image_key ? String((row as any).image_key) : null,
      sortOrder: Number((row as any).sort_order || 0)
    };
  }
}
