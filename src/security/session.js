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
  const expires = new Date(expiresAt).toUTCString();
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${expires}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
