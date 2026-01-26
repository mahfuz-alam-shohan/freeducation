import type { AppConfig } from '../../../config/env';
import type { AuthSession } from '../../../shared/types/auth';
import type { User } from '../../../shared/types/user';
import { addDays, toIso } from '../../../shared/utils/time';
import { generateToken, sha256Hex } from '../../../shared/utils/crypto';
import { hashPassword, verifyPassword } from '../../../shared/utils/password';
import { UserRepository } from '../../users/infrastructure/user.repository';
import { SessionRepository } from '../infrastructure/session.repository';

export interface AdminBootstrapInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  private userRepo: UserRepository;
  private sessionRepo: SessionRepository;
  private config: AppConfig;

  constructor(db: D1Database, config: AppConfig) {
    this.userRepo = new UserRepository(db);
    this.sessionRepo = new SessionRepository(db);
    this.config = config;
  }

  async bootstrapAdmin(input: AdminBootstrapInput, secretHeader?: string): Promise<User> {
    if (this.config.adminBootstrapSecret && secretHeader !== this.config.adminBootstrapSecret) {
      throw new Error('Invalid bootstrap secret');
    }

    const adminCount = await this.userRepo.countAdmins();
    if (adminCount > 0) {
      throw new Error('Admin already exists');
    }

    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.userRepo.create({
      email: input.email,
      passwordHash,
      role: 'admin',
      firstName: input.firstName,
      lastName: input.lastName
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async canBootstrap(): Promise<boolean> {
    const adminCount = await this.userRepo.countAdmins();
    return adminCount === 0;
  }

  async login(email: string, password: string, meta: { userAgent?: string; ipAddress?: string; }): Promise<{ token: string; user: User; expiresAt: string; }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    if (user.role !== 'admin') {
      throw new Error('Access denied');
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken();
    const tokenHash = await sha256Hex(token);
    const expiresAt = addDays(this.config.sessionTtlDays);

    await this.sessionRepo.create({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash,
      createdAt: toIso(new Date()),
      expiresAt: toIso(expiresAt),
      lastAccessedAt: toIso(new Date()),
      isActive: true,
      userAgent: meta.userAgent || null,
      ipAddress: meta.ipAddress || null
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      expiresAt: toIso(expiresAt)
    };
  }

  async validateSession(token: string): Promise<AuthSession | null> {
    const tokenHash = await sha256Hex(token);
    const session = await this.sessionRepo.findByTokenHash(tokenHash);
    if (!session || !session.isActive) {
      return null;
    }

    if (new Date(session.expiresAt) <= new Date()) {
      await this.sessionRepo.invalidate(tokenHash);
      return null;
    }

    const user = await this.userRepo.findById(session.userId);
    if (!user || !user.isActive) {
      return null;
    }

    const lastAccess = new Date(session.lastAccessedAt).getTime();
    const now = Date.now();
    if (now - lastAccess > 5 * 60 * 1000) {
      await this.sessionRepo.touch(session.id, new Date().toISOString());
    }

    return {
      id: session.id,
      userId: user.id,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      expiresAt: session.expiresAt
    };
  }

  async logout(token: string): Promise<void> {
    const tokenHash = await sha256Hex(token);
    await this.sessionRepo.invalidate(tokenHash);
  }
}
