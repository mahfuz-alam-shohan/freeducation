import type { Env } from '../shared/types/env';

export interface AppConfig {
  corsOrigin: string;
  sessionTtlDays: number;
  sessionCookieName: string;
  adminBootstrapSecret?: string;
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig(env: Env): AppConfig {
  return {
    corsOrigin: env.CORS_ORIGIN || '*',
    sessionTtlDays: parseNumber(env.SESSION_TTL_DAYS, 7),
    sessionCookieName: env.SESSION_COOKIE_NAME || 'fe_admin_session',
    adminBootstrapSecret: env.ADMIN_BOOTSTRAP_SECRET || undefined
  };
}
