import type { Env } from "../types";
import {
  apiHeaders,
  buildPasswordHash,
  ensureAdmin,
  getAuthPayload,
  isValidLevel,
  isValidSubject,
  normalizeEmail,
  normalizeLevel,
  normalizeSubject,
  hashPassword // <--- Added this import
} from "./shared";

export const handleUsers = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  
  // --- 1. GET ALL USERS (Admins, Teachers, Students) ---
  if (path === "/api/users" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });

    // Fetch lists
    const admins = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY created_at DESC").all();
    const teachers = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'teacher' ORDER BY created_at DESC").all();
    // NEW: Fetch Students
    const students = await env.DB.prepare("SELECT id, name, email, class_label, group_label FROM users WHERE role = 'student' ORDER BY created_at DESC").all();

    // Fetch Permissions & Assignments
    const adminPermissions = await env.DB.prepare("SELECT user_id, permissions FROM admin_permissions").all();
    const teacherPermissions = await env.DB.prepare("SELECT user_id, permissions FROM teacher_permissions").all();
    const teacherAssignments = await env.DB.prepare("SELECT user_id, level, subject FROM teacher_assignments").all();

    // Map helpers
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
          id: row.id, name: row.name, email: row.email, permissions: permissionsMap.get(row.id) || [],
        })),
        teachers: (teachers.results || []).map((row: any) => ({
          id: row.id, name: row.name, email: row.email,
          level: assignmentMap.get(row.id)?.level || "",
          subject: assignmentMap.get(row.id)?.subject || "",
          permissions: teacherPermissionsMap.get(row.id) || [],
        })),
        // NEW: Return students list
        students: (students.results || []).map((row: any) => ({
          id: row.id, name: row.name, email: row.email, 
          classLabel: row.class_label, groupLabel: row.group_label
        }))
      },
      { headers: apiHeaders }
    );
  }

  // --- 2. CREATE USER (Admin or Teacher) ---
  if (path === "/api/users" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    
    const body = (await request.json()) as any;
    const role = String(body.role || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");
    
    if (!name || !email || !password) {
      return Response.json({ success: false, error: "Name, email, and password are required." }, { status: 400, headers: apiHeaders });
    }
    if (password.length < 8) {
      return Response.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400, headers: apiHeaders });
    }
    if (!["admin", "teacher"].includes(role)) {
      return Response.json({ success: false, error: "Invalid role." }, { status: 400, headers: apiHeaders });
    }

    const { passwordHash } = await buildPasswordHash(password);
    // For admins/teachers, username is email
    const username = email;

    await env.DB.prepare(
      "INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
    ).bind(username, name, email, passwordHash, role).run();

    const inserted = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (!inserted?.id) {
      return Response.json({ success: false, error: "User creation failed." }, { status: 500, headers: apiHeaders });
    }

    if (role === "teacher") {
      const level = normalizeLevel(String(body.level || ""));
      const subject = normalizeSubject(String(body.subject || ""));
      if (!level || !subject) {
        return Response.json({ success: false, error: "Teacher level and subject are required." }, { status: 400, headers: apiHeaders });
      }
      if (!isValidLevel(level) || !isValidSubject(subject)) {
        return Response.json({ success: false, error: "Invalid teacher level or subject." }, { status: 400, headers: apiHeaders });
      }
      const rawPermissions = body.permissions || [];
      const permissions = Array.isArray(rawPermissions)
        ? rawPermissions.map((entry: any) => String(entry))
        : Object.entries(rawPermissions)
            .filter(([, enabled]) => Boolean(enabled))
            .map(([key]) => key);
            
      await env.DB.batch([
        env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)").bind(
          inserted.id, level, subject
        ),
        env.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?)").bind(
          inserted.id, JSON.stringify(permissions)
        ),
      ]);
    }

    if (role === "admin") {
      const rawPermissions = body.permissions || [];
      const permissions = Array.isArray(rawPermissions)
        ? rawPermissions.map((entry: any) => String(entry))
        : Object.entries(rawPermissions)
            .filter(([, enabled]) => Boolean(enabled))
            .map(([key]) => key);
      await env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)")
        .bind(inserted.id, JSON.stringify(permissions))
        .run();
    }

    return Response.json({ success: true }, { headers: apiHeaders });
  }

  // --- 3. UPDATE USER (Teacher only) ---
  if (path === "/api/users" && request.method === "PUT") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    
    const body = (await request.json()) as any;
    const userId = Number(body.id);
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required." }, { status: 400, headers: apiHeaders });
    }
    const role = String(body.role || "").trim().toLowerCase();
    if (role !== "teacher") {
      return Response.json({ success: false, error: "Only teacher updates are supported." }, { status: 400, headers: apiHeaders });
    }
    const level = normalizeLevel(String(body.level || ""));
    const subject = normalizeSubject(String(body.subject || ""));
    if (!level || !subject) {
      return Response.json({ success: false, error: "Teacher level and subject are required." }, { status: 400, headers: apiHeaders });
    }
    if (!isValidLevel(level) || !isValidSubject(subject)) {
      return Response.json({ success: false, error: "Invalid teacher level or subject." }, { status: 400, headers: apiHeaders });
    }
    const rawPermissions = body.permissions || [];
    const permissions = Array.isArray(rawPermissions)
      ? rawPermissions.map((entry: any) => String(entry))
      : Object.entries(rawPermissions)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([key]) => key);
          
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) " +
        "ON CONFLICT(user_id) DO UPDATE SET level = excluded.level, subject = excluded.subject"
      ).bind(userId, level, subject),
      env.DB.prepare(
        "INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) " +
        "ON CONFLICT(user_id) DO UPDATE SET permissions = excluded.permissions"
      ).bind(userId, JSON.stringify(permissions)),
    ]);
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  // --- 4. NEW: REVEAL PASSWORD HASH ---
  if (path === "/api/users/reveal" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    
    const { adminPassword, targetId } = await request.json() as any;

    // Verify Admin Password
    const admin = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(payload.id).first();
    if (!admin) return Response.json({ success: false, error: "Admin not found" }, { status: 401, headers: apiHeaders });

    const [saltHex, originalHash] = (admin.password_hash as string).split(":");
    const hashCheck = await hashPassword(adminPassword, saltHex);
    if (hashCheck !== originalHash) {
        return Response.json({ success: false, error: "Incorrect Admin Password" }, { status: 401, headers: apiHeaders });
    }

    // Get Target Hash
    const target = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(targetId).first();
    if (!target) return Response.json({ success: false, error: "User not found" }, { status: 404, headers: apiHeaders });

    return Response.json({ success: true, hash: target.password_hash }, { headers: apiHeaders });
  }

  // --- 5. NEW: RESET PASSWORD ---
  if (path === "/api/users/reset" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    
    const { adminPassword, targetId, newPassword } = await request.json() as any;

    // Verify Admin Password
    const admin = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(payload.id).first();
    if (!admin) return Response.json({ success: false, error: "Admin not found" }, { status: 401, headers: apiHeaders });

    const [saltHex, originalHash] = (admin.password_hash as string).split(":");
    const hashCheck = await hashPassword(adminPassword, saltHex);
    if (hashCheck !== originalHash) {
        return Response.json({ success: false, error: "Incorrect Admin Password" }, { status: 401, headers: apiHeaders });
    }

    if (newPassword.length < 8) return Response.json({ success: false, error: "New password too short" }, { status: 400, headers: apiHeaders });

    // Update Password
    const { passwordHash } = await buildPasswordHash(newPassword);
    await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, targetId).run();

    return Response.json({ success: true }, { headers: apiHeaders });
  }

  return null;
};
