import { SESSION_COOKIE } from "../config.js";

const encoder = new TextEncoder();

async function sha256(value) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(hash)].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export async function tokenHash(token) {
  return sha256(token);
}

export function parseCookie(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(cookieHeader.split(";").map((part) => {
    const [k, ...rest] = part.trim().split("=");
    return [k, decodeURIComponent(rest.join("="))];
  }).filter(([k]) => k));
  return cookies[SESSION_COOKIE] || null;
}

export function sessionCookie(value, expiresAt) {
  const expiryDate = new Date(expiresAt);
  const expires = expiryDate.toUTCString();
  const maxAgeSeconds = Math.max(0, Math.floor((expiryDate.getTime() - Date.now()) / 1000));
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=${expires}; Max-Age=${maxAgeSeconds}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
