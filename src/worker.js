import { ensureSchema } from './db/schema.js';
import {
  createAdmin,
  createSession,
  deleteSession,
  findUserByEmail,
  getAdminCount,
  listUsers,
} from './db/adminRepo.js';
import { hashPassword, verifyPassword } from './security/password.js';
import { buildSessionCookie, clearSessionCookie, createSignedToken } from './security/session.js';
import { html, json, redirect } from './http/response.js';
import { methodNotAllowed } from './http/request.js';
import { requireAuth } from './api/auth.js';
import { dashboardPage, loginPage, setupPage, usersPage } from './pages/layout.js';
import { MAX_IMAGE_BYTES } from './env.js';

function id() {
  return crypto.randomUUID();
}

async function uploadProfileImage(env, file) {
  if (!file || typeof file.arrayBuffer !== 'function') return null;
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image too large (max 3MB).');
  const ext = file.type === 'image/webp' ? 'webp' : 'bin';
  const key = `profiles/${id()}.${ext}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });
  return key;
}

async function createAndSetSession(env, userId) {
  const session = {
    id: id(),
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14,
    createdAt: new Date().toISOString(),
  };
  await createSession(env.DB, session);
  const token = await createSignedToken(env.AUTH_SECRET, session.id);
  return buildSessionCookie(token);
}

async function apiBootstrap(request, env) {
  if (request.method !== 'POST') return methodNotAllowed();
  if ((await getAdminCount(env.DB)) > 0) return json({ error: 'Admin already exists.' }, 409);

  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  const image = form.get('image');

  if (!name || !email || password.length < 8) return json({ error: 'Invalid setup form.' }, 400);

  const existing = await findUserByEmail(env.DB, email);
  if (existing) return json({ error: 'Email already in use.' }, 409);

  const hashed = await hashPassword(password);
  const imageKey = await uploadProfileImage(env, image);
  const userId = id();
  await createAdmin(env.DB, {
    id: userId,
    email,
    name,
    imageKey,
    passwordHash: hashed.hash,
    passwordSalt: hashed.salt,
    passwordIterations: hashed.iterations,
    createdAt: new Date().toISOString(),
  });

  const cookie = await createAndSetSession(env, userId);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
}

async function apiLogin(request, env) {
  if (request.method !== 'POST') return methodNotAllowed();
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const user = await findUserByEmail(env.DB, email);
  if (!user) return json({ error: 'Invalid credentials.' }, 401);

  if (!user.password_salt || !user.password_hash || !user.password_iterations) {
    return json({ error: 'Account not initialized correctly.' }, 500);
  }

  const valid = await verifyPassword(password, {
    salt: user.password_salt,
    hash: user.password_hash,
    iterations: user.password_iterations,
  });
  if (!valid) return json({ error: 'Invalid credentials.' }, 401);

  const cookie = await createAndSetSession(env, user.id);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
}

async function apiLogout(env, user) {
  await deleteSession(env.DB, user.sessionId);
  return redirect('/login', { 'Set-Cookie': clearSessionCookie() });
}

async function getStats(db) {
  const [userCount, adminCount, sessionCount] = await Promise.all([
    db.prepare('SELECT COUNT(*) count FROM users').first(),
    db.prepare("SELECT COUNT(*) count FROM users WHERE role = 'admin'").first(),
    db.prepare('SELECT COUNT(*) count FROM sessions WHERE expires_at > ?1').bind(Date.now()).first(),
  ]);
  return {
    userCount: Number(userCount?.count ?? 0),
    adminCount: Number(adminCount?.count ?? 0),
    sessionCount: Number(sessionCount?.count ?? 0),
  };
}

async function handleRequest(request, env) {
  if (!env.AUTH_SECRET) {
    return new Response('AUTH_SECRET is required', { status: 500 });
  }

  await ensureSchema(env.DB);
  const url = new URL(request.url);

  if (url.pathname === '/api/bootstrap') return apiBootstrap(request, env);
  if (url.pathname === '/api/login') return apiLogin(request, env);

  const adminCount = await getAdminCount(env.DB);
  if (adminCount === 0) {
    if (url.pathname === '/' || url.pathname === '/setup') return html(setupPage());
    return redirect('/setup');
  }

  if (url.pathname === '/login') return html(loginPage());

  const user = await requireAuth(request, env);
  if (!user) {
    if (url.pathname.startsWith('/api/')) return json({ error: 'Unauthorized' }, 401);
    return redirect('/login');
  }

  if (url.pathname === '/api/logout') return apiLogout(env, user);
  if (url.pathname === '/' || url.pathname === '/dashboard') {
    return html(dashboardPage(user, await getStats(env.DB)));
  }
  if (url.pathname === '/users') {
    return html(usersPage(user, await listUsers(env.DB)));
  }

  return new Response('Not Found', { status: 404 });
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return json({ error: 'Worker runtime error', detail: message }, 500);
    }
  },
};
