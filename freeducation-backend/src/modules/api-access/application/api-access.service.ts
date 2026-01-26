import type { UserRole } from '../../../shared/types/user';
import { sha256Hex } from '../../../shared/utils/crypto';
import { UserRepository } from '../../users/infrastructure/user.repository';

interface ApiEndpointRecord {
  id: string;
  name: string;
  method: string;
  path: string;
  isPublic: boolean;
  isEnabled: boolean;
}

interface ApiKeyRecord {
  id: string;
  isEnabled: boolean;
  expiresAt?: string | null;
}

export interface ApiAccessDecision {
  allowed: boolean;
  status: number;
  error?: string;
}

export interface ApiAccessContext {
  method: string;
  path: string;
  apiKey?: string | null;
  userId?: number | null;
  userRole?: UserRole | null;
  bypassKey?: boolean;
}

export class ApiAccessService {
  private userRepo: UserRepository;

  constructor(private db: D1Database) {
    this.userRepo = new UserRepository(db);
  }

  async authorize(ctx: ApiAccessContext): Promise<ApiAccessDecision> {
    const endpoint = await this.findEndpoint(ctx.method, ctx.path);
    if (!endpoint) {
      const count = await this.countEndpoints();
      if (count > 0) {
        return { allowed: false, status: 403, error: 'API not registered' };
      }
      return { allowed: true, status: 200 };
    }

    if (!endpoint.isEnabled) {
      return { allowed: false, status: 403, error: 'API disabled' };
    }

    if (endpoint.isPublic) {
      return { allowed: true, status: 200 };
    }

    const keyRecord = await this.validateApiKey(endpoint.id, ctx.apiKey);
    if (!keyRecord && !ctx.bypassKey) {
      return { allowed: false, status: 401, error: 'API key required' };
    }

    const accessRules = await this.getAccessRules(endpoint.id);
    if (accessRules.requiresUser) {
      const user = await this.resolveUser(ctx.userId, ctx.userRole);
      if (!user) {
        return { allowed: false, status: 403, error: 'User context required' };
      }

      if (accessRules.denied.has(user.id)) {
        return { allowed: false, status: 403, error: 'User access denied' };
      }

      if (accessRules.allowed.size > 0 && !accessRules.allowed.has(user.id)) {
        return { allowed: false, status: 403, error: 'User not allowed' };
      }

      if (accessRules.roles.size > 0 && !accessRules.roles.has(user.role)) {
        return { allowed: false, status: 403, error: 'Role not allowed' };
      }
    }

    if (keyRecord) {
      await this.touchKey(keyRecord.id);
    }

    return { allowed: true, status: 200 };
  }

  private async findEndpoint(method: string, path: string): Promise<ApiEndpointRecord | null> {
    const normalizedMethod = method.toUpperCase();
    const normalizedPath = this.normalizePath(path);

    const result = await this.db.prepare(`
      SELECT id, name, method, path, is_public, is_enabled
      FROM api_endpoints WHERE UPPER(method) = ?
    `).bind(normalizedMethod).all();

    const candidates = result.results || [];
    let bestMatch: any = null;
    let bestScore = -1;

    for (const row of candidates) {
      const pattern = String((row as any).path);
      const match = this.matchPath(pattern, normalizedPath);
      if (match.matched && match.score > bestScore) {
        bestScore = match.score;
        bestMatch = row;
      }
    }

    if (!bestMatch) return null;

    return {
      id: String(bestMatch.id),
      name: bestMatch.name,
      method: String(bestMatch.method).toUpperCase(),
      path: bestMatch.path,
      isPublic: Boolean(bestMatch.is_public),
      isEnabled: Boolean(bestMatch.is_enabled)
    };
  }

  private async countEndpoints(): Promise<number> {
    const row = await this.db.prepare('SELECT COUNT(*) as count FROM api_endpoints').first();
    return Number((row as any)?.count || 0);
  }

  private matchPath(pattern: string, path: string): { matched: boolean; score: number } {
    const patternSegments = this.splitPath(pattern);
    const pathSegments = this.splitPath(path);
    if (patternSegments.length !== pathSegments.length) {
      return { matched: false, score: 0 };
    }

    let score = 0;
    for (let i = 0; i < patternSegments.length; i += 1) {
      const segment = patternSegments[i];
      const actual = pathSegments[i];
      if (segment.startsWith(':')) {
        continue;
      }
      if (segment !== actual) {
        return { matched: false, score: 0 };
      }
      score += 1;
    }

    return { matched: true, score };
  }

  private splitPath(value: string): string[] {
    return value.split('/').filter((segment) => segment.length > 0);
  }

  private normalizePath(path: string): string {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  }

  private async validateApiKey(endpointId: string, apiKey?: string | null): Promise<ApiKeyRecord | null> {
    if (!apiKey) return null;
    const hash = await sha256Hex(apiKey);
    const row = await this.db.prepare(`
      SELECT id, is_enabled, expires_at
      FROM api_keys WHERE endpoint_id = ? AND key_hash = ? LIMIT 1
    `).bind(endpointId, hash).first();

    if (!row) return null;

    const isEnabled = Boolean((row as any).is_enabled);
    if (!isEnabled) return null;

    const expiresAt = (row as any).expires_at ? new Date((row as any).expires_at) : null;
    if (expiresAt && expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return {
      id: String((row as any).id),
      isEnabled,
      expiresAt: (row as any).expires_at ?? null
    };
  }

  private async getAccessRules(endpointId: string) {
    const rolesResult = await this.db.prepare(`
      SELECT role FROM api_access_roles WHERE endpoint_id = ? AND is_enabled = 1
    `).bind(endpointId).all();

    const overridesResult = await this.db.prepare(`
      SELECT user_id, mode FROM api_user_overrides WHERE endpoint_id = ?
    `).bind(endpointId).all();

    const roles = new Set<UserRole>();
    for (const row of rolesResult.results || []) {
      roles.add(String((row as any).role) as UserRole);
    }

    const allowed = new Set<number>();
    const denied = new Set<number>();
    for (const row of overridesResult.results || []) {
      const userId = Number((row as any).user_id);
      const mode = String((row as any).mode);
      if (mode === 'deny') {
        denied.add(userId);
      } else {
        allowed.add(userId);
      }
    }

    return {
      roles,
      allowed,
      denied,
      requiresUser: roles.size > 0 || allowed.size > 0 || denied.size > 0
    };
  }

  private async resolveUser(userId?: number | null, role?: UserRole | null) {
    if (userId) {
      const user = await this.userRepo.findById(userId);
      if (!user || !user.isActive) {
        return null;
      }
      return user;
    }

    if (role) {
      return {
        id: 0,
        role,
        isActive: true
      };
    }

    return null;
  }

  private async touchKey(keyId: string): Promise<void> {
    await this.db.prepare(`
      UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(keyId).run();
  }
}
