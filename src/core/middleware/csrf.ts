export interface CSRFConfig {
  tokenLength: number;
  cookieName: string;
  headerName: string;
  formFieldName: string;
  maxAgeSeconds: number;
}

export const CSRF_CONFIG: CSRFConfig = {
  tokenLength: 32,
  cookieName: "csrf_token",
  headerName: "x-csrf-token",
  formFieldName: "csrf_token",
  maxAgeSeconds: 60 * 60, // 1 hour
};

const toHex = (buffer: Uint8Array): string =>
  Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
};

export const createCSRFToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(CSRF_CONFIG.tokenLength));
  return toHex(bytes);
};

export const getCSRFCookie = (request: Request): string | null => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === CSRF_CONFIG.cookieName) {
      return rest.join("=");
    }
  }

  return null;
};

export const setCSRFCookie = (token: string): string =>
  `${CSRF_CONFIG.cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${CSRF_CONFIG.maxAgeSeconds}`;

export const extractCSRFToken = async (request: Request): Promise<string | null> => {
  const headerToken = request.headers.get(CSRF_CONFIG.headerName);
  if (headerToken) {
    return headerToken;
  }

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const cloned = request.clone();
    const formData = await cloned.formData().catch(() => null);
    const token = formData?.get(CSRF_CONFIG.formFieldName);
    return typeof token === "string" ? token : null;
  }

  return null;
};

export const validateCSRFToken = (token: string | null, cookie: string | null): boolean => {
  if (!token || !cookie) {
    return false;
  }

  return timingSafeEqual(token, cookie);
};
