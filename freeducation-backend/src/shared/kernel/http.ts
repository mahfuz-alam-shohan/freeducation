export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  path?: string;
  maxAge?: number;
}

export function jsonResponse(status: number, body: unknown, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

export function textResponse(status: number, body: string, headers: HeadersInit = {}): Response {
  return new Response(body, {
    status,
    headers
  });
}

export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;

  const parts = header.split(';').map((part) => part.trim());
  for (const part of parts) {
    const [key, ...rest] = part.split('=');
    if (key === name) {
      return rest.join('=');
    }
  }

  return null;
}

export function setCookie(headers: Headers, name: string, value: string, options: CookieOptions = {}): void {
  const segments = [`${name}=${value}`];

  if (options.maxAge !== undefined) {
    segments.push(`Max-Age=${options.maxAge}`);
  }
  if (options.httpOnly) {
    segments.push('HttpOnly');
  }
  if (options.secure) {
    segments.push('Secure');
  }
  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }
  if (options.path) {
    segments.push(`Path=${options.path}`);
  }

  headers.append('Set-Cookie', segments.join('; '));
}
