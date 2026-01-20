import { SESSION_CONFIG } from "../config/constants";

const encoder = new TextEncoder();

const toBase64Url = (buffer: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const normalized = `${padded}${"=".repeat(padLength)}`;
  return Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
};

const signValue = async (value: string, secret: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(signature);
};

const timingSafeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a[index] ^ b[index];
  }

  return mismatch === 0;
};

export type AdminSession = {
  name: string;
  email: string;
};

type AdminSessionPayload = AdminSession & {
  iat: number;
  exp: number;
};

export const createAdminSessionToken = async (session: AdminSession, secret: string): Promise<string> => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payloadData: AdminSessionPayload = {
    ...session,
    iat: issuedAt,
    exp: issuedAt + SESSION_CONFIG.MAX_AGE,
  };
  const payload = toBase64Url(encoder.encode(JSON.stringify(payloadData)));
  const signature = await signValue(payload, secret);
  return `${payload}.${signature}`;
};

export const readAdminSessionToken = async (token: string, secret: string): Promise<AdminSession | null> => {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = await signValue(payload, secret);
  const signatureBytes = fromBase64Url(signature);
  const expectedBytes = fromBase64Url(expectedSignature);

  if (!timingSafeEqual(signatureBytes, expectedBytes)) {
    return null;
  }

  try {
    const decoded = new TextDecoder().decode(fromBase64Url(payload));
    const parsed = JSON.parse(decoded) as AdminSessionPayload;

    if (!parsed?.email || !parsed?.name || !parsed?.exp) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (parsed.exp <= now) {
      return null;
    }

    return { name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
};

export const serializeAdminSessionCookie = (token: string): string =>
  `${SESSION_CONFIG.COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=${SESSION_CONFIG.PATH}; Max-Age=${SESSION_CONFIG.MAX_AGE}`;

export const clearAdminSessionCookie = (): string =>
  `${SESSION_CONFIG.COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=${SESSION_CONFIG.PATH}; Max-Age=0`;

export const getCookieValue = (cookieHeader: string | null, name: string): string | null => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === name) {
      return rest.join("=");
    }
  }

  return null;
};
