import type { Env } from '../../../../shared/types';
import {
  apiHeaders,
  buildPasswordHash,
  ensureAdmin,
  fetchUserById,
  getAuthPayload,
  isValidLevel,
  isValidSubject,
  normalizeEmail,
  normalizeLevel,
  normalizeSubject,
} from '../shared/utils';
import { hashPassword } from '../../../../shared/auth';

export const handleAdminUsers = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/users' && request.method === 'GET') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

    const admins = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY created_at DESC").all();
    const teachers = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'teacher' ORDER BY created_at DESC").all();
    const students = await env.DB
      .prepare("SELECT id, name, email, class_label, group_label FROM users WHERE role = 'student' ORDER BY created_at DESC")
      .all();

    const adminPermissions = await env.DB.prepare('SELECT user_id, permissions FROM admin_permissions').all();
    const teacherPermissions = await env.DB.prepare('SELECT user_id, permissions FROM teacher_permissions').all();
    const teacherAssignments = await env.DB.prepare('SELECT user_id, level, subject FROM teacher_assignments').all();

    const permissionsMap = new Map<number, string[]>();
    (adminPermissions.results || []).forEach((row: any) => {
      if (row?.user_id) permissionsMap.set(row.user_id, row.permissions ? JSON.parse(row.permissions as string) : []);
    });

    const assignmentMap = new Map<number, { level: string; subject: string }>();
    (teacherAssignments.results || []).forEach((row: any) => {
      if (row?.user_id) assignmentMap.set(row.user_id, { level: row.level as string, subject: row.subject as string });
    });

    const teacherPermissionsMap = new Map<number, string[]>();
    (teacherPermissions.results || []).forEach((row: any) => {
      if (row?.user_id) teacherPermissionsMap.set(row.user_id, row.permissions ? JSON.parse(row.permissions as string) : []);
    });

    return Response.json(
      {
        success: true,
        admins: (admins.results || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          permissions: permissionsMap.get(row.id) || [],
        })),
        teachers: (teachers.results || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          level: assignmentMap.get(row.id)?.level || '',
          subject: assignmentMap.get(row.id)?.subject || '',
          permissions: teacherPermissionsMap.get(row.id) || [],
        })),
        students: (students.results || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          classLabel: row.class_label,
          groupLabel: row.group_label,
        })),
      },
      { headers: apiHeaders }
    );
  }

  if (path === '/api/users' && request.method === 'POST') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

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

    await env.DB
      .prepare('INSERT INTO users (username, name, email, password_hash, role, class_label, group_label) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(username, name, email, passwordHash, role, classLabel, groupLabel)
      .run();

    const inserted = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (!inserted?.id) {
      return Response.json({ success: false, error: 'User creation failed.' }, { status: 500, headers: apiHeaders });
    }

    if (role === 'teacher') {
      const level = normalizeLevel(String(body.level || ''));
      const subject = normalizeSubject(String(body.subject || ''));

      if (!isValidLevel(level) || !isValidSubject(subject)) {
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(inserted.id).run();
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
  }

  if (path === '/api/users' && request.method === 'PUT') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

    const body = (await request.json()) as any;
    const userId = Number(body.id);
    if (!userId) return Response.json({ success: false, error: 'User ID is required' }, { status: 400, headers: apiHeaders });

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
  }

  if (path === '/api/users/reveal' && request.method === 'POST') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

    const { adminPassword, targetId } = (await request.json()) as any;

    const admin = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(payload.id).first();
    if (!admin) return Response.json({ success: false, error: 'Admin not found' }, { status: 401, headers: apiHeaders });

    const [saltHex, originalHash] = (admin.password_hash as string).split(':');
    const hashCheck = await hashPassword(adminPassword, saltHex);
    if (hashCheck !== originalHash) {
      return Response.json({ success: false, error: 'Incorrect Admin Password' }, { status: 401, headers: apiHeaders });
    }

    const target = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(targetId).first();
    if (!target) return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });

    return Response.json({ success: true, hash: target.password_hash }, { headers: apiHeaders });
  }

  if (path === '/api/users/reset' && request.method === 'POST') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

    const { adminPassword, targetId, newPassword } = (await request.json()) as any;

    const admin = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(payload.id).first();
    if (!admin) return Response.json({ success: false, error: 'Admin not found' }, { status: 401, headers: apiHeaders });

    const [saltHex, originalHash] = (admin.password_hash as string).split(':');
    const hashCheck = await hashPassword(adminPassword, saltHex);
    if (hashCheck !== originalHash) {
      return Response.json({ success: false, error: 'Incorrect Admin Password' }, { status: 401, headers: apiHeaders });
    }

    if (newPassword.length < 8) return Response.json({ success: false, error: 'New password too short' }, { status: 400, headers: apiHeaders });

    const { passwordHash } = await buildPasswordHash(newPassword);
    await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(passwordHash, targetId).run();

    return Response.json({ success: true }, { headers: apiHeaders });
  }

  if (path === '/api/users/details' && request.method === 'GET') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

    const url = new URL(request.url);
    const userId = Number(url.searchParams.get('id'));
    if (!userId) {
      return Response.json({ success: false, error: 'User ID is required' }, { status: 400, headers: apiHeaders });
    }

    const userRow = await env.DB
      .prepare('SELECT id, name, email, role, class_label, group_label, religion, date_of_birth, batch_year, points, created_at FROM users WHERE id = ?')
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
          name: userRow.name,
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
  }

  if (path === '/api/users/details' && request.method === 'PUT') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

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

    await env.DB
      .prepare(
        'UPDATE users SET name = ?, email = ?, username = ?, class_label = ?, group_label = ?, religion = ?, date_of_birth = ?, batch_year = ? WHERE id = ?'
      )
      .bind(name, nextEmail, nextEmail, classLabel, groupLabel, religion, dateOfBirth, batchYear, userId)
      .run();

    return Response.json({ success: true }, { headers: apiHeaders });
  }

  if (path === '/api/users/delete' && request.method === 'POST') {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });

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
  }

  return null;
};
