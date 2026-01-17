const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const COOKIE_NAME = "freeducation_session";

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function sessionMaxAge() {
  return SESSION_MAX_AGE;
}

export function getSessionToken(request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      return [name, rest.join("=")];
    })
  );

  return cookies[COOKIE_NAME];
}

export function buildSessionCookie(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function generateToken() {
  return crypto.randomUUID();
}

export async function hashPassword(password, saltBase64) {
  const encoder = new TextEncoder();
  const salt = saltBase64 ? fromBase64(saltBase64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return {
    hash: toBase64(new Uint8Array(hashBuffer)),
    salt: toBase64(salt),
  };
}

function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}
