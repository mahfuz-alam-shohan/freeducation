/**
 * FREEDUCATION LMS - Cloudflare Worker
 */

import { handleApiRequest } from "./api";
import { getFrontendHtml } from "./frontend/pages";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. Try to handle as an API request first
    const apiResponse = await handleApiRequest(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    // 2. If not API, serve the Frontend (HTML)
    const url = new URL(request.url);
    const securityHeaders = {
      "Content-Type": "text/html",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    };

    return new Response(getFrontendHtml(url.pathname), {
      headers: securityHeaders,
    });
  },
};
