/**
 * FREEDUCATION LMS - Cloudflare Worker
 * Single-file Full Stack Application
 * * FEATURES INCLUDED:
 * 1. Database: Automatic table creation & Reset capability
 * 2. Security: Salted Password Hashing for Admins
 * 3. Student Frontend: Interactive study mode, Search, Class Browsing
 * 4. Admin Dashboard: Full content management (Class -> Subject -> Chapter -> Topic -> Question)
 * 5. Class Linking: Alias system (e.g., Class 10 uses Class 9 content)
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
