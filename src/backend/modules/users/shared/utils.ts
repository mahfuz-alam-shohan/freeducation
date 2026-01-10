import { hashPassword, verifyToken } from '../../../../shared/auth';
import type { Env } from '../../../../shared/types';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const securityHeaders = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export const apiHeaders = {
  ...corsHeaders,
  ...securityHeaders,
};

export const clampZoom = (value: number | null) => {
  if (!value || Number.isNaN(value)) return 1;
  return Math.min(1, Math.max(0.8, value));
};

export const requireJwtSecret = (env: Env) => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not configured.');
  }
  return secret;
};

export const getAuthPayload = async (request: Request, env: Env) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const secret = requireJwtSecret(env);
  return await verifyToken(authHeader.split(' ')[1], secret);
};

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const ensureAdmin = (payload: any | null) => {
  if (!payload || payload.role !== 'admin') return false;
  return true;
};

export const normalizeSubject = (value: string) => value.trim().toLowerCase();
export const normalizeLevel = (value: string) => value.trim().toUpperCase();
export const isValidKey = (value: string) => /^[a-z0-9-]+$/.test(value);
export const isValidSubject = (value: string) => /^[a-z0-9\s-]+$/.test(value);
export const isValidLevel = (value: string) => ['SSC', 'HSC'].includes(value);

export const buildPasswordHash = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hash = await hashPassword(password, saltHex);
  return {
    saltHex,
    passwordHash: `${saltHex}:${hash}`,
  };
};

export const safeParseContent = (data: unknown) => {
  if (typeof data !== 'string') return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const filterMap = (value: any, predicate: (key: string) => boolean) => {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => predicate(key)));
};

const mergeMaps = (existing: any, updates: any) => {
  if (!existing || typeof existing !== 'object') return { ...(updates || {}) };
  return { ...existing, ...(updates || {}) };
};

export const applyTeacherContentUpdate = (
  existingContent: any,
  incomingContent: any,
  assignment: { level: string; subject: string },
  canEditStructure: boolean
) => {
  const level = String(assignment.level || '').toUpperCase();
  const subject = normalizeSubject(String(assignment.subject || ''));
  const updated = { ...existingContent };
  const prefix = `${level}-`;

  const applyArray = (key: string) => {
    if (Array.isArray(incomingContent?.[key])) {
      updated[key] = incomingContent[key];
    }
  };

  const applyMapWithFilter = (key: string, predicate: (mapKey: string) => boolean) => {
    if (incomingContent?.[key] && typeof incomingContent[key] === 'object') {
      const filtered = filterMap(incomingContent[key], predicate);
      updated[key] = mergeMaps(existingContent?.[key], filtered);
    }
  };

  if (subject === 'bangla 1st paper') {
    if (canEditStructure) {
      applyArray('content');
    }
    applyMapWithFilter('banglaQuestions', (key) => key.startsWith(prefix));
    applyMapWithFilter('mcqQuestions', (key) => key.startsWith(prefix));
    applyMapWithFilter('notesByItem', (key) => key.startsWith(prefix));
    applyMapWithFilter('videosByItem', (key) => key.startsWith(prefix));
    return updated;
  }

  if (subject === 'english 2nd paper') {
    if (canEditStructure) {
      applyArray('content');
    }
    applyMapWithFilter('englishSecondQuestions', (key) => key.startsWith(prefix));
    applyMapWithFilter('mcqQuestions', (key) => key.startsWith(prefix));
    applyMapWithFilter('notesByItem', (key) => key.startsWith(prefix));
    applyMapWithFilter('videosByItem', (key) => key.startsWith(prefix));
    return updated;
  }

  if (subject === 'english 1st paper' && level === 'SSC') {
    if (canEditStructure) {
      applyArray('content');
    }
    applyMapWithFilter('englishQuestions', (key) => key.startsWith(prefix));
    return updated;
  }

  const sscScienceSubjects: Record<string, string> = {
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
  };

  if (level === 'SSC' && sscScienceSubjects[subject]) {
    const subjectLabel = sscScienceSubjects[subject];
    const keyPrefix = `${prefix}${subjectLabel}-`;
    if (canEditStructure) {
      applyArray(subjectLabel.toLowerCase());
    }
    applyMapWithFilter('srijonshilQuestions', (key) => key.startsWith(keyPrefix));
    applyMapWithFilter('mcqQuestions', (key) => key.startsWith(keyPrefix));
    applyMapWithFilter('notesByItem', (key) => key.startsWith(keyPrefix));
    applyMapWithFilter('videosByItem', (key) => key.startsWith(keyPrefix));
    return updated;
  }

  const hscScienceSubjects: Record<string, { label: string; key: string }> = {
    'physics 1st paper': { label: 'Physics-1', key: 'physics1' },
    'physics 2nd paper': { label: 'Physics-2', key: 'physics2' },
    'chemistry 1st paper': { label: 'Chemistry-1', key: 'chemistry1' },
    'chemistry 2nd paper': { label: 'Chemistry-2', key: 'chemistry2' },
    'biology 1st paper': { label: 'Biology-1', key: 'biology1' },
    'biology 2nd paper': { label: 'Biology-2', key: 'biology2' },
    'higher mathematics 1st paper': { label: 'HigherMathematics-1', key: 'higherMath1' },
    'higher mathematics 2nd paper': { label: 'HigherMathematics-2', key: 'higherMath2' },
  };

  if (level === 'HSC' && hscScienceSubjects[subject]) {
    const subjectConfig = hscScienceSubjects[subject];
    const keyPrefix = `${prefix}${subjectConfig.label}-`;
    if (canEditStructure) {
      applyArray(subjectConfig.key);
    }
    applyMapWithFilter('srijonshilQuestions', (key) => key.startsWith(keyPrefix));
    applyMapWithFilter('mcqQuestions', (key) => key.startsWith(keyPrefix));
    applyMapWithFilter('notesByItem', (key) => key.startsWith(keyPrefix));
    applyMapWithFilter('videosByItem', (key) => key.startsWith(keyPrefix));
    return updated;
  }

  if (subject === 'english 1st paper' && level === 'HSC') {
    applyMapWithFilter('englishQuestions', (key) => key.startsWith(prefix));
    return updated;
  }

  return null;
};

export type ApiHandler = (request: Request, env: Env, path: string) => Promise<Response | null>;

export const recordEditHistory = async (
  db: D1Database,
  payload: { id?: number } | null,
  action: string,
  details?: Record<string, unknown> | string | null
) => {
  if (!payload?.id) return;
  const detailValue = typeof details === 'string' || details == null ? details : JSON.stringify(details);
  await db.prepare('INSERT INTO edit_history (user_id, action, details) VALUES (?, ?, ?)')
    .bind(payload.id, action, detailValue ?? null)
    .run();
};

export const fetchUserById = async (db: D1Database, userId: number) => {
  if (!userId || Number.isNaN(userId)) return null;
  const row = await db
    .prepare('SELECT id, username, name, email, role, class_label, group_label, religion, date_of_birth, batch_year, points FROM users WHERE id = ?')
    .bind(userId)
    .first();
  return row || null;
};
