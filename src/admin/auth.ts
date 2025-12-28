import { COOKIE_NAME, HASH_ITERATIONS, SESSION_DAYS } from "../constants";
import type { AdminSession, Env } from "../types";

export async function createSession(env: Env, adminId: number): Promise<string> {
  const token = generateToken();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const result = await env.DB.prepare(
    "INSERT INTO admin_sessions (admin_id, token, created_at, expires_at) VALUES (?, ?, ?, ?)"
  )
    .bind(adminId, token, createdAt.toISOString(), expiresAt.toISOString())
    .run();

  if (!result.success) {
    throw new Error(result.error ? `Unable to create session: ${result.error}` : "Unable to create session.");
  }

  return token;
}

export async function logoutAdmin(request: Request, env: Env): Promise<Response> {
  const token = getCookie(request, COOKIE_NAME);
  if (token) {
    await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
  }

  const headers = new Headers({ Location: new URL("/admin", request.url).toString() });
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  return new Response(null, { status: 303, headers });
}

export async function getSession(request: Request, env: Env): Promise<AdminSession | null> {
  const token = getCookie(request, COOKIE_NAME);
  if (!token) {
    return null;
  }

  const now = new Date().toISOString();
  const session = await env.DB.prepare(
    `SELECT admins.id as id, admins.name as name, admins.email as email
     FROM admin_sessions
     JOIN admins ON admins.id = admin_sessions.admin_id
     WHERE admin_sessions.token = ? AND admin_sessions.expires_at > ?`
  )
    .bind(token, now)
    .first<AdminSession>();

  return session ?? null;
}

export function redirectWithSession(request: Request, token: string): Response {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const headers = new Headers({ Location: new URL("/admin", request.url).toString() });
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
  return new Response(null, { status: 303, headers });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: HASH_ITERATIONS,
    },
    key,
    256
  );

  const hash = new Uint8Array(bits);
  return ["pbkdf2", HASH_ITERATIONS.toString(), toBase64(salt), toBase64(hash)].join("$");
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [method, iterationsValue, saltValue, hashValue] = storedHash.split("$");
  if (method !== "pbkdf2") {
    return false;
  }

  const iterations = Number(iterationsValue);
  if (!iterations || !saltValue || !hashValue) {
    return false;
  }

  const salt = fromBase64(saltValue);
  const expectedHash = fromBase64(hashValue);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    key,
    expectedHash.length * 8
  );

  const actualHash = new Uint8Array(bits);
  return timingSafeEqual(actualHash, expectedHash);
}

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64Url(bytes);
}

function toBase64(data: Uint8Array): string {
  let binary = "";
  data.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function toBase64Url(data: Uint8Array): string {
  return toBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
