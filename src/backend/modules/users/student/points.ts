import type { Env } from '../../../../shared/types';
import { apiHeaders, getAuthPayload } from '../shared/utils';

const loadPointsLog = async (db: D1Database, userId: number) => {
  const rows = await db
    .prepare('SELECT points, reason, created_at FROM user_points_log WHERE user_id = ? ORDER BY created_at DESC')
    .bind(userId)
    .all();
  return (rows.results || []).map((row: any) => ({
    points: row.points,
    reason: row.reason,
    createdAt: row.created_at,
  }));
};

export const handleStudentPoints = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/points' && request.method === 'GET') {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== 'student') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
    }

    const row = await env.DB.prepare('SELECT points FROM users WHERE id = ?').bind(payload.id).first();
    if (!row) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
    }
    const logs = await loadPointsLog(env.DB, payload.id);

    return Response.json({ success: true, points: row.points || 0, logs }, { headers: apiHeaders });
  }

  return null;
};
