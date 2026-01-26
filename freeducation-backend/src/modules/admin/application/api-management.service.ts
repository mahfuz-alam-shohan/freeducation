import type { UserRole } from '../../../shared/types/user';
import { generateToken, sha256Hex } from '../../../shared/utils/crypto';

export interface ApiKeySummary {
  id: string;
  label: string;
  prefix: string;
  isEnabled: boolean;
  createdAt: string;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
}

export interface ApiEndpointView {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string | null;
  dataSummary: string | null;
  isPublic: boolean;
  isEnabled: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Record<UserRole, boolean>;
  userOverrides: { allow: number[]; deny: number[] };
  keys: ApiKeySummary[];
}

export interface CreateApiEndpointInput {
  name: string;
  method: string;
  path: string;
  description?: string;
  dataSummary?: string;
  isPublic?: boolean;
  isEnabled?: boolean;
  roles?: Record<UserRole, boolean>;
  userOverrides?: { allow?: number[]; deny?: number[] };
}

export interface UpdateApiEndpointInput {
  name?: string;
  method?: string;
  path?: string;
  description?: string | null;
  dataSummary?: string | null;
  isPublic?: boolean;
  isEnabled?: boolean;
  roles?: Record<UserRole, boolean>;
  userOverrides?: { allow?: number[]; deny?: number[] };
}

export class ApiManagementService {
  constructor(private db: D1Database) {}

  async listEndpoints(): Promise<ApiEndpointView[]> {
    const endpoints = await this.listEndpointRows();
    return this.buildEndpointViews(endpoints);
  }

  async getEndpoint(id: string): Promise<ApiEndpointView | null> {
    const endpoint = await this.db.prepare(`
      SELECT * FROM api_endpoints WHERE id = ? LIMIT 1
    `).bind(id).first();

    if (!endpoint) return null;
    const views = await this.buildEndpointViews([endpoint as any]);
    return views[0] || null;
  }

  async createEndpoint(input: CreateApiEndpointInput): Promise<ApiEndpointView> {
    const normalized = this.normalizeEndpointInput(input);
    const id = crypto.randomUUID();
    const isPublic = normalized.isPublic ?? false;
    const isEnabled = normalized.isEnabled ?? true;

    this.assertValidMethod(normalized.method);
    this.assertValidPath(normalized.path);
    await this.ensureUniqueMethodPath(normalized.method, normalized.path);

    await this.db.prepare(`
      INSERT INTO api_endpoints (id, name, method, path, description, data_summary, is_public, is_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      normalized.name,
      normalized.method,
      normalized.path,
      normalized.description ?? null,
      normalized.dataSummary ?? null,
      isPublic ? 1 : 0,
      isEnabled ? 1 : 0
    ).run();

    if (normalized.roles) {
      await this.upsertRoles(id, this.sanitizeRoles(normalized.roles));
    }

    if (normalized.userOverrides) {
      await this.replaceOverrides(id, normalized.userOverrides);
    }

    const endpoint = await this.getEndpoint(id);
    if (!endpoint) {
      throw new Error('Failed to create endpoint');
    }
    return endpoint;
  }

  async updateEndpoint(id: string, input: UpdateApiEndpointInput): Promise<ApiEndpointView> {
    const existing = await this.getEndpoint(id);
    if (!existing) {
      throw new Error('Endpoint not found');
    }

    const updates = this.normalizeEndpointInput(input);
    if (updates.method || updates.path) {
      const method = updates.method || existing.method;
      const path = updates.path || existing.path;
      this.assertValidMethod(method);
      this.assertValidPath(path);
      if (method !== existing.method || path !== existing.path) {
        await this.ensureUniqueMethodPath(method, path, id);
      }
    }

    const fields: string[] = [];
    const values: Array<string | number | null> = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.method !== undefined) {
      fields.push('method = ?');
      values.push(updates.method);
    }
    if (updates.path !== undefined) {
      fields.push('path = ?');
      values.push(updates.path);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.dataSummary !== undefined) {
      fields.push('data_summary = ?');
      values.push(updates.dataSummary);
    }
    if (updates.isPublic !== undefined) {
      fields.push('is_public = ?');
      values.push(updates.isPublic ? 1 : 0);
    }
    if (updates.isEnabled !== undefined) {
      fields.push('is_enabled = ?');
      values.push(updates.isEnabled ? 1 : 0);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      await this.db.prepare(`
        UPDATE api_endpoints SET ${fields.join(', ')} WHERE id = ?
      `).bind(...values).run();
    }

    if (updates.roles) {
      await this.upsertRoles(id, this.sanitizeRoles(updates.roles));
    }

    if (updates.userOverrides) {
      await this.replaceOverrides(id, updates.userOverrides);
    }

    const endpoint = await this.getEndpoint(id);
    if (!endpoint) {
      throw new Error('Endpoint not found');
    }
    return endpoint;
  }

  async createKey(endpointId: string, label: string): Promise<{ key: string; keyInfo: ApiKeySummary }> {
    await this.ensureEndpointExists(endpointId);
    const key = this.generateApiKey();
    const keyHash = await sha256Hex(key);
    const prefix = key.slice(0, 10);
    const id = crypto.randomUUID();

    await this.db.prepare(`
      INSERT INTO api_keys (id, endpoint_id, label, key_hash, prefix, is_enabled)
      VALUES (?, ?, ?, ?, ?, 1)
    `).bind(id, endpointId, label, keyHash, prefix).run();

    const info = await this.getKeySummary(id);
    if (!info) {
      throw new Error('Failed to create key');
    }

    return { key, keyInfo: info };
  }

  async updateKey(keyId: string, updates: { label?: string; isEnabled?: boolean }): Promise<ApiKeySummary> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (updates.label !== undefined) {
      fields.push('label = ?');
      values.push(updates.label);
    }
    if (updates.isEnabled !== undefined) {
      fields.push('is_enabled = ?');
      values.push(updates.isEnabled ? 1 : 0);
    }

    if (fields.length > 0) {
      values.push(keyId);
      await this.db.prepare(`
        UPDATE api_keys SET ${fields.join(', ')} WHERE id = ?
      `).bind(...values).run();
    }

    const keyInfo = await this.getKeySummary(keyId);
    if (!keyInfo) {
      throw new Error('Key not found');
    }
    return keyInfo;
  }

  async rotateKey(keyId: string): Promise<{ key: string; keyInfo: ApiKeySummary }> {
    const key = this.generateApiKey();
    const keyHash = await sha256Hex(key);
    const prefix = key.slice(0, 10);

    await this.db.prepare(`
      UPDATE api_keys SET key_hash = ?, prefix = ? WHERE id = ?
    `).bind(keyHash, prefix, keyId).run();

    const info = await this.getKeySummary(keyId);
    if (!info) {
      throw new Error('Key not found');
    }

    return { key, keyInfo: info };
  }

  async deleteKey(keyId: string): Promise<void> {
    await this.db.prepare(`DELETE FROM api_keys WHERE id = ?`).bind(keyId).run();
  }

  private async listEndpointRows(): Promise<any[]> {
    const result = await this.db.prepare(`
      SELECT * FROM api_endpoints ORDER BY name ASC
    `).all();
    return result.results || [];
  }

  private async buildEndpointViews(endpoints: any[]): Promise<ApiEndpointView[]> {
    if (endpoints.length === 0) return [];

    const endpointIds = endpoints.map((row) => String(row.id));
    const roles = await this.listRoles(endpointIds);
    const overrides = await this.listOverrides(endpointIds);
    const keys = await this.listKeys(endpointIds);

    return endpoints.map((row) => {
      const id = String(row.id);
      return {
        id,
        name: row.name,
        method: String(row.method).toUpperCase(),
        path: row.path,
        description: row.description ?? null,
        dataSummary: row.data_summary ?? null,
        isPublic: Boolean(row.is_public),
        isEnabled: Boolean(row.is_enabled),
        isSystem: Boolean(row.is_system),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        roles: roles.get(id) || this.emptyRoles(),
        userOverrides: overrides.get(id) || { allow: [], deny: [] },
        keys: keys.get(id) || []
      };
    });
  }

  private async listRoles(endpointIds: string[]): Promise<Map<string, Record<UserRole, boolean>>> {
    if (endpointIds.length === 0) return new Map();

    const placeholders = endpointIds.map(() => '?').join(',');
    const result = await this.db.prepare(`
      SELECT endpoint_id, role, is_enabled FROM api_access_roles
      WHERE endpoint_id IN (${placeholders})
    `).bind(...endpointIds).all();

    const map = new Map<string, Record<UserRole, boolean>>();
    for (const row of result.results || []) {
      const endpointId = String((row as any).endpoint_id);
      if (!map.has(endpointId)) {
        map.set(endpointId, this.emptyRoles());
      }
      const role = String((row as any).role) as UserRole;
      if (map.get(endpointId)) {
        map.get(endpointId)![role] = Boolean((row as any).is_enabled);
      }
    }
    return map;
  }

  private async listOverrides(endpointIds: string[]): Promise<Map<string, { allow: number[]; deny: number[] }>> {
    if (endpointIds.length === 0) return new Map();

    const placeholders = endpointIds.map(() => '?').join(',');
    const result = await this.db.prepare(`
      SELECT endpoint_id, user_id, mode FROM api_user_overrides
      WHERE endpoint_id IN (${placeholders})
    `).bind(...endpointIds).all();

    const map = new Map<string, { allow: number[]; deny: number[] }>();
    for (const row of result.results || []) {
      const endpointId = String((row as any).endpoint_id);
      if (!map.has(endpointId)) {
        map.set(endpointId, { allow: [], deny: [] });
      }
      const mode = String((row as any).mode);
      const userId = Number((row as any).user_id);
      if (mode === 'deny') {
        map.get(endpointId)!.deny.push(userId);
      } else {
        map.get(endpointId)!.allow.push(userId);
      }
    }
    return map;
  }

  private async listKeys(endpointIds: string[]): Promise<Map<string, ApiKeySummary[]>> {
    if (endpointIds.length === 0) return new Map();

    const placeholders = endpointIds.map(() => '?').join(',');
    const result = await this.db.prepare(`
      SELECT id, endpoint_id, label, prefix, is_enabled, created_at, last_used_at, expires_at
      FROM api_keys
      WHERE endpoint_id IN (${placeholders})
      ORDER BY created_at DESC
    `).bind(...endpointIds).all();

    const map = new Map<string, ApiKeySummary[]>();
    for (const row of result.results || []) {
      const endpointId = String((row as any).endpoint_id);
      if (!map.has(endpointId)) {
        map.set(endpointId, []);
      }
      map.get(endpointId)!.push({
        id: String((row as any).id),
        label: (row as any).label,
        prefix: (row as any).prefix,
        isEnabled: Boolean((row as any).is_enabled),
        createdAt: (row as any).created_at,
        lastUsedAt: (row as any).last_used_at ?? null,
        expiresAt: (row as any).expires_at ?? null
      });
    }
    return map;
  }

  private async upsertRoles(endpointId: string, roles: Record<UserRole, boolean>): Promise<void> {
    const entries = Object.entries(roles) as Array<[UserRole, boolean]>;
    for (const [role, enabled] of entries) {
      await this.db.prepare(`
        INSERT INTO api_access_roles (id, endpoint_id, role, is_enabled)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(endpoint_id, role) DO UPDATE SET is_enabled = excluded.is_enabled
      `).bind(crypto.randomUUID(), endpointId, role, enabled ? 1 : 0).run();
    }
  }

  private async replaceOverrides(endpointId: string, overrides: { allow?: number[]; deny?: number[] }): Promise<void> {
    await this.db.prepare(`DELETE FROM api_user_overrides WHERE endpoint_id = ?`).bind(endpointId).run();
    const allow = this.normalizeOverrideIds(overrides.allow || []);
    const deny = this.normalizeOverrideIds(overrides.deny || []);

    for (const userId of allow) {
      await this.db.prepare(`
        INSERT INTO api_user_overrides (id, endpoint_id, user_id, mode)
        VALUES (?, ?, ?, 'allow')
      `).bind(crypto.randomUUID(), endpointId, userId).run();
    }

    for (const userId of deny) {
      await this.db.prepare(`
        INSERT INTO api_user_overrides (id, endpoint_id, user_id, mode)
        VALUES (?, ?, ?, 'deny')
      `).bind(crypto.randomUUID(), endpointId, userId).run();
    }
  }

  private async getKeySummary(keyId: string): Promise<ApiKeySummary | null> {
    const row = await this.db.prepare(`
      SELECT id, label, prefix, is_enabled, created_at, last_used_at, expires_at
      FROM api_keys WHERE id = ? LIMIT 1
    `).bind(keyId).first();

    if (!row) return null;
    return {
      id: String((row as any).id),
      label: (row as any).label,
      prefix: (row as any).prefix,
      isEnabled: Boolean((row as any).is_enabled),
      createdAt: (row as any).created_at,
      lastUsedAt: (row as any).last_used_at ?? null,
      expiresAt: (row as any).expires_at ?? null
    };
  }

  private async ensureEndpointExists(endpointId: string): Promise<void> {
    const row = await this.db.prepare(`SELECT id FROM api_endpoints WHERE id = ?`).bind(endpointId).first();
    if (!row) {
      throw new Error('Endpoint not found');
    }
  }

  private async ensureUniqueMethodPath(method: string, path: string, excludeId?: string): Promise<void> {
    const row = await this.db.prepare(`
      SELECT id FROM api_endpoints WHERE method = ? AND path = ? LIMIT 1
    `).bind(method, path).first();

    if (row && (!excludeId || String((row as any).id) !== excludeId)) {
      throw new Error('Method and path already exist');
    }
  }

  private normalizeEndpointInput<T extends CreateApiEndpointInput | UpdateApiEndpointInput>(input: T) {
    const normalized = { ...input };
    if (normalized.method) {
      normalized.method = normalized.method.toUpperCase();
    }
    if (normalized.path) {
      normalized.path = normalized.path.startsWith('/') ? normalized.path : `/${normalized.path}`;
      if (normalized.path.length > 1 && normalized.path.endsWith('/')) {
        normalized.path = normalized.path.slice(0, -1);
      }
    }
    return normalized;
  }

  private emptyRoles(): Record<UserRole, boolean> {
    return { admin: false, teacher: false, student: false };
  }

  private generateApiKey(): string {
    return `fe_live_${generateToken(20)}`;
  }

  private sanitizeRoles(input: Record<UserRole, boolean>): Record<UserRole, boolean> {
    const safe = this.emptyRoles();
    for (const role of Object.keys(safe) as UserRole[]) {
      if (input[role] !== undefined) {
        safe[role] = Boolean(input[role]);
      }
    }
    return safe;
  }

  private assertValidMethod(method: string): void {
    const allowed = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!allowed.includes(method.toUpperCase())) {
      throw new Error('Invalid HTTP method');
    }
  }

  private assertValidPath(path: string): void {
    if (!path.startsWith('/')) {
      throw new Error('Path must start with /');
    }
    if (path.includes(' ')) {
      throw new Error('Path cannot include spaces');
    }
  }

  private normalizeOverrideIds(values: number[]): number[] {
    return values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
  }
}
