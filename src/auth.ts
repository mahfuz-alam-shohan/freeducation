import { COOKIE_NAME, SESSION_TTL_HOURS } from "./config";
import { Env, createSession, deleteSession, getSession } from "./db";

const encoder = new TextEncoder();

export async function hashPassword(password: string, salt: Uint8Array) {
  const data = encoder.encode(password);
  const salted = new Uint8Array(salt.length + data.length);
  salted.set(salt);
  salted.set(data, salt.length);
  const digest = await crypto.subtle.digest("SHA-256", salted);
  return bufferToHex(digest);
}

export function generateSalt(length = 16) {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

export function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function encodeBase64(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer));
}

export function decodeBase64(value: string) {
  const raw = atob(value);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export async function createSessionCookie(env: Env, adminId: number) {
  const token = new Uint8Array(32);
  crypto.getRandomValues(token);
  const tokenBase64 = encodeBase64(token);
  const tokenHash = await hashToken(tokenBase64);
  const expires = new Date();
  expires.setHours(expires.getHours() + SESSION_TTL_HOURS);
  await createSession(env, adminId, tokenHash, expires.toISOString());
  const cookie = `${COOKIE_NAME}=${tokenBase64}; HttpOnly; Path=/; SameSite=Strict; Secure; Expires=${expires.toUTCString()}`;
  return cookie;
}

export async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return bufferToHex(digest);
}

export async function getSessionFromRequest(env: Env, request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((pair) => {
      const [key, ...rest] = pair.trim().split("=");
      return [key, rest.join("=")];
    })
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const tokenHash = await hashToken(token);
  return getSession(env, tokenHash);
}

export async function clearSession(env: Env, request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((pair) => {
      const [key, ...rest] = pair.trim().split("=");
      return [key, rest.join("=")];
    })
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return "";
  const tokenHash = await hashToken(token);
  await deleteSession(env, tokenHash);
  return `${COOKIE_NAME}=deleted; HttpOnly; Path=/; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
