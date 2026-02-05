export interface ModuleCategoryRecord {
  id: number;
  key: string;
  name: string;
  description: string | null;
  templateCount: number;
}

export interface ModuleTemplateRecord {
  id: number;
  categoryId: number;
  categoryKey: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
}

export interface ModuleNodeRecord {
  id: number;
  templateId: number;
  parentId: number | null;
  nodeKey: string;
  serverName: string;
  nodeType: 'book' | 'part';
  hasImage: boolean;
  sortOrder: number;
}

export class ModuleTemplateRepository {
  constructor(private db: D1Database) {}

  async listCategories(): Promise<ModuleCategoryRecord[]> {
    const result = await this.db.prepare(`
      SELECT c.id,
        c.key,
        c.name,
        c.description,
        COUNT(t.id) as template_count
      FROM module_categories c
      LEFT JOIN module_templates t
        ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      key: String(row.key),
      name: String(row.name),
      description: row.description ? String(row.description) : null,
      templateCount: Number(row.template_count || 0)
    }));
  }

  async listTemplatesByCategoryKey(key: string): Promise<ModuleTemplateRecord[]> {
    const result = await this.db.prepare(`
      SELECT t.id,
        t.category_id,
        c.key as category_key,
        t.name,
        t.code,
        t.description,
        t.is_active,
        t.created_at,
        t.updated_at,
        COUNT(n.id) as node_count
      FROM module_templates t
      JOIN module_categories c
        ON c.id = t.category_id
      LEFT JOIN module_nodes n
        ON n.template_id = t.id
      WHERE c.key = ?
      GROUP BY t.id
      ORDER BY t.name ASC
    `).bind(key).all();

    return (result.results || []).map((row: any) => this.mapTemplate(row));
  }

  async findTemplateById(id: number): Promise<ModuleTemplateRecord | null> {
    const row = await this.db.prepare(`
      SELECT t.id,
        t.category_id,
        c.key as category_key,
        t.name,
        t.code,
        t.description,
        t.is_active,
        t.created_at,
        t.updated_at,
        COUNT(n.id) as node_count
      FROM module_templates t
      JOIN module_categories c
        ON c.id = t.category_id
      LEFT JOIN module_nodes n
        ON n.template_id = t.id
      WHERE t.id = ?
      GROUP BY t.id
      LIMIT 1
    `).bind(id).first();

    return row ? this.mapTemplate(row) : null;
  }

  async listNodesForTemplate(templateId: number): Promise<ModuleNodeRecord[]> {
    const result = await this.db.prepare(`
      SELECT id,
        template_id,
        parent_id,
        node_key,
        server_name,
        node_type,
        has_image,
        sort_order
      FROM module_nodes
      WHERE template_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(templateId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      templateId: Number(row.template_id),
      parentId: row.parent_id === null || row.parent_id === undefined ? null : Number(row.parent_id),
      nodeKey: String(row.node_key),
      serverName: String(row.server_name),
      nodeType: String(row.node_type) as ModuleNodeRecord['nodeType'],
      hasImage: Boolean(row.has_image),
      sortOrder: Number(row.sort_order || 0)
    }));
  }

  private mapTemplate(row: any): ModuleTemplateRecord {
    return {
      id: Number(row.id),
      categoryId: Number(row.category_id),
      categoryKey: String(row.category_key),
      name: String(row.name),
      code: String(row.code),
      description: row.description ? String(row.description) : null,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      nodeCount: Number(row.node_count || 0)
    };
  }
}
