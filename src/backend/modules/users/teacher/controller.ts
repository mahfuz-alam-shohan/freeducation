import { Hono } from 'hono';
import type { Env } from '../../../../shared/types';
import {
  apiHeaders,
  fetchUserById,
  getAuthPayload,
  isValidLevel,
  isValidSubject,
  normalizeEmail,
  normalizeLevel,
  normalizeSubject,
} from '../shared/utils';

const teacherRoutes = new Hono<{ Bindings: Env }>();

teacherRoutes.get('/profile', async (c) => {
  const payload = await getAuthPayload(c.req.raw, c.env);
  if (!payload || payload.role !== 'teacher') {
    return c.json({ success: false, error: 'Unauthorized' }, 401, apiHeaders);
  }

  const userRow = await fetchUserById(c.env.DB, payload.id);
  if (!userRow) {
    return c.json({ success: false, error: 'User not found.' }, 404, apiHeaders);
  }

  const assignmentRow = await c.env.DB
    .prepare('SELECT level, subject FROM teacher_assignments WHERE user_id = ?')
    .bind(payload.id)
    .first();
  const permissionsRow = await c.env.DB
    .prepare('SELECT permissions FROM teacher_permissions WHERE user_id = ?')
    .bind(payload.id)
    .first();

  return c.json(
    {
      success: true,
      profile: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        assignment: assignmentRow
          ? {
              level: assignmentRow.level,
              subject: assignmentRow.subject,
            }
          : null,
        permissions: permissionsRow?.permissions ? JSON.parse(permissionsRow.permissions as string) : [],
      },
    },
    200,
    apiHeaders
  );
});

teacherRoutes.put('/profile', async (c) => {
  const payload = await getAuthPayload(c.req.raw, c.env);
  if (!payload || payload.role !== 'teacher') {
    return c.json({ success: false, error: 'Unauthorized' }, 401, apiHeaders);
  }

  const body = await c.req.json().catch(() => ({}));
  const name = body.name ? String(body.name).trim() : null;
  const email = body.email ? normalizeEmail(String(body.email)) : null;

  const existing = await fetchUserById(c.env.DB, payload.id);
  if (!existing) {
    return c.json({ success: false, error: 'User not found.' }, 404, apiHeaders);
  }

  if (email && email !== existing.email) {
    const conflict = await c.env.DB
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .bind(email, payload.id)
      .first();
    if (conflict) {
      return c.json({ success: false, error: 'Email already in use.' }, 400, apiHeaders);
    }
  }

  await c.env.DB
    .prepare('UPDATE users SET name = ?, email = ?, username = ? WHERE id = ?')
    .bind(name || existing.name, email || existing.email, email || existing.email, payload.id)
    .run();

  return c.json({ success: true }, 200, apiHeaders);
});

teacherRoutes.get('/assignments', async (c) => {
  const payload = await getAuthPayload(c.req.raw, c.env);
  if (!payload || payload.role !== 'teacher') {
    return c.json({ success: false, error: 'Unauthorized' }, 401, apiHeaders);
  }

  const assignmentRow = await c.env.DB
    .prepare('SELECT level, subject FROM teacher_assignments WHERE user_id = ?')
    .bind(payload.id)
    .first();
  const permissionsRow = await c.env.DB
    .prepare('SELECT permissions FROM teacher_permissions WHERE user_id = ?')
    .bind(payload.id)
    .first();

  return c.json(
    {
      success: true,
      assignment: assignmentRow
        ? {
            level: assignmentRow.level,
            subject: assignmentRow.subject,
          }
        : null,
      permissions: permissionsRow?.permissions ? JSON.parse(permissionsRow.permissions as string) : [],
    },
    200,
    apiHeaders
  );
});

teacherRoutes.put('/assignments', async (c) => {
  const payload = await getAuthPayload(c.req.raw, c.env);
  if (!payload || payload.role !== 'teacher') {
    return c.json({ success: false, error: 'Unauthorized' }, 401, apiHeaders);
  }

  const body = await c.req.json().catch(() => ({}));
  const level = normalizeLevel(String(body.level || ''));
  const subject = normalizeSubject(String(body.subject || ''));

  if (!isValidLevel(level) || !isValidSubject(subject)) {
    return c.json({ success: false, error: 'Invalid teacher level or subject.' }, 400, apiHeaders);
  }

  const rawPermissions = body.permissions || [];
  const permissions = Array.isArray(rawPermissions) ? rawPermissions : [];

  await c.env.DB.batch([
    c.env.DB
      .prepare(
        'INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET level = excluded.level, subject = excluded.subject'
      )
      .bind(payload.id, level, subject),
    c.env.DB
      .prepare(
        'INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET permissions = excluded.permissions'
      )
      .bind(payload.id, JSON.stringify(permissions)),
  ]);

  return c.json({ success: true }, 200, apiHeaders);
});

export default teacherRoutes;
