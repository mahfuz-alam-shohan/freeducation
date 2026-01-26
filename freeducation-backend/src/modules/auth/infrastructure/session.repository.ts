export interface SessionRecord {
  id: string;
  userId: number;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastAccessedAt: string;
  isActive: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export class SessionRepository {
  constructor(private db: D1Database) {}

  async create(record: SessionRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO admin_sessions (id, user_id, token_hash, created_at, expires_at, last_accessed_at, is_active, user_agent, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      record.id,
      record.userId,
      record.tokenHash,
      record.createdAt,
      record.expiresAt,
      record.lastAccessedAt,
      record.isActive ? 1 : 0,
      record.userAgent || null,
      record.ipAddress || null
    ).run();
  }

  async findByTokenHash(tokenHash: string): Promise<SessionRecord | null> {
    const result = await this.db.prepare(`
      SELECT * FROM admin_sessions WHERE token_hash = ? AND is_active = 1
    `).bind(tokenHash).first();

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      userId: result.user_id,
      tokenHash: result.token_hash,
      createdAt: result.created_at,
      expiresAt: result.expires_at,
      lastAccessedAt: result.last_accessed_at,
      isActive: Boolean(result.is_active),
      userAgent: result.user_agent,
      ipAddress: result.ip_address
    };
  }

  async touch(sessionId: string, lastAccessedAt: string): Promise<void> {
    await this.db.prepare(`
      UPDATE admin_sessions SET last_accessed_at = ? WHERE id = ?
    `).bind(lastAccessedAt, sessionId).run();
  }

  async invalidate(tokenHash: string): Promise<void> {
    await this.db.prepare(`
      UPDATE admin_sessions SET is_active = 0 WHERE token_hash = ?
    `).bind(tokenHash).run();
  }
}
