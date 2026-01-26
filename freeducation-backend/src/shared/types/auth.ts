import type { UserRole } from './user';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthSession {
  id: string;
  userId: number;
  role: UserRole;
  user: AuthUser;
  expiresAt: string;
}
