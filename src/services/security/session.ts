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

export const createAdminSessionToken = async (session: AdminSession, secret: string): Promise<string> => {
  const payload = toBase64Url(encoder.encode(JSON.stringify(session)));
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
    const parsed = JSON.parse(decoded) as AdminSession;

    if (!parsed?.email || !parsed?.name) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const serializeAdminSessionCookie = (token: string): string =>
  `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;

export const clearAdminSessionCookie = (): string =>
  "admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";

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
