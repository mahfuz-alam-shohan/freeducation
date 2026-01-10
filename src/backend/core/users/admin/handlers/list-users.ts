import type { Env } from '../../../../../shared/types';
import { apiHeaders, ensureAdmin, getAuthPayload } from '../../shared/utils';

export const handleListUsers = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const admins = await env.DB
    .prepare(
      `SELECT users.id, users.email, user_profiles.name
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       WHERE users.role = 'admin'
       ORDER BY user_profiles.created_at DESC`
    )
    .all();
  const teachers = await env.DB
    .prepare(
      `SELECT users.id, users.email, user_profiles.name
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       WHERE users.role = 'teacher'
       ORDER BY user_profiles.created_at DESC`
    )
    .all();
  const students = await env.DB
    .prepare(
      `SELECT users.id, users.email, user_profiles.name, academic_profiles.class_label, academic_profiles.group_label
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       LEFT JOIN academic_profiles ON academic_profiles.user_id = users.id
       WHERE users.role = 'student'
       ORDER BY user_profiles.created_at DESC`
    )
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
        name: row.name || row.email,
        email: row.email,
        permissions: permissionsMap.get(row.id) || [],
      })),
      teachers: (teachers.results || []).map((row: any) => ({
        id: row.id,
        name: row.name || row.email,
        email: row.email,
        level: assignmentMap.get(row.id)?.level || '',
        subject: assignmentMap.get(row.id)?.subject || '',
        permissions: teacherPermissionsMap.get(row.id) || [],
      })),
      students: (students.results || []).map((row: any) => ({
        id: row.id,
        name: row.name || row.email,
        email: row.email,
        classLabel: row.class_label,
        groupLabel: row.group_label,
      })),
    },
    { headers: apiHeaders }
  );
};
