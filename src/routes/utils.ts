import type { DeviceType } from "../layouts/pageLayout";

export type Env = {
  DB: {
    prepare: (query: string) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
      run: () => Promise<void>;
      bind: (...values: unknown[]) => { run: () => Promise<void> };
    };
  };
  JWT_SECRET: string;
};

export const jsonResponse = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const htmlResponse = (html: string, status = 200, headers?: HeadersInit): Response =>
  new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", ...headers },
  });

export const redirectResponse = (location: string, headers?: HeadersInit): Response =>
  new Response(null, {
    status: 302,
    headers: { Location: location, ...headers },
  });

export const badRequest = (message: string): Response => jsonResponse({ error: message }, 400);

export const serviceError = (message: string): Response =>
  new Response(message, { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } });

export const getDeviceType = (userAgent: string | null): DeviceType => {
  const agent = userAgent?.toLowerCase() ?? "";
  if (/mobi|android|iphone|ipod/.test(agent)) {
    return "mobile";
  }
  if (/ipad|tablet/.test(agent)) {
    return "tablet";
  }
  return "desktop";
};
