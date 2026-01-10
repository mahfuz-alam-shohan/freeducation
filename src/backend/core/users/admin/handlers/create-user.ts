import type { Env } from '../../../../../shared/types';
import {
  apiHeaders,
  buildPasswordHash,
  ensureAdmin,
  getAuthPayload,
  isValidLevel,
  isValidSubject,
  normalizeEmail,
  normalizeLevel,
  normalizeSubject,
} from '../../shared/utils';

export const handleCreateUser = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const body = (await request.json()) as any;
  const role = String(body.role || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  const email = normalizeEmail(String(body.email || ''));
  const password = String(body.password || '');

  if (!name || !email || !password) {
    return Response.json({ success: false, error: 'Name, email, and password are required.' }, { status: 400, headers: apiHeaders });
  }
  if (password.length < 8) {
    return Response.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400, headers: apiHeaders });
  }
  if (!['admin', 'teacher', 'student'].includes(role)) {
    return Response.json({ success: false, error: 'Invalid role.' }, { status: 400, headers: apiHeaders });
  }

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return Response.json({ success: false, error: 'User with this email already exists.' }, { status: 400, headers: apiHeaders });
  }

  const { passwordHash } = await buildPasswordHash(password);
  const username = email;
  const classLabel = body.classLabel || null;
  const groupLabel = body.groupLabel || null;

  await env.DB.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').bind(email, passwordHash, role).run();

  const inserted = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (!inserted?.id) {
    return Response.json({ success: false, error: 'User creation failed.' }, { status: 500, headers: apiHeaders });
  }

  await env.DB.prepare('INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)').bind(inserted.id, username, name).run();

  if (role === 'student') {
    await env.DB
      .prepare('INSERT INTO academic_profiles (user_id, class_label, group_label) VALUES (?, ?, ?)')
      .bind(inserted.id, classLabel, groupLabel)
      .run();
  }

  if (role === 'teacher') {
    const level = normalizeLevel(String(body.level || ''));
    const subject = normalizeSubject(String(body.subject || ''));

    if (!isValidLevel(level) || !isValidSubject(subject)) {
      await env.DB.batch([
        env.DB.prepare('DELETE FROM academic_profiles WHERE user_id = ?').bind(inserted.id),
        env.DB.prepare('DELETE FROM user_profiles WHERE user_id = ?').bind(inserted.id),
        env.DB.prepare('DELETE FROM users WHERE id = ?').bind(inserted.id),
      ]);
      return Response.json({ success: false, error: 'Invalid teacher level or subject.' }, { status: 400, headers: apiHeaders });
    }

    const rawPermissions = body.permissions || [];
    const permissions = Array.isArray(rawPermissions) ? rawPermissions : [];

    await env.DB.batch([
      env.DB.prepare('INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)').bind(inserted.id, level, subject),
      env.DB
        .prepare('INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?)')
        .bind(inserted.id, JSON.stringify(permissions)),
    ]);
  }

  if (role === 'admin') {
    const rawPermissions = body.permissions || [];
    const permissions = Array.isArray(rawPermissions) ? rawPermissions : [];
    await env.DB
      .prepare('INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)')
      .bind(inserted.id, JSON.stringify(permissions))
      .run();
  }

  return Response.json({ success: true }, { headers: apiHeaders });
};
