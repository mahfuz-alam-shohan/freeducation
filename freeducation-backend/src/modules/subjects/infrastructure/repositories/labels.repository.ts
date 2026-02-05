export class LabelsRepository {
  constructor(private db: D1Database) {}

  async getQuestionTypeLabels(subjectId: number): Promise<Record<string, string | null>> {
    const result = await this.db.prepare(`
      SELECT type_key, display_name
      FROM subject_question_type_labels
      WHERE subject_id = ?
    `).bind(subjectId).all();

    const labels: Record<string, string | null> = {};
    for (const row of result.results || []) {
      labels[String((row as any).type_key)] = (row as any).display_name ? String((row as any).display_name) : null;
    }
    return labels;
  }

  async getCqSectionLabels(subjectId: number): Promise<Record<string, string | null>> {
    const result = await this.db.prepare(`
      SELECT section_key, display_name
      FROM subject_cq_section_labels
      WHERE subject_id = ?
    `).bind(subjectId).all();

    const labels: Record<string, string | null> = {};
    for (const row of result.results || []) {
      labels[String((row as any).section_key)] = (row as any).display_name ? String((row as any).display_name) : null;
    }
    return labels;
  }

  async setQuestionTypeLabel(subjectId: number, typeKey: 'CQ' | 'MCQ', displayName: string | null): Promise<void> {
    if (displayName === null || displayName === '') {
      await this.db.prepare(`
        DELETE FROM subject_question_type_labels WHERE subject_id = ? AND type_key = ?
      `).bind(subjectId, typeKey).run();
      return;
    }

    await this.db.prepare(`
      INSERT INTO subject_question_type_labels (subject_id, type_key, display_name)
      VALUES (?, ?, ?)
      ON CONFLICT(subject_id, type_key)
      DO UPDATE SET display_name = excluded.display_name, updated_at = CURRENT_TIMESTAMP
    `).bind(subjectId, typeKey, displayName).run();
  }

  async setCqSectionLabel(subjectId: number, sectionKey: 'KNOWLEDGE' | 'TWO' | 'THREE' | 'FOUR', displayName: string | null): Promise<void> {
    if (displayName === null || displayName === '') {
      await this.db.prepare(`
        DELETE FROM subject_cq_section_labels WHERE subject_id = ? AND section_key = ?
      `).bind(subjectId, sectionKey).run();
      return;
    }

    await this.db.prepare(`
      INSERT INTO subject_cq_section_labels (subject_id, section_key, display_name)
      VALUES (?, ?, ?)
      ON CONFLICT(subject_id, section_key)
      DO UPDATE SET display_name = excluded.display_name, updated_at = CURRENT_TIMESTAMP
    `).bind(subjectId, sectionKey, displayName).run();
  }
}
