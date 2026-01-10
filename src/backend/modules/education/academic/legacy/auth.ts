import { createToken, hashPassword } from "../../../../../shared/auth";
import type { Env } from "../../../../../shared/types";
import {
  apiHeaders,
  buildPasswordHash,
  getAuthPayload,
  normalizeEmail,
  requireJwtSecret,
} from "./shared";

export const handleAuth = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === "/api/setup-status") {
    const result = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
    const legacy = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
    const hasAdmin = (result?.count as number) > 0 || (legacy?.count as number) > 0;
    return Response.json({ hasAdmin }, { headers: apiHeaders });
  }

  if (path === "/api/register-admin" && request.method === "POST") {
    const { username, password } = (await request.json()) as any;
    const count = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
    const legacyCount = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
    if ((count?.count as number) > 0 || (legacyCount?.count as number) > 0) {
      return Response.json({ success: false, error: "User already exists" }, { status: 403, headers: apiHeaders });
    }

    const cleanedUsername = String(username || "").trim();
    const cleanedPassword = String(password || "");
    if (cleanedUsername.length < 3) {
      return Response.json({ success: false, error: "Username must be at least 3 characters." }, { status: 400, headers: apiHeaders });
    }
    if (cleanedPassword.length < 8) {
      return Response.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400, headers: apiHeaders });
    }

    const { passwordHash } = await buildPasswordHash(cleanedPassword);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)")
        .bind(cleanedUsername, cleanedUsername, null, passwordHash, "admin"),
      env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES ((SELECT id FROM users WHERE username = ?), ?)")
        .bind(cleanedUsername, JSON.stringify(["dashboard", "classes", "settings", "thumbnails", "userManagement"])),
      env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(cleanedUsername, passwordHash),
    ]);
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  if (path === "/api/login" && request.method === "POST") {
    const { username, password } = (await request.json()) as any;
    const cleanedUsername = String(username || "").trim();
    const cleanedPassword = String(password || "");
    if (!cleanedUsername || !cleanedPassword) {
      return Response.json({ success: false, error: "Username and password are required." }, { status: 400, headers: apiHeaders });
    }
    const normalizedEmail = normalizeEmail(cleanedUsername);
    let user = await env.DB.prepare("SELECT * FROM users WHERE username = ? OR email = ?").bind(cleanedUsername, normalizedEmail).first();
    let role = user?.role as string | undefined;
    let permissions: string[] = [];
    let assignment: { level: string; subject: string } | null = null;

    if (user) {
      const [saltHex, originalHash] = (user.password_hash as string).split(":");
      const hash = await hashPassword(cleanedPassword, saltHex);
      if (hash !== originalHash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });

      if (role === "admin") {
        const row = await env.DB.prepare("SELECT permissions FROM admin_permissions WHERE user_id = ?").bind(user.id).first();
        permissions = row?.permissions ? JSON.parse(row.permissions as string) : [];
      }
      if (role === "teacher") {
        const row = await env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(user.id).first();
        assignment = row ? { level: row.level as string, subject: row.subject as string } : null;
        const permissionsRow = await env.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?")
          .bind(user.id)
          .first();
        permissions = permissionsRow?.permissions ? JSON.parse(permissionsRow.permissions as string) : [];
      }
    } else {
      const legacy = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(cleanedUsername).first();
      if (!legacy) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });
      user = legacy;
      role = "admin";
      const [saltHex, originalHash] = (legacy.password_hash as string).split(":");
      const hash = await hashPassword(cleanedPassword, saltHex);
      if (hash !== originalHash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });
      permissions = ["dashboard", "classes", "settings", "thumbnails", "userManagement"];
    }

    const secret = requireJwtSecret(env);
    const token = await createToken(
      {
        username: user.username || user.email || user.name,
        id: user.id,
        role,
        permissions,
        assignment,
      },
      secret
    );
    return Response.json(
      {
        success: true,
        username: user.username || user.email || user.name,
        role,
        permissions,
        assignment,
        token,
      },
      { headers: apiHeaders }
    );
  }

  if (path === "/api/me" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    return Response.json(
      {
        user: payload
          ? {
              username: payload.username,
              role: payload.role,
              permissions: payload.permissions || [],
              assignment: payload.assignment || null,
            }
          : null,
      },
      { headers: apiHeaders }
    );
  }

  if (path === "/api/change-password" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const body = await request.json().catch(() => ({}));
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json({ success: false, error: "All password fields are required." }, { status: 400, headers: apiHeaders });
    }
    if (newPassword.length < 8) {
      return Response.json({ success: false, error: "New password must be at least 8 characters." }, { status: 400, headers: apiHeaders });
    }
    if (newPassword !== confirmPassword) {
      return Response.json({ success: false, error: "New passwords do not match." }, { status: 400, headers: apiHeaders });
    }

    const userRow = await env.DB.prepare("SELECT id, username, password_hash FROM users WHERE id = ?").bind(payload.id).first();
    let passwordHashSource = userRow?.password_hash as string | undefined;
    let adminRow: { id: number; username: string; password_hash: string } | null = null;

    if (!passwordHashSource && payload.role === "admin") {
      const legacyRow = await env.DB.prepare("SELECT id, username, password_hash FROM admins WHERE id = ?").bind(payload.id).first();
      if (legacyRow?.password_hash) {
        adminRow = legacyRow as any;
        passwordHashSource = legacyRow.password_hash as string;
      }
    }

    if (!passwordHashSource) {
      return Response.json({ success: false, error: "User not found." }, { status: 404, headers: apiHeaders });
    }

    const [saltHex, originalHash] = passwordHashSource.split(":");
    const currentHash = await hashPassword(currentPassword, saltHex);
    if (currentHash !== originalHash) {
      return Response.json({ success: false, error: "Current password is incorrect." }, { status: 401, headers: apiHeaders });
    }

    const { passwordHash: nextPasswordHash } = await buildPasswordHash(newPassword);

    const updates = [];
    if (userRow?.id) {
      updates.push(env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(nextPasswordHash, userRow.id));
      updates.push(env.DB.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").bind(nextPasswordHash, userRow.username));
    }
    if (adminRow?.id) {
      updates.push(env.DB.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").bind(nextPasswordHash, adminRow.id));
    }

    if (updates.length) {
      await env.DB.batch(updates);
    }

    return Response.json({ success: true }, { headers: apiHeaders });
  }

  return null;
};
