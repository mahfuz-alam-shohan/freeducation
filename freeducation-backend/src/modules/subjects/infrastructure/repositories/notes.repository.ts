import type { NoteRecord, TopicNoteRecord } from '../../domain/subject.types';

export class NotesRepository {
  constructor(private db: D1Database) {}

  async listNotes(chapterId: number): Promise<NoteRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, chapter_id, note, image_key
      FROM subject_short_notes
      WHERE chapter_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(chapterId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      chapterId: Number(row.chapter_id),
      note: String(row.note),
      imageKey: row.image_key ? String(row.image_key) : null
    }));
  }

  async addNote(chapterId: number, note: string, imageKey: string | null): Promise<NoteRecord> {
    await this.db.prepare(`
      INSERT INTO subject_short_notes (chapter_id, note, image_key, sort_order)
      VALUES (?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_short_notes WHERE chapter_id = ?), 1))
    `).bind(chapterId, note, imageKey, chapterId).run();

    const row = await this.db.prepare(`
      SELECT id, chapter_id, note, image_key
      FROM subject_short_notes
      WHERE chapter_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(chapterId).first();

    if (!row) {
      throw new Error('Note creation failed');
    }

    return {
      id: Number((row as any).id),
      chapterId: Number((row as any).chapter_id),
      note: String((row as any).note),
      imageKey: (row as any).image_key ? String((row as any).image_key) : null
    };
  }

  async deleteNote(noteId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_short_notes WHERE id = ?`).bind(noteId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  async listTopicNotes(topicId: number): Promise<TopicNoteRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, topic_id, note, image_key
      FROM subject_topic_notes
      WHERE topic_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(topicId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      topicId: Number(row.topic_id),
      note: String(row.note),
      imageKey: row.image_key ? String(row.image_key) : null
    }));
  }

  async addTopicNote(topicId: number, note: string, imageKey: string | null): Promise<TopicNoteRecord> {
    await this.db.prepare(`
      INSERT INTO subject_topic_notes (topic_id, note, image_key, sort_order)
      VALUES (?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_topic_notes WHERE topic_id = ?), 1))
    `).bind(topicId, note, imageKey, topicId).run();

    const row = await this.db.prepare(`
      SELECT id, topic_id, note, image_key
      FROM subject_topic_notes
      WHERE topic_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(topicId).first();

    if (!row) {
      throw new Error('Topic note creation failed');
    }

    return {
      id: Number((row as any).id),
      topicId: Number((row as any).topic_id),
      note: String((row as any).note),
      imageKey: (row as any).image_key ? String((row as any).image_key) : null
    };
  }

  async deleteTopicNote(noteId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_topic_notes WHERE id = ?`).bind(noteId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }
}
