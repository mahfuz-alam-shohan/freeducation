import type { CreateUserInput, UpdateUserInput, User } from '../../../shared/types/user';
import { hashPassword } from '../../../shared/utils/password';
import { UserRepository } from '../infrastructure/user.repository';

export class UserService {
  constructor(private db: D1Database) {
    this.repo = new UserRepository(db);
  }

  private repo: UserRepository;

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const record = await this.repo.create({
      email: input.email,
      passwordHash,
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName
    });

    return this.toUser(record);
  }

  async listUsers(limit: number, offset: number, search?: string, includeInactive?: boolean) {
    const users = await this.repo.list({ limit, offset, search, includeInactive });
    const total = await this.repo.count({ search, includeInactive });
    return {
      users: users.map((user) => this.toUser(user)),
      total
    };
  }

  async getUser(id: number): Promise<User | null> {
    const record = await this.repo.findById(id);
    return record ? this.toUser(record) : null;
  }

  async updateUser(id: number, updates: UpdateUserInput): Promise<User | null> {
    const record = await this.repo.update(id, {
      email: updates.email,
      role: updates.role,
      firstName: updates.firstName,
      lastName: updates.lastName,
      isActive: updates.isActive
    });

    return record ? this.toUser(record) : null;
  }

  async countAdmins(): Promise<number> {
    return await this.repo.countAdmins();
  }

  private toUser(record: { id: number; email: string; role: string; firstName: string; lastName: string; isActive: boolean; createdAt: string; updatedAt: string; }): User {
    return {
      id: record.id,
      email: record.email,
      role: record.role as User['role'],
      firstName: record.firstName,
      lastName: record.lastName,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }
}
