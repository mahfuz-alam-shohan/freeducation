import type { Env } from '../../../../../shared/types';
import { apiHeaders, ensureAdmin, fetchUserById, getAuthPayload, normalizeEmail } from '../../shared/utils';

export const handleUserDetailsGet = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const url = new URL(request.url);
  const userId = Number(url.searchParams.get('id'));
  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400, headers: apiHeaders });
  }

  const userRow = await env.DB
    .prepare(
      `SELECT users.id, users.email, users.role, user_profiles.name, user_profiles.created_at,
              academic_profiles.class_label, academic_profiles.group_label, academic_profiles.religion,
              academic_profiles.date_of_birth, academic_profiles.batch_year, academic_profiles.points
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       LEFT JOIN academic_profiles ON academic_profiles.user_id = users.id
       WHERE users.id = ?`
    )
    .bind(userId)
    .first();

  if (!userRow) {
    return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
  }

  const logs = await env.DB.prepare('SELECT points, reason, created_at FROM user_points_log WHERE user_id = ? ORDER BY created_at DESC')
    .bind(userId)
    .all();

  return Response.json(
    {
      success: true,
      user: {
        id: userRow.id,
        name: userRow.name || userRow.email,
        email: userRow.email,
        role: userRow.role,
        classLabel: userRow.class_label,
        groupLabel: userRow.group_label,
        religion: userRow.religion,
        dateOfBirth: userRow.date_of_birth,
        batchYear: userRow.batch_year,
        points: userRow.points || 0,
        createdAt: userRow.created_at,
        pointLogs: (logs.results || []).map((row: any) => ({
          points: row.points,
          reason: row.reason,
          createdAt: row.created_at,
        })),
      },
    },
    { headers: apiHeaders }
  );
};

export const handleUserDetailsUpdate = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const body = (await request.json()) as any;
  const userId = Number(body.id);
  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400, headers: apiHeaders });
  }

  const existing = await fetchUserById(env.DB, userId);

  if (!existing) {
    return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
  }

  if (existing.role !== 'student') {
    return Response.json({ success: false, error: 'Only student accounts can be edited here.' }, { status: 400, headers: apiHeaders });
  }

  const name = body.name ? String(body.name).trim() : null;
  const email = body.email ? normalizeEmail(String(body.email)) : null;
  const classLabel = body.classLabel ? String(body.classLabel).trim() : null;
  const groupLabel = body.groupLabel ? String(body.groupLabel).trim() : null;
  const religion = body.religion ? String(body.religion).trim() : null;
  const dateOfBirth = body.dateOfBirth ? String(body.dateOfBirth).trim() : null;
  const batchYear = body.batchYear ? String(body.batchYear).trim() : null;

  const nextEmail = email || (existing.email as string);
  if (email && email !== existing.email) {
    const conflict = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?').bind(email, userId).first();
    if (conflict) {
      return Response.json({ success: false, error: 'Email already in use.' }, { status: 400, headers: apiHeaders });
    }
  }

  await env.DB.batch([
    env.DB.prepare('UPDATE users SET email = ? WHERE id = ?').bind(nextEmail, userId),
    env.DB
      .prepare(
        'INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?) ' +
          'ON CONFLICT(user_id) DO UPDATE SET username = excluded.username, name = excluded.name, updated_at = CURRENT_TIMESTAMP'
      )
      .bind(userId, nextEmail, name),
    env.DB
      .prepare(
        'INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year) VALUES (?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(user_id) DO UPDATE SET class_label = excluded.class_label, group_label = excluded.group_label, religion = excluded.religion, date_of_birth = excluded.date_of_birth, batch_year = excluded.batch_year, updated_at = CURRENT_TIMESTAMP'
      )
      .bind(userId, classLabel, groupLabel, religion, dateOfBirth, batchYear),
  ]);

  return Response.json({ success: true }, { headers: apiHeaders });
};
