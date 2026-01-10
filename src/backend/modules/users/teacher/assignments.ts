import { Hono } from 'hono';
import type { Env } from '../../../../shared/types';
import {
  apiHeaders,
  getAuthPayload,
  isValidLevel,
  isValidSubject,
  normalizeLevel,
  normalizeSubject,
} from '../shared/utils';

export const teacherAssignmentRoutes = new Hono<{ Bindings: Env }>();

teacherAssignmentRoutes.get('/assignments', async (c) => {
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

teacherAssignmentRoutes.put('/assignments', async (c) => {
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
