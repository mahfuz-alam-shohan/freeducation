import type { ChapterRecord } from '../../domain/subject.types';

export class ChaptersRepository {
  constructor(private db: D1Database) {}

  async listChapters(subjectId: number, nodeId: number): Promise<ChapterRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, subject_id, node_id, name, image_key, sort_order
      FROM subject_chapters
      WHERE subject_id = ? AND node_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(subjectId, nodeId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      subjectId: Number(row.subject_id),
      nodeId: Number(row.node_id),
      name: String(row.name),
      imageKey: row.image_key ? String(row.image_key) : null,
      sortOrder: Number(row.sort_order || 0)
    }));
  }

  async createChapter(subjectId: number, nodeId: number, name: string, imageKey: string | null): Promise<ChapterRecord> {
    await this.db.prepare(`
      INSERT INTO subject_chapters (subject_id, node_id, name, image_key, sort_order)
      VALUES (?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_chapters WHERE subject_id = ? AND node_id = ?), 1))
    `).bind(subjectId, nodeId, name, imageKey, subjectId, nodeId).run();

    const row = await this.db.prepare(`
      SELECT id, subject_id, node_id, name, image_key, sort_order
      FROM subject_chapters
      WHERE subject_id = ? AND node_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(subjectId, nodeId).first();

    if (!row) {
      throw new Error('Chapter creation failed');
    }

    return {
      id: Number((row as any).id),
      subjectId: Number((row as any).subject_id),
      nodeId: Number((row as any).node_id),
      name: String((row as any).name),
      imageKey: (row as any).image_key ? String((row as any).image_key) : null,
      sortOrder: Number((row as any).sort_order || 0)
    };
  }

  async updateChapter(chapterId: number, updates: { name?: string; imageKey?: string | null }): Promise<ChapterRecord | null> {
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
      return await this.findChapterById(chapterId);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(chapterId);

    await this.db.prepare(`
      UPDATE subject_chapters SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return await this.findChapterById(chapterId);
  }

  async deleteChapter(chapterId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_chapters WHERE id = ?`).bind(chapterId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  async findChapterById(chapterId: number): Promise<ChapterRecord | null> {
    const row = await this.db.prepare(`
      SELECT id, subject_id, node_id, name, image_key, sort_order
      FROM subject_chapters
      WHERE id = ?
      LIMIT 1
    `).bind(chapterId).first();

    if (!row) return null;
    return {
      id: Number((row as any).id),
      subjectId: Number((row as any).subject_id),
      nodeId: Number((row as any).node_id),
      name: String((row as any).name),
      imageKey: (row as any).image_key ? String((row as any).image_key) : null,
      sortOrder: Number((row as any).sort_order || 0)
    };
  }
}
