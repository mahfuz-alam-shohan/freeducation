import type { Env } from '../../../../../shared/types';
import { apiHeaders, ensureAdmin, getAuthPayload, isValidLevel, isValidSubject, normalizeLevel, normalizeSubject } from '../../shared/utils';

export const handleUpdateTeacher = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const body = (await request.json()) as any;
  const userId = Number(body.id);
  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400, headers: apiHeaders });
  }

  const role = String(body.role || '').trim().toLowerCase();

  if (role === 'teacher') {
    const level = normalizeLevel(String(body.level || ''));
    const subject = normalizeSubject(String(body.subject || ''));

    if (!isValidLevel(level) || !isValidSubject(subject)) {
      return Response.json({ success: false, error: 'Invalid teacher level or subject.' }, { status: 400, headers: apiHeaders });
    }

    const permissions = body.permissions || [];
    await env.DB.batch([
      env.DB
        .prepare(
          'INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET level=excluded.level, subject=excluded.subject'
        )
        .bind(userId, level, subject),
      env.DB
        .prepare(
          'INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET permissions=excluded.permissions'
        )
        .bind(userId, JSON.stringify(permissions)),
    ]);
  }

  return Response.json({ success: true }, { headers: apiHeaders });
};
