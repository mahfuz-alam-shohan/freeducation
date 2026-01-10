import type { Env } from '../../../../../shared/types';
import { apiHeaders, ensureAdmin, getAuthPayload } from '../../shared/utils';

export const handleDeleteStudent = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const body = (await request.json()) as any;
  const userId = Number(body.id);
  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400, headers: apiHeaders });
  }

  const userRow = await env.DB.prepare('SELECT role FROM users WHERE id = ?').bind(userId).first();
  if (!userRow) {
    return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
  }
  if (userRow.role !== 'student') {
    return Response.json({ success: false, error: 'Only student accounts can be deleted here.' }, { status: 400, headers: apiHeaders });
  }

  const avatarRow = await env.DB.prepare('SELECT avatar_key FROM user_profiles WHERE user_id = ?').bind(userId).first();

  await env.DB.batch([
    env.DB.prepare('DELETE FROM academic_profiles WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM social_profiles WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM user_profiles WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM admin_permissions WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM teacher_assignments WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM teacher_permissions WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM edit_history WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM user_points_log WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId),
  ]);

  if (avatarRow?.avatar_key) {
    await env.BUCKET.delete(avatarRow.avatar_key as string);
  }

  return Response.json({ success: true }, { headers: apiHeaders });
};
