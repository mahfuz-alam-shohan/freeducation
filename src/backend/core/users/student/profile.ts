import type { Env } from '../../../../shared/types';
import { apiHeaders, fetchUserById, getAuthPayload, recordEditHistory } from '../shared/utils';

const isCompleteProfile = (profile: {
  religion?: string | null;
  classLabel?: string | null;
  groupLabel?: string | null;
  dateOfBirth?: string | null;
  batchYear?: string | null;
}) => {
  const classLabel = profile.classLabel ? String(profile.classLabel).trim() : '';
  const religion = profile.religion ? String(profile.religion).trim() : '';
  const dateOfBirth = profile.dateOfBirth ? String(profile.dateOfBirth).trim() : '';
  const batchYear = profile.batchYear ? String(profile.batchYear).trim() : '';
  const groupLabel = profile.groupLabel ? String(profile.groupLabel).trim() : '';
  const requiresGroup = classLabel === 'SSC' || classLabel === 'HSC';
  const requiresBatch = classLabel === 'SSC' || classLabel === 'HSC';
  if (!religion || !classLabel || !dateOfBirth) return false;
  if (requiresGroup && !groupLabel) return false;
  if (requiresBatch && !batchYear) return false;
  return true;
};

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

export const handleStudentProfile = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/student/profile' && request.method === 'GET') {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== 'student') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
    }

    const row = await fetchUserById(env.DB, payload.id);
    const academicRow = await env.DB
      .prepare('SELECT class_label, group_label, religion, date_of_birth, batch_year, points FROM academic_profiles WHERE user_id = ?')
      .bind(payload.id)
      .first();

    if (!row) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
    }

    return Response.json(
      {
        success: true,
        profile: {
          id: row.id,
          name: row.name || row.email,
          email: row.email,
          classLabel: academicRow?.class_label || null,
          groupLabel: academicRow?.group_label || null,
          religion: academicRow?.religion || null,
          dateOfBirth: academicRow?.date_of_birth || null,
          batchYear: academicRow?.batch_year || null,
          points: academicRow?.points || 0,
        },
      },
      { headers: apiHeaders }
    );
  }

  if (path === '/api/student/profile' && request.method === 'PUT') {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== 'student') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
    }

    const coreUser = await fetchUserById(env.DB, payload.id);
    if (!coreUser) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
    }

    const body = await request.json().catch(() => ({}));
    const classLabel = body.classLabel ? String(body.classLabel).trim() : null;
    const groupLabel = body.groupLabel ? String(body.groupLabel).trim() : null;
    const religion = body.religion ? String(body.religion).trim() : null;
    const dateOfBirth = body.dateOfBirth ? String(body.dateOfBirth).trim() : null;
    const batchYear = body.batchYear ? String(body.batchYear).trim() : null;

    const existing = await env.DB
      .prepare('SELECT class_label, group_label, religion, date_of_birth, batch_year, points FROM academic_profiles WHERE user_id = ?')
      .bind(payload.id)
      .first();

    const updatedProfile = {
      religion,
      classLabel,
      groupLabel,
      dateOfBirth,
      batchYear,
    };

    const currentPoints = Number(existing?.points || 0);
    await env.DB
      .prepare(
        'INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year, points) VALUES (?, ?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(user_id) DO UPDATE SET class_label = excluded.class_label, group_label = excluded.group_label, religion = excluded.religion, date_of_birth = excluded.date_of_birth, batch_year = excluded.batch_year, points = excluded.points, updated_at = CURRENT_TIMESTAMP'
      )
      .bind(payload.id, classLabel, groupLabel, religion, dateOfBirth, batchYear, currentPoints)
      .run();

    const wasComplete = isCompleteProfile({
      religion: (existing?.religion as string) || null,
      classLabel: (existing?.class_label as string) || null,
      groupLabel: (existing?.group_label as string) || null,
      dateOfBirth: (existing?.date_of_birth as string) || null,
      batchYear: (existing?.batch_year as string) || null,
    });
    const isComplete = isCompleteProfile(updatedProfile);

    let pointsAwarded = 0;
    if (!wasComplete && isComplete) {
      const hasLog = await env.DB.prepare('SELECT id FROM user_points_log WHERE user_id = ? AND reason = ? LIMIT 1')
        .bind(payload.id, 'profile_complete')
        .first();
      if (!hasLog) {
        pointsAwarded = 10;
        const nextPoints = currentPoints + pointsAwarded;
        await env.DB.batch([
          env.DB.prepare('UPDATE academic_profiles SET points = ? WHERE user_id = ?').bind(nextPoints, payload.id),
          env.DB
            .prepare('INSERT INTO user_points_log (user_id, points, reason) VALUES (?, ?, ?)')
            .bind(payload.id, pointsAwarded, 'profile_complete'),
        ]);
      }
    }

    await recordEditHistory(env.DB, payload, 'Student profile updated', {
      classLabel,
      groupLabel,
      religion,
      dateOfBirth,
      batchYear,
    });

    return Response.json({ success: true, pointsAwarded }, { headers: apiHeaders });
  }

  if (path === '/api/points' && request.method === 'GET') {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== 'student') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
    }

    const row = await env.DB.prepare('SELECT points FROM academic_profiles WHERE user_id = ?').bind(payload.id).first();
    if (!row) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
    }
    const logs = await loadPointsLog(env.DB, payload.id);

    return Response.json({ success: true, points: row.points || 0, logs }, { headers: apiHeaders });
  }

  return null;
};
