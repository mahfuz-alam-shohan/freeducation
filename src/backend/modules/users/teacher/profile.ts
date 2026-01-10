import { Hono } from 'hono';
import type { Env } from '../../../../shared/types';
import { apiHeaders, fetchUserById, getAuthPayload, normalizeEmail } from '../shared/utils';

export const teacherProfileRoutes = new Hono<{ Bindings: Env }>();

teacherProfileRoutes.get('/profile', async (c) => {
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

teacherProfileRoutes.put('/profile', async (c) => {
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
