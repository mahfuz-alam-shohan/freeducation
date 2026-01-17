// User management API routes

import { authenticate, requireAdmin, defaultHeaders, logUserAction } from '../auth/auth.js';

export const userRoutes = {
  // Get user profile
  '/api/profile': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method === 'GET') {
      const profileInfo = await env.DB.prepare(`
        SELECT users.id, users.email, users.password_hash, users.role, user_profiles.username, user_profiles.name
        FROM users
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.id = ?
      `).bind(user.id).first();

      let profile = profileInfo;
      
      if (!profile && user.role === 'admin') {
        const legacyAdmin = await env.DB.prepare("SELECT id, username FROM admins WHERE id = ?").bind(user.id).first();
        const userProfile = await env.DB.prepare("SELECT username, name FROM user_profiles WHERE user_id = ?").bind(user.id).first();
        
        profile = legacyAdmin ? {
          id: legacyAdmin.id,
          username: userProfile?.username || legacyAdmin.username,
          name: userProfile?.name || userProfile?.username || legacyAdmin.username,
          email: null,
          role: "admin"
        } : null;
      }

      if (!profile) {
        return Response.json({ success: false, error: "User not found." }, { status: 404, headers: defaultHeaders });
      }

      const assignment = user.role === 'teacher' 
        ? await env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(user.id).first()
        : null;

      const avatarInfo = await env.DB.prepare("SELECT avatar_key, avatar_content_type, updated_at FROM user_profiles WHERE user_id = ?").bind(user.id).first();

      return Response.json({
        success: true,
        profile: {
          id: profile.id,
          username: profile.username || profile.email,
          name: profile.name || profile.username,
          email: profile.email || null,
          role: profile.role || user.role,
          dashboardView: profile.dashboard_view || null,
          assignment: assignment ? { level: assignment.level, subject: assignment.subject } : null,
          avatarUrl: avatarInfo?.avatar_key ? `/api/avatar/${avatarInfo.avatar_key}?t=${avatarInfo.updated_at}` : null
        }
      }, { headers: defaultHeaders });
    }

    if (request.method === 'PUT') {
      const body = await request.json().catch(() => ({}));
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const dashboardView = typeof body.dashboardView === "string" ? body.dashboardView.trim() : "";
      const validViews = new Set(["card", "list"]);
      const hasName = !!name;
      const hasValidView = validViews.has(dashboardView);

      if (!hasName && !hasValidView) {
        return Response.json({ success: false, error: "Profile update payload is required." }, { status: 400, headers: defaultHeaders });
      }

      if (hasName && hasValidView) {
        const result = await env.DB.prepare(`
          INSERT INTO user_profiles (user_id, name, dashboard_view) 
          VALUES (?, ?, ?) 
          ON CONFLICT(user_id) DO UPDATE SET 
            name = excluded.name, 
            dashboard_view = excluded.dashboard_view, 
            updated_at = CURRENT_TIMESTAMP
        `).bind(user.id, name, dashboardView).run();

        if (result.success) {
          await logUserAction(env.DB, user.id, "Profile updated", { name, dashboardView });
          return Response.json({ success: true }, { headers: defaultHeaders });
        }
        
        return Response.json({ success: false, error: "Profile update failed." }, { status: 500, headers: defaultHeaders });
      }

      if (hasName) {
        const result = await env.DB.prepare(`
          INSERT INTO user_profiles (user_id, name) 
          VALUES (?, ?) 
          ON CONFLICT(user_id) DO UPDATE SET 
            name = excluded.name, 
            updated_at = CURRENT_TIMESTAMP
        `).bind(user.id, name).run();

        if (result.success) {
          await logUserAction(env.DB, user.id, "Profile name updated", { name });
          return Response.json({ success: true }, { headers: defaultHeaders });
        }
        
        return Response.json({ success: false, error: "Profile update failed." }, { status: 500, headers: defaultHeaders });
      }

      if (hasValidView) {
        const result = await env.DB.prepare(`
          INSERT INTO user_profiles (user_id, dashboard_view) 
          VALUES (?, ?) 
          ON CONFLICT(user_id) DO UPDATE SET 
            dashboard_view = excluded.dashboard_view, 
            updated_at = CURRENT_TIMESTAMP
        `).bind(user.id, dashboardView).run();

        if (result.success) {
          await logUserAction(env.DB, user.id, "Dashboard view updated", { dashboardView });
          return Response.json({ success: true }, { headers: defaultHeaders });
        }
        
        return Response.json({ success: false, error: "Profile update failed." }, { status: 500, headers: defaultHeaders });
      }
    }

    return null;
  },

  // Get all users (admin only)
  '/api/users': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!requireAdmin(user)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method === 'GET') {
      const admins = await env.DB.prepare(`
        SELECT users.id, users.email, user_profiles.name
        FROM users
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.role = 'admin'
        ORDER BY user_profiles.created_at DESC
      `).all();

      const teachers = await env.DB.prepare(`
        SELECT users.id, users.email, user_profiles.name
        FROM users
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.role = 'teacher'
        ORDER BY user_profiles.created_at DESC
      `).all();

      const students = await env.DB.prepare(`
        SELECT users.id, users.email, user_profiles.name, academic_profiles.class_label, academic_profiles.group_label
        FROM users
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        LEFT JOIN academic_profiles ON academic_profiles.user_id = users.id
        WHERE users.role = 'student'
        ORDER BY user_profiles.created_at DESC
      `).all();

      const adminPermissions = await env.DB.prepare("SELECT user_id, permissions FROM admin_permissions").all();
      const teacherPermissions = await env.DB.prepare("SELECT user_id, permissions FROM teacher_permissions").all();
      const teacherAssignments = await env.DB.prepare("SELECT user_id, level, subject FROM teacher_assignments").all();

      const adminPermsMap = new Map();
      (adminPermissions.results || []).forEach(item => {
        if (item?.user_id) {
          adminPermsMap.set(item.user_id, item.permissions ? JSON.parse(item.permissions) : []);
        }
      });

      const teacherAssignMap = new Map();
      (teacherAssignments.results || []).forEach(item => {
        if (item?.user_id) {
          teacherAssignMap.set(item.user_id, { level: item.level, subject: item.subject });
        }
      });

      const teacherPermsMap = new Map();
      (teacherPermissions.results || []).forEach(item => {
        if (item?.user_id) {
          teacherPermsMap.set(item.user_id, item.permissions ? JSON.parse(item.permissions) : []);
        }
      });

      return Response.json({
        success: true,
        admins: (admins.results || []).map(admin => ({
          id: admin.id,
          name: admin.name || admin.email,
          email: admin.email,
          permissions: adminPermsMap.get(admin.id) || []
        })),
        teachers: (teachers.results || []).map(teacher => ({
          id: teacher.id,
          name: teacher.name || teacher.email,
          email: teacher.email,
          level: teacherAssignMap.get(teacher.id)?.level || "",
          subject: teacherAssignMap.get(teacher.id)?.subject || "",
          permissions: teacherPermsMap.get(teacher.id) || []
        })),
        students: (students.results || []).map(student => ({
          id: student.id,
          name: student.name || student.email,
          email: student.email,
          classLabel: student.class_label,
          groupLabel: student.group_label
        }))
      }, { headers: defaultHeaders });
    }

    if (request.method === 'POST') {
      const { role, name, email, password, classLabel, groupLabel, level, subject } = await request.json();
      
      if (!name || !email || !password) {
        return Response.json({ success: false, error: "Name, email, and password are required." }, { status: 400, headers: defaultHeaders });
      }

      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user already exists
      const existingUser = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(normalizedEmail).first();
      if (existingUser) {
        return Response.json({ success: false, error: "User with this email already exists." }, { status: 400, headers: defaultHeaders });
      }

      // Import hashPassword function
      const encoder = new TextEncoder();
      const data = encoder.encode(password + "salt");
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const passwordHash = `sha256:${hashHex}`;

      const result = await env.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
        .bind(normalizedEmail, passwordHash, role).run();

      if (result.success) {
        const newUserId = result.meta.last_row_id;
        
        await env.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)")
          .bind(newUserId, normalizedEmail, name).run();

        if (role === 'student' && classLabel) {
          await env.DB.prepare("INSERT INTO academic_profiles (user_id, class_label, group_label) VALUES (?, ?, ?)")
            .bind(newUserId, classLabel, groupLabel || null).run();
        }

        if (role === 'teacher' && level && subject) {
          await env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)")
            .bind(newUserId, level, subject).run();
        }

        await logUserAction(env.DB, user.id, "User created", { role, email: normalizedEmail, name });

        return Response.json({ success: true }, { headers: defaultHeaders });
      }

      return Response.json({ success: false, error: "Failed to create user." }, { status: 500, headers: defaultHeaders });
    }

    return null;
  },

  // Get user details
  '/api/users/details': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!requireAdmin(user)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (request.method === 'GET') {
      if (!userId) {
        return Response.json({ success: false, error: "User ID is required." }, { status: 400, headers: defaultHeaders });
      }

      const userInfo = await env.DB.prepare(`
        SELECT users.id, users.email, users.role, user_profiles.name, user_profiles.username,
              academic_profiles.class_label, academic_profiles.group_label, academic_profiles.religion,
              academic_profiles.date_of_birth, academic_profiles.batch_year, academic_profiles.points
        FROM users
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        LEFT JOIN academic_profiles ON academic_profiles.user_id = users.id
        WHERE users.id = ?
      `).bind(userId).first();

      if (!userInfo) {
        return Response.json({ success: false, error: "User not found." }, { status: 404, headers: defaultHeaders });
      }

      const pointLogs = await env.DB.prepare("SELECT points, reason, created_at FROM user_points_log WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();

      return Response.json({
        success: true,
        user: {
          id: userInfo.id,
          name: userInfo.name || userInfo.email,
          email: userInfo.email,
          role: userInfo.role,
          classLabel: userInfo.class_label,
          groupLabel: userInfo.group_label,
          religion: userInfo.religion,
          dateOfBirth: userInfo.date_of_birth,
          batchYear: userInfo.batch_year,
          points: userInfo.points || 0,
          createdAt: userInfo.created_at,
          pointLogs: (pointLogs.results || []).map(log => ({
            points: log.points,
            reason: log.reason,
            createdAt: log.created_at
          }))
        }
      }, { headers: defaultHeaders });
    }

    if (request.method === 'PUT') {
      const { id, name, email, classLabel, groupLabel, religion, dateOfBirth, batchYear } = await request.json();
      const userId = Number(id);

      if (!userId) {
        return Response.json({ success: false, error: "User ID is required." }, { status: 400, headers: defaultHeaders });
      }

      const targetUser = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
      if (!targetUser) {
        return Response.json({ success: false, error: "User not found." }, { status: 404, headers: defaultHeaders });
      }

      if (targetUser.role !== 'student') {
        return Response.json({ success: false, error: "Only student accounts can be edited here." }, { status: 400, headers: defaultHeaders });
      }

      const trimmedName = name ? String(name).trim() : null;
      const normalizedEmail = email ? email.toLowerCase().trim() : null;
      const trimmedClassLabel = classLabel ? String(classLabel).trim() : null;
      const trimmedGroupLabel = groupLabel ? String(groupLabel).trim() : null;
      const trimmedReligion = religion ? String(religion).trim() : null;
      const trimmedDateOfBirth = dateOfBirth ? String(dateOfBirth).trim() : null;
      const trimmedBatchYear = batchYear ? String(batchYear).trim() : null;
      const finalEmail = normalizedEmail || targetUser.email;

      if (normalizedEmail && normalizedEmail !== targetUser.email) {
        const existingUser = await env.DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?")
          .bind(normalizedEmail, userId).first();
        if (existingUser) {
          return Response.json({ success: false, error: "Email already in use." }, { status: 400, headers: defaultHeaders });
        }
      }

      await env.DB.batch([
        env.DB.prepare("UPDATE users SET email = ? WHERE id = ?").bind(finalEmail, userId),
        env.DB.prepare(`
          INSERT INTO user_profiles (user_id, username, name) 
          VALUES (?, ?, ?) 
          ON CONFLICT(user_id) DO UPDATE SET 
            username = excluded.username, 
            name = excluded.name, 
            updated_at = CURRENT_TIMESTAMP
        `).bind(userId, finalEmail, trimmedName),
        env.DB.prepare(`
          INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year) 
          VALUES (?, ?, ?, ?, ?, ?) 
          ON CONFLICT(user_id) DO UPDATE SET 
            class_label = excluded.class_label,
            group_label = excluded.group_label,
            religion = excluded.religion,
            date_of_birth = excluded.date_of_birth,
            batch_year = excluded.batch_year,
            updated_at = CURRENT_TIMESTAMP
        `).bind(userId, trimmedClassLabel, trimmedGroupLabel, trimmedReligion, trimmedDateOfBirth, trimmedBatchYear)
      ]);

      await logUserAction(env.DB, user.id, "Student updated", { userId, changes: { name, email, classLabel, groupLabel } });

      return Response.json({ success: true }, { headers: defaultHeaders });
    }

    return null;
  },

  // Delete user
  '/api/users/delete': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!requireAdmin(user)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method === 'POST') {
      const { id } = await request.json();
      const userId = Number(id);

      if (!userId) {
        return Response.json({ success: false, error: "User ID is required." }, { status: 400, headers: defaultHeaders });
      }

      const targetUser = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
      if (!targetUser) {
        return Response.json({ success: false, error: "User not found." }, { status: 404, headers: defaultHeaders });
      }

      await env.DB.batch([
        env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId),
        env.DB.prepare("DELETE FROM user_profiles WHERE user_id = ?").bind(userId),
        env.DB.prepare("DELETE FROM academic_profiles WHERE user_id = ?").bind(userId),
        env.DB.prepare("DELETE FROM teacher_assignments WHERE user_id = ?").bind(userId),
        env.DB.prepare("DELETE FROM teacher_permissions WHERE user_id = ?").bind(userId),
        env.DB.prepare("DELETE FROM admin_permissions WHERE user_id = ?").bind(userId)
      ]);

      await logUserAction(env.DB, user.id, "User deleted", { userId, email: targetUser.email });

      return Response.json({ success: true }, { headers: defaultHeaders });
    }

    return null;
  }
};
