// Authentication API routes

import { authenticate, hashPassword, verifyPassword, generateToken, normalizeEmail, defaultHeaders, logUserAction } from '../auth/auth.js';

export const authRoutes = {
  // Register first admin
  '/api/register-admin': async (request, env, ctx) => {
    if (request.method !== 'POST') return null;
    
    const { username, password } = await request.json();
    const existingAdmins = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
    const existingAdminsLegacy = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
    
    if (existingAdmins?.count > 0 || existingAdminsLegacy?.count > 0) {
      return Response.json({ success: false, error: "User already exists" }, { status: 403, headers: defaultHeaders });
    }
    
    const trimmedUsername = String(username || "").trim();
    const trimmedPassword = String(password || "");
    
    if (trimmedUsername.length < 3) {
      return Response.json({ success: false, error: "Username must be at least 3 characters." }, { status: 400, headers: defaultHeaders });
    }
    
    if (trimmedPassword.length < 8) {
      return Response.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400, headers: defaultHeaders });
    }
    
    const { passwordHash } = await hashPassword(trimmedPassword);
    
    await env.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
      .bind(null, passwordHash, "admin").run();
    
    const newAdmin = await env.DB.prepare("SELECT id FROM users WHERE role = 'admin' ORDER BY id DESC LIMIT 1").first();
    
    if (newAdmin?.id) {
      await env.DB.batch([
        env.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)")
          .bind(newAdmin.id, trimmedUsername, trimmedUsername),
        env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)")
          .bind(newAdmin.id, JSON.stringify(["dashboard", "classes", "settings", "thumbnails", "userManagement"])),
        env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
          .bind(trimmedUsername, passwordHash)
      ]);
      
      return Response.json({ success: true }, { headers: defaultHeaders });
    }
    
    return Response.json({ success: false, error: "Admin creation failed." }, { status: 500, headers: defaultHeaders });
  },

  // Login
  '/api/login': async (request, env, ctx) => {
    if (request.method !== 'POST') return null;
    
    const { username, password } = await request.json();
    const trimmedUsername = String(username || "").trim();
    const trimmedPassword = String(password || "");
    
    if (!trimmedUsername || !trimmedPassword) {
      return Response.json({ success: false, error: "Username and password are required." }, { status: 400, headers: defaultHeaders });
    }
    
    const normalizedEmail = normalizeEmail(trimmedUsername);
    let user = await env.DB.prepare(`
      SELECT users.id, users.email, users.password_hash, users.role, user_profiles.username, user_profiles.name
      FROM users
      LEFT JOIN user_profiles ON user_profiles.user_id = users.id
      WHERE users.email = ? OR user_profiles.username = ?
    `).bind(normalizedEmail, trimmedUsername).first();
    
    let role = user?.role;
    let permissions = [];
    let assignment = null;
    let classLabel = null;
    let groupLabel = null;
    
    if (user) {
      if (!await verifyPassword(trimmedPassword, user.password_hash)) {
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: defaultHeaders });
      }
      
      if (role === 'admin') {
        const permResult = await env.DB.prepare("SELECT permissions FROM admin_permissions WHERE user_id = ?").bind(user.id).first();
        permissions = permResult?.permissions ? JSON.parse(permResult.permissions) : [];
      } else if (role === 'teacher') {
        const assignResult = await env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(user.id).first();
        assignment = assignResult ? { level: assignResult.level, subject: assignResult.subject } : null;
        
        const permResult = await env.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?").bind(user.id).first();
        permissions = permResult?.permissions ? JSON.parse(permResult.permissions) : [];
      } else if (role === 'student') {
        const academicResult = await env.DB.prepare("SELECT class_label, group_label FROM academic_profiles WHERE user_id = ?").bind(user.id).first();
        classLabel = academicResult?.class_label || null;
        groupLabel = academicResult?.group_label || null;
      }
    } else {
      // Check legacy admins table
      const legacyAdmin = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(trimmedUsername).first();
      if (!legacyAdmin) {
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: defaultHeaders });
      }
      
      user = legacyAdmin;
      role = 'admin';
      
      if (!await verifyPassword(trimmedPassword, legacyAdmin.password_hash)) {
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: defaultHeaders });
      }
      
      permissions = ["dashboard", "classes", "settings", "thumbnails", "userManagement"];
    }
    
    const token = await generateToken({
      username: user.username || user.email || user.name,
      id: user.id,
      role,
      permissions,
      assignment,
      classLabel,
      groupLabel
    }, env);
    
    return Response.json({
      success: true,
      username: user.username || user.email || user.name,
      role,
      permissions,
      assignment,
      classLabel,
      groupLabel,
      token
    }, { headers: defaultHeaders });
  },

  // Get current user info
  '/api/me': async (request, env, ctx) => {
    if (request.method !== 'GET') return null;
    
    const user = await authenticate(request, env);
    const roleInfo = user ? await env.DB.prepare(`
      SELECT users.role, user_profiles.username
      FROM users
      LEFT JOIN user_profiles ON user_profiles.user_id = users.id
      WHERE users.id = ?
    `).bind(user.id).first() : null;
    
    const academicInfo = user ? await env.DB.prepare("SELECT class_label, group_label FROM academic_profiles WHERE user_id = ?").bind(user.id).first() : null;
    
    return Response.json({
      user: user ? {
        username: roleInfo?.username || user.username,
        role: roleInfo?.role || user.role,
        permissions: user.permissions || [],
        assignment: user.assignment || null,
        classLabel: academicInfo?.class_label || user.classLabel || null,
        groupLabel: academicInfo?.group_label || user.groupLabel || null
      } : null
    }, { headers: defaultHeaders });
  },

  // Change password
  '/api/change-password': async (request, env, ctx) => {
    if (request.method !== 'POST') return null;
    
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }
    
    const { currentPassword, newPassword, confirmPassword } = await request.json().catch(() => ({}));
    const current = String(currentPassword || "");
    const newPass = String(newPassword || "");
    const confirm = String(confirmPassword || "");
    
    if (!current || !newPass || !confirm) {
      return Response.json({ success: false, error: "All password fields are required." }, { status: 400, headers: defaultHeaders });
    }
    
    if (newPass.length < 8) {
      return Response.json({ success: false, error: "New password must be at least 8 characters." }, { status: 400, headers: defaultHeaders });
    }
    
    if (newPass !== confirm) {
      return Response.json({ success: false, error: "New passwords do not match." }, { status: 400, headers: defaultHeaders });
    }
    
    const userInfo = await env.DB.prepare(`
      SELECT users.id, users.password_hash, user_profiles.username
      FROM users
      LEFT JOIN user_profiles ON user_profiles.user_id = users.id
      WHERE users.id = ?
    `).bind(user.id).first();
    
    let passwordHash = userInfo?.password_hash;
    let legacyAdmin = null;
    
    if (!passwordHash && user.role === 'admin') {
      legacyAdmin = await env.DB.prepare("SELECT id, username, password_hash FROM admins WHERE id = ?").bind(user.id).first();
      if (legacyAdmin?.password_hash) {
        legacyAdmin = legacyAdmin;
        passwordHash = legacyAdmin.password_hash;
      }
    }
    
    if (!passwordHash) {
      return Response.json({ success: false, error: "User not found." }, { status: 404, headers: defaultHeaders });
    }
    
    const [algorithm, storedHash] = passwordHash.split(':');
    if (await verifyPassword(current, passwordHash) !== true) {
      return Response.json({ success: false, error: "Current password is incorrect." }, { status: 401, headers: defaultHeaders });
    }
    
    const { passwordHash: newHash } = await hashPassword(newPass);
    const updates = [];
    
    if (userInfo?.id) {
      updates.push(env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(newHash, userInfo.id));
      if (userInfo.username) {
        updates.push(env.DB.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").bind(newHash, userInfo.username));
      }
    }
    
    if (legacyAdmin?.id) {
      updates.push(env.DB.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").bind(newHash, legacyAdmin.id));
    }
    
    if (updates.length) {
      await env.DB.batch(updates);
    }
    
    return Response.json({ success: true }, { headers: defaultHeaders });
  }
};
