// Route registry and handler

import { authRoutes } from './auth.js';
import { userRoutes } from './users.js';
import { classRoutes } from './classes.js';
import { settingsRoutes } from './settings.js';
import { mediaRoutes } from './media.js';

// Combine all routes
export const allRoutes = {
  ...authRoutes,
  ...userRoutes,
  ...classRoutes,
  ...settingsRoutes,
  ...mediaRoutes
};

// Route handler function
export const handleRoute = async (request, env, ctx) => {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Find matching route
  const routeHandler = allRoutes[path];
  
  if (routeHandler) {
    try {
      return await routeHandler(request, env, ctx);
    } catch (error) {
      console.error(`Route handler error for ${path}:`, error);
      return Response.json(
        { success: false, error: "Internal server error" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  // Handle dynamic routes (like /api/font/:fileKey)
  if (path.startsWith('/api/font/')) {
    return await settingsRoutes['/api/font/:fileKey'](request, env, ctx);
  }
  
  // Handle avatar routes
  if (path.startsWith('/api/avatar/')) {
    return await handleAvatarRoute(request, env, ctx);
  }
  
  return null; // No matching route
};

// Avatar route handler
const handleAvatarRoute = async (request, env, ctx) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const fileKey = pathParts[pathParts.length - 1];
  const token = url.searchParams.get('t');

  if (!fileKey) {
    return Response.json({ success: false, error: "File key is required." }, { status: 400 });
  }

  // Get avatar info from database
  const avatar = await env.DB.prepare(`
    SELECT avatar_content_type, updated_at 
    FROM user_profiles 
    WHERE avatar_key = ?
  `).bind(fileKey).first();

  if (!avatar) {
    return Response.json({ success: false, error: "Avatar not found." }, { status: 404 });
  }

  try {
    const object = await env.STORAGE.get(`avatars/${fileKey}`);
    if (!object) {
      return Response.json({ success: false, error: "Avatar file not found." }, { status: 404 });
    }

    const headers = {
      'Content-Type': avatar.avatar_content_type || 'image/jpeg',
      'Cache-Control': token ? 'private, max-age=3600' : 'public, max-age=31536000',
    };

    // Add security headers for private avatars
    if (token) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Avatar retrieval error:', error);
    return Response.json({ success: false, error: "Failed to retrieve avatar." }, { status: 500 });
  }
};
