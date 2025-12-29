import type { Bindings } from '../types';

const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const fromHex = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const randomHex = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
};

export const hashPassword = async (password: string, salt: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: fromHex(salt),
      iterations: 120000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  return toHex(bits);
};

export const createSalt = () => randomHex(16);

export const verifyPassword = async (password: string, salt: string, hash: string) => {
  const derived = await hashPassword(password, salt);
  return derived === hash;
};

export const createSession = async (env: Bindings, adminId: number) => {
  const token = randomHex(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
  await env.DB.prepare(
    'INSERT INTO sessions (admin_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(adminId, token, expiresAt, new Date().toISOString())
    .run();
  return { token, expiresAt };
};

export const getSessionAdmin = async (env: Bindings, token?: string | null) => {
  if (!token) {
    return null;
  }
  const row = await env.DB.prepare(
    `SELECT admins.id, admins.name, admins.email, sessions.expires_at
     FROM sessions
     JOIN admins ON admins.id = sessions.admin_id
     WHERE sessions.token = ?`
  )
    .bind(token)
    .first<{ id: number; name: string; email: string; expires_at: string }>();

  if (!row) {
    return null;
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return { id: row.id, name: row.name, email: row.email };
};

export const clearSession = async (env: Bindings, token?: string | null) => {
  if (!token) {
    return;
  }
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
};

export const getCookie = (cookieHeader: string | null, name: string) => {
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
};

export const buildCookie = (name: string, value: string, options?: { maxAge?: number }) => {
  const parts = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (options?.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  return parts.join('; ');
};
