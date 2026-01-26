import type { UserRole } from '../../../shared/types/user';

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListQuery {
  limit: number;
  offset: number;
  search?: string;
  includeInactive?: boolean;
}

export interface CreateUserRecordInput {
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRecordInput {
  email?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export class UserRepository {
  constructor(private db: D1Database) {}

  async create(input: CreateUserRecordInput): Promise<UserRecord> {
    await this.db.prepare(`
      INSERT INTO users (email, password_hash, role, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      input.email,
      input.passwordHash,
      input.role,
      input.firstName,
      input.lastName
    ).run();

    const created = await this.findByEmail(input.email);
    if (!created) {
      throw new Error('User creation failed');
    }

    return created;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE email = ? LIMIT 1
    `).bind(email).first();

    return result ? this.mapRow(result) : null;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const result = await this.db.prepare(`
      SELECT * FROM users WHERE id = ? LIMIT 1
    `).bind(id).first();

    return result ? this.mapRow(result) : null;
  }

  async list(query: UserListQuery): Promise<UserRecord[]> {
    const filters: string[] = [];
    const values: Array<string | number> = [];

    if (!query.includeInactive) {
      filters.push('is_active = 1');
    }

    if (query.search) {
      filters.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchValue = `%${query.search}%`;
      values.push(searchValue, searchValue, searchValue);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const result = await this.db.prepare(`
      SELECT * FROM users ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...values, query.limit, query.offset).all();

    return (result.results || []).map((row: any) => this.mapRow(row));
  }

  async count(query: Omit<UserListQuery, 'limit' | 'offset'>): Promise<number> {
    const filters: string[] = [];
    const values: Array<string | number> = [];

    if (!query.includeInactive) {
      filters.push('is_active = 1');
    }

    if (query.search) {
      filters.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchValue = `%${query.search}%`;
      values.push(searchValue, searchValue, searchValue);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const result = await this.db.prepare(`
      SELECT COUNT(*) as count FROM users ${whereClause}
    `).bind(...values).first();

    return Number(result?.count || 0);
  }

  async update(id: number, updates: UpdateUserRecordInput): Promise<UserRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      values.push(updates.role);
    }
    if (updates.firstName !== undefined) {
      fields.push('first_name = ?');
      values.push(updates.firstName);
    }
    if (updates.lastName !== undefined) {
      fields.push('last_name = ?');
      values.push(updates.lastName);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');

    values.push(id);

    await this.db.prepare(`
      UPDATE users SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return await this.findById(id);
  }

  async countAdmins(): Promise<number> {
    const result = await this.db.prepare(`
      SELECT COUNT(*) as count FROM users WHERE role = 'admin'
    `).first();

    return Number(result?.count || 0);
  }

  private mapRow(row: any): UserRecord {
    return {
      id: Number(row.id),
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      firstName: row.first_name,
      lastName: row.last_name,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
