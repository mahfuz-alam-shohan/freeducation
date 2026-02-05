import type { SubjectNodeRecord } from '../../domain/subject.types';

export class SubjectNodesRepository {
  constructor(private db: D1Database) {}

  async listTemplateNodesForSubject(subjectId: number, templateId: number): Promise<SubjectNodeRecord[]> {
    const result = await this.db.prepare(`
      SELECT n.id,
        n.parent_id,
        n.node_key,
        n.server_name,
        n.node_type,
        n.has_image,
        n.sort_order,
        o.display_name,
        o.image_key
      FROM module_nodes n
      LEFT JOIN subject_node_overrides o
        ON o.node_id = n.id AND o.subject_id = ?
      WHERE n.template_id = ?
      ORDER BY n.sort_order ASC, n.id ASC
    `).bind(subjectId, templateId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      parentId: row.parent_id !== null && row.parent_id !== undefined ? Number(row.parent_id) : null,
      nodeKey: String(row.node_key),
      serverName: String(row.server_name),
      nodeType: String(row.node_type) as SubjectNodeRecord['nodeType'],
      hasImage: Boolean(row.has_image),
      sortOrder: Number(row.sort_order || 0),
      displayName: row.display_name ? String(row.display_name) : null,
      imageKey: row.image_key ? String(row.image_key) : null
    }));
  }

  async upsertNodeOverride(subjectId: number, nodeId: number, displayName: string | null, imageKey: string | null): Promise<void> {
    await this.db.prepare(`
      INSERT INTO subject_node_overrides (subject_id, node_id, display_name, image_key)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(subject_id, node_id)
      DO UPDATE SET display_name = excluded.display_name,
        image_key = excluded.image_key,
        updated_at = CURRENT_TIMESTAMP
    `).bind(subjectId, nodeId, displayName, imageKey).run();
  }
}
