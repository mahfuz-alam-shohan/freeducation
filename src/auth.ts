import { COOKIE_NAME, SESSION_DAYS, HASH_ITERATIONS } from "./constants";
import type { Env, AdminSession } from "./types";

export async function getSession(request: Request, env: Env): Promise<AdminSession | null> {
  const cookie = request.headers.get("Cookie");
  if (!cookie || !cookie.includes(COOKIE_NAME)) return null;

  const token = parseCookie(cookie, COOKIE_NAME);
  if (!token) return null;

  const session = await env.DB.prepare(`
    SELECT admins.id, admins.name, admins.email 
    FROM admin_sessions 
    JOIN admins ON admins.id = admin_sessions.admin_id 
    WHERE token = ? AND expires_at > ?
  `)
  .bind(token, new Date().toISOString())
  .first<AdminSession>();

  return session || null;
}

export async function createSession(env: Env, adminId: number): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await env.DB.prepare(
    "INSERT INTO admin_sessions (admin_id, token, created_at, expires_at) VALUES (?, ?, ?, ?)"
  ).bind(adminId, token, new Date().toISOString(), expiresAt.toISOString()).run();

  return token;
}

export async function destroySession(env: Env, token: string) {
  await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
}

export function createAuthHeaders(url: string, token: string | null = null): Headers {
  const headers = new Headers();
  headers.set("Location", url);
  
  if (token) {
    const maxAge = SESSION_DAYS * 86400;
    headers.set("Set-Cookie", `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
  } else {
    headers.set("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  }
  
  return headers;
}

// --- Password Utils ---

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: HASH_ITERATIONS }, key, 256);
  return `pbkdf2$${HASH_ITERATIONS}$${toBase64(salt)}$${toBase64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;
  
  const [alg, iter, saltB64, hashB64] = parts;
  const salt = fromBase64(saltB64);
  const originalHash = fromBase64(hashB64);
  
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: Number(iter) }, key, 256);
  
  const newHash = new Uint8Array(bits);
  if (newHash.length !== originalHash.length) return false;
  
  let result = 0;
  for (let i = 0; i < newHash.length; i++) result |= newHash[i] ^ originalHash[i];
  return result === 0;
}

// Helpers
function parseCookie(cookieString: string, name: string): string | null {
  const match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
function toBase64(arr: Uint8Array) { return btoa(String.fromCharCode(...arr)); }
function fromBase64(str: string) { return Uint8Array.from(atob(str), c => c.charCodeAt(0)); }
