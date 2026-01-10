import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import studentAuth from './routes/student-auth';

// --- Legacy Imports (Using 'import *' to safely find the handler functions) ---
import * as auth from './routes/auth';
import * as users from './routes/users';
import * as classes from './routes/classes';
import * as content from './routes/content';
import * as videos from './routes/videos';
import * as thumbnails from './routes/thumbnails';
import * as settings from './routes/settings';
import * as setup from './routes/setup';
import * as profile from './routes/profile';
import * as fonts from './routes/fonts';
// Note: 'shared.ts' is excluded because it contains helpers, not routes.

// Helper to find the main handler function in a legacy module
function findLegacyHandler(mod: any) {
  // Looks for the first exported function (e.g., handleAuth, handleUsers)
  return Object.values(mod).find(item => typeof item === 'function') as Function | undefined;
}

// --- New Hono App (For Student Auth) ---
const app = new Hono<{ Bindings: Env }>();
app.use('/api/*', cors());
app.route('/api/student', studentAuth);

// --- Main Request Handler ---
export const handleApiRequest = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Try the New System first (Student Routes)
  if (path.startsWith('/api/student')) {
    return app.fetch(request, env);
  }

  // 2. Fallback to Legacy System (Admin, Teacher, etc.)
  const legacyModules = [
    auth, users, classes, content, videos, thumbnails, settings, setup, profile, fonts
  ];

  for (const mod of legacyModules) {
    const handler = findLegacyHandler(mod);
    if (handler) {
      // Legacy handlers typically expect (request, env, path)
      const response = await handler(request, env, path);
      if (response) return response;
    }
  }

  // 3. If no API matched, return null (so index.ts can serve the Frontend)
  return null;
};
