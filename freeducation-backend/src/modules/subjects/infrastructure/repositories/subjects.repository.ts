import type { SubjectRecord } from '../../domain/subject.types';

export class SubjectsRepository {
  constructor(private db: D1Database) {}

  async listSubjects(): Promise<SubjectRecord[]> {
    const result = await this.db.prepare(`
      SELECT s.id,
        s.name,
        s.template_id,
        s.is_active,
        s.created_at,
        s.updated_at,
        t.name as template_name,
        t.code as template_code
      FROM subjects s
      JOIN module_templates t ON t.id = s.template_id
      ORDER BY s.name ASC
    `).all();

    return (result.results || []).map((row: any) => this.mapSubject(row));
  }

  async createSubject(name: string, templateId: number): Promise<SubjectRecord> {
    const result = await this.db.prepare(`
      INSERT INTO subjects (name, template_id)
      VALUES (?, ?)
    `).bind(name, templateId).run();

    const id = Number(result?.meta?.last_row_id || 0);
    const record = await this.findSubjectById(id);
    if (!record) {
      throw new Error('Subject creation failed');
    }
    return record;
  }

  async findSubjectById(id: number): Promise<SubjectRecord | null> {
    const row = await this.db.prepare(`
      SELECT s.id,
        s.name,
        s.template_id,
        s.is_active,
        s.created_at,
        s.updated_at,
        t.name as template_name,
        t.code as template_code
      FROM subjects s
      JOIN module_templates t ON t.id = s.template_id
      WHERE s.id = ?
      LIMIT 1
    `).bind(id).first();

    return row ? this.mapSubject(row) : null;
  }

  async updateSubject(id: number, updates: { name?: string; isActive?: boolean }): Promise<SubjectRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }

    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }

    if (fields.length === 0) {
      return await this.findSubjectById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await this.db.prepare(`
      UPDATE subjects SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return await this.findSubjectById(id);
  }

  async deleteSubject(id: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subjects WHERE id = ?`).bind(id).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  private mapSubject(row: any): SubjectRecord {
    return {
      id: Number(row.id),
      name: String(row.name),
      templateId: Number(row.template_id),
      templateName: String(row.template_name),
      templateCode: String(row.template_code),
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
