export interface CSRFConfig {
  secretLength: number;
  tokenLength: number;
  cookieName: string;
  headerName: string;
  expiresIn: number;
}

export const CSRF_CONFIG: CSRFConfig = {
  secretLength: 32,
  tokenLength: 32,
  cookieName: 'csrf_token',
  headerName: 'x-csrf-token',
  expiresIn: 60 * 60 * 1000, // 1 hour
};

// Simple in-memory store for CSRF tokens (use KV in production)
const csrfStore = new Map<string, { token: string; expires: number }>();

export const generateCSRFToken = (): string => {
  const array = new Uint8Array(CSRF_CONFIG.tokenLength);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const generateCSRFSecret = (): string => {
  const array = new Uint8Array(CSRF_CONFIG.secretLength);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const createCSRFToken = async (secret: string): Promise<string> => {
  const timestamp = Date.now().toString();
  const data = `${secret}:${timestamp}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = async (token: string, secret: string): Promise<boolean> => {
  const stored = csrfStore.get(secret);
  if (!stored || stored.expires < Date.now()) {
    return false;
  }
  
  const expectedToken = await createCSRFToken(secret);
  return token === expectedToken;
};

export const getCSRFCookie = (request: Request): string | null => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies[CSRF_CONFIG.cookieName] || null;
};

export const setCSRFCookie = (token: string): string => {
  const expires = new Date(Date.now() + CSRF_CONFIG.expiresIn).toUTCString();
  return `${CSRF_CONFIG.cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires}`;
};
