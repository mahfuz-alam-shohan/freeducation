import type { Env } from '../../../shared/types';
import { syncDatabaseSchema } from '../db/migrator';
import { apiHeaders, buildPasswordHash, normalizeEmail } from '../users/shared/utils';

const defaultAdminPermissions = ['dashboard', 'classes', 'settings', 'thumbnails', 'userManagement'];

export const handleSetup = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/system/status' && request.method === 'GET') {
    const adminCountRow = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
    const legacyCountRow = await env.DB.prepare('SELECT count(*) as count FROM admins').first();
    const initialized = Number(adminCountRow?.count || 0) > 0 || Number(legacyCountRow?.count || 0) > 0;
    return Response.json({ initialized }, { headers: apiHeaders });
  }

  if (path !== '/api/system/init' || request.method !== 'POST') {
    return null;
  }

  await syncDatabaseSchema(env);

  const adminCountRow = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
  const adminCount = Number(adminCountRow?.count || 0);
  if (adminCount > 0) {
    return Response.json({ success: false, error: 'System already initialized' }, { status: 403, headers: apiHeaders });
  }

  const body = await request.json().catch(() => ({}));
  const adminName = String(body.adminName || '').trim();
  const email = normalizeEmail(String(body.email || ''));
  const password = String(body.password || '');
  const confirmPassword = String(body.confirmPassword || '');

  if (!adminName || !email || !password || !confirmPassword) {
    return Response.json(
      { success: false, error: 'Admin name, email, and password are required.' },
      { status: 400, headers: apiHeaders }
    );
  }
  if (password.length < 8) {
    return Response.json(
      { success: false, error: 'Password must be at least 8 characters.' },
      { status: 400, headers: apiHeaders }
    );
  }
  if (password !== confirmPassword) {
    return Response.json(
      { success: false, error: 'Passwords do not match.' },
      { status: 400, headers: apiHeaders }
    );
  }

  const { passwordHash } = await buildPasswordHash(password);

  await env.DB.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)')
    .bind(email, passwordHash, 'admin')
    .run();

  const adminRow = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (!adminRow?.id) {
    return Response.json({ success: false, error: 'Admin creation failed.' }, { status: 500, headers: apiHeaders });
  }

  await env.DB.batch([
    env.DB.prepare('INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)').bind(adminRow.id, adminName, adminName),
    env.DB
      .prepare('INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)')
      .bind(adminRow.id, JSON.stringify(defaultAdminPermissions)),
    env.DB.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').bind(adminName, passwordHash),
  ]);

  return Response.json(
    { success: true, message: 'System Initialized & Admin Created' },
    { headers: apiHeaders }
  );
};
