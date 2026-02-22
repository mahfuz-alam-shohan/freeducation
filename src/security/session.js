import { SESSION_COOKIE, SESSION_TTL_MS } from "../env.js";

function toBase64Url(input) {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const norm = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 ? "=".repeat(4 - (norm.length % 4)) : "";
  return atob(norm + pad);
}

async function sign(secret, payload) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  let s = "";
  new Uint8Array(signature).forEach((b) => {
    s += String.fromCharCode(b);
  });
  return toBase64Url(s);
}

export async function createSignedToken(secret, sessionId) {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${sessionId}.${exp}`;
  const sig = await sign(secret, payload);
  return `${toBase64Url(payload)}.${sig}`;
}

export async function verifySignedToken(secret, token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const payload = fromBase64Url(parts[0]);
  const expected = await sign(secret, payload);
  if (expected !== parts[1]) return null;
  const [sessionId, exp] = payload.split(".");
  if (!sessionId || Number(exp) < Date.now()) return null;
  return { sessionId, exp: Number(exp) };
}

export function buildSessionCookie(token) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
