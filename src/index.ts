/**
 * FREEDUCATION LMS - Cloudflare Worker
 * Single-file Full Stack Application
 * * FEATURES INCLUDED:
 * 1. Database: Automatic table creation
 * 2. Security: Salted Password Hashing for Users
 * 3. Frontend: Minimal landing page with login and signup
 */

import { handleApiRequest } from "./api";
import { getFrontendHtml } from "./frontend/pages";
import type { Env } from "./types";

// --- WORKER ENTRY POINT ---
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const apiResponse = await handleApiRequest(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    const url = new URL(request.url);

    // --- FRONTEND SERVING ---
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
