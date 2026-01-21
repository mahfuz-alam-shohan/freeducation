import { jsonResponse } from '../core/http/response';
import { validateCSRFToken } from '../core/middleware/csrf';
import { getAdminSession } from '../api/admin';
import type { Env } from '../app/env';
import type { ApiContext } from './index';

// D1 Database interface
type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
  };
};

// Simple validation for now (can add zod later if needed)
const UserPreferencesSchema = {
  sidebarState: ['minimized', 'expanded'],
};

export const handleUserRoutes = async (
  request: Request,
  env: Env,
  context: ApiContext,
): Promise<Response | null> => {
  const { session } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Only handle /api/user/* routes
  if (!path.startsWith('/api/user/')) {
    return null;
  }

  // GET /api/user/preferences - Get user preferences
  if (request.method === 'GET' && path === '/api/user/preferences') {
    if (!session) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
      // Get user preferences from database
      const result = await env.DB.prepare(`
        SELECT preferences FROM users WHERE email = ?
      `).bind(session.email).all();

      const preferences = result.results && result.results[0] ? JSON.parse(result.results[0].preferences) : {};
      
      return jsonResponse({
        sidebarState: preferences.sidebarState || 'expanded',
        theme: preferences.theme || 'light',
      });
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return jsonResponse({ error: 'Failed to get preferences' }, 500);
    }
  }

  // POST /api/user/preferences - Update user preferences
  if (request.method === 'POST' && path === '/api/user/preferences') {
    if (!session) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    // Validate CSRF token
    const csrfToken = request.headers.get('X-CSRF-Token');
    if (!csrfToken) {
      return jsonResponse({ error: 'CSRF token required' }, 403);
    }

    try {
      const body = await request.json();
      
      // Validate sidebarState
      if (body.sidebarState && !UserPreferencesSchema.sidebarState.includes(body.sidebarState)) {
        return jsonResponse({ error: 'Invalid sidebarState value' }, 400);
      }

      // Get current preferences
      const currentResult = await env.DB.prepare(`
        SELECT preferences FROM users WHERE email = ?
      `).bind(session.email).all();

      const currentPreferences = currentResult.results && currentResult.results[0] ? JSON.parse(currentResult.results[0].preferences) : {};

      // Update preferences with new data
      const updatedPreferences = {
        ...currentPreferences,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      // Save to database
      await env.DB.prepare(`
        UPDATE users SET preferences = ? WHERE email = ?
      `).bind(JSON.stringify(updatedPreferences), session.email).run();

      return jsonResponse({
        success: true,
        preferences: updatedPreferences,
      });
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      return jsonResponse({ error: 'Failed to update preferences' }, 500);
    }
  }

  return null;
};
