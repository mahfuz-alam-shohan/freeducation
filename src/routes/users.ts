import type { Env } from "../types";
import {
  apiHeaders,
  buildPasswordHash,
  ensureAdmin,
  getAuthPayload,
  normalizeEmail,
  normalizeLevel,
  normalizeSubject,
  isValidLevel,
  isValidSubject,
  hashPassword
} from "./shared";

export const handleUsers = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  
  // --- 1. GET ALL USERS ---
  if (path === "/api/users" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });

    const admins = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY created_at DESC").all();
    const teachers = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'teacher' ORDER BY created_at DESC").all();
    const students = await env.DB.prepare("SELECT id, name, email, class_label, group_label FROM users WHERE role = 'student' ORDER BY created_at DESC").all();

    const adminPermissions = await env.DB.prepare("SELECT user_id, permissions FROM admin_permissions").all();
    const teacherPermissions = await env.DB.prepare("SELECT user_id, permissions FROM teacher_permissions").all();
    const teacherAssignments = await env.DB.prepare("SELECT user_id, level, subject FROM teacher_assignments").all();

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
        students: (students.results || []).map((row: any) => ({
          id: row.id, name: row.name, email: row.email, 
          classLabel: row.class_label, groupLabel: row.group_label
        }))
      },
      { headers: apiHeaders }
    );
  }

  // --- 2. CREATE USER (Admin, Teacher, Student) ---
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
    // ALLOW 'student' NOW
    if (!["admin", "teacher", "student"].includes(role)) {
      return Response.json({ success: false, error: "Invalid role." }, { status: 400, headers: apiHeaders });
    }

    const { passwordHash } = await buildPasswordHash(password);
    const username = email;
    const classLabel = body.classLabel || null;
    const groupLabel = body.groupLabel || null;

    // Insert with class/group support
    await env.DB.prepare(
      "INSERT INTO users (username, name, email, password_hash, role, class_label, group_label) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(username, name, email, passwordHash, role, classLabel, groupLabel).run();

    const inserted = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (!inserted?.id) {
      return Response.json({ success: false, error: "User creation failed." }, { status: 500, headers: apiHeaders });
    }

    // Role specific setups
    if (role === "teacher") {
      const level = normalizeLevel(String(body.level || ""));
      const subject = normalizeSubject(String(body.subject || ""));
      const rawPermissions = body.permissions || [];
      const permissions = Array.isArray(rawPermissions) ? rawPermissions : [];
      
      await env.DB.batch([
        env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)").bind(inserted.id, level, subject),
        env.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?)").bind(inserted.id, JSON.stringify(permissions)),
      ]);
    }

    if (role === "admin") {
      const rawPermissions = body.permissions || [];
      const permissions = Array.isArray(rawPermissions) ? rawPermissions : [];
      await env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)")
        .bind(inserted.id, JSON.stringify(permissions))
        .run();
    }

    return Response.json({ success: true }, { headers: apiHeaders });
  }

  // --- 3. UPDATE USER (Teacher only for now) ---
  if (path === "/api/users" && request.method === "PUT") {
    // ... [Same as before, skipped for brevity but keep the code if you have it] ...
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    
    const body = (await request.json()) as any;
    const userId = Number(body.id);
    if (!userId) return Response.json({ success: false, error: "User ID is required" }, { status: 400, headers: apiHeaders });
    
    // Support Teacher Updates
    const role = String(body.role || "").trim().toLowerCase();
    if (role === 'teacher') {
       const level = normalizeLevel(String(body.level || ""));
       const subject = normalizeSubject(String(body.subject || ""));
       const permissions = body.permissions || [];
       await env.DB.batch([
         env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET level=excluded.level, subject=excluded.subject").bind(userId, level, subject),
         env.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET permissions=excluded.permissions").bind(userId, JSON.stringify(permissions))
       ]);
    }
    
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  // --- 4. REVEAL & RESET (Keep exactly as I gave you before) ---
  if (path === "/api/users/reveal" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const { adminPassword, targetId } = await request.json() as any;
    const admin = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(payload.id).first();
    const [saltHex, originalHash] = (admin.password_hash as string).split(":");
    if ((await hashPassword(adminPassword, saltHex)) !== originalHash) return Response.json({ success: false, error: "Incorrect Admin Password" }, { status: 401, headers: apiHeaders });
    const target = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(targetId).first();
    return Response.json({ success: true, hash: target?.password_hash }, { headers: apiHeaders });
  }

  if (path === "/api/users/reset" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const { adminPassword, targetId, newPassword } = await request.json() as any;
    const admin = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(payload.id).first();
    const [saltHex, originalHash] = (admin.password_hash as string).split(":");
    if ((await hashPassword(adminPassword, saltHex)) !== originalHash) return Response.json({ success: false, error: "Incorrect Admin Password" }, { status: 401, headers: apiHeaders });
    const { passwordHash } = await buildPasswordHash(newPassword);
    await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, targetId).run();
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  return null;
};
