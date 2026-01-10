import { handleApiRequest } from './api';
import { getFrontendHtml } from './frontend';
import type { Env } from './shared/types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const apiResponse = await handleApiRequest(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    const url = new URL(request.url);
    const securityHeaders = {
      'Content-Type': 'text/html',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };

    return new Response(getFrontendHtml(url.pathname), {
      headers: securityHeaders,
    });
  },
};
