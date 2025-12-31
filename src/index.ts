/**
 * FREEDUCATION LMS - Cloudflare Worker
 * Single-file Full Stack Application
 * * FEATURES INCLUDED:
 * 1. Database: Automatic table creation
 * 2. Security: Salted Password Hashing for Users
 * 3. Frontend: Minimal landing page with login and signup
 */

import { handleApiRequest } from "./api";
import { getHtml } from "./frontend";
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
    return new Response(getHtml(url.pathname), {
      headers: { "Content-Type": "text/html" },
    });
  },
};
