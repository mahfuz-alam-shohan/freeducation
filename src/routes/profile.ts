import type { Env } from "../types";
import { apiHeaders, getAuthPayload, recordEditHistory } from "./shared";

const getAvatarUrl = (updatedAt: string | null | undefined) =>
  `/api/profile/avatar?v=${updatedAt ? new Date(updatedAt).getTime() : Date.now()}`;

export const handleProfile = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (!path.startsWith("/api/profile")) return null;

  if (path === "/api/profile" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });

    const userRow = await env.DB.prepare("SELECT id, username, name, email, role FROM users WHERE id = ?")
      .bind(payload.id)
      .first();
    let profileUser = userRow as any;

    if (!profileUser && payload.role === "admin") {
      const legacyRow = await env.DB.prepare("SELECT id, username FROM admins WHERE id = ?").bind(payload.id).first();
      profileUser = legacyRow
        ? {
            id: legacyRow.id,
            username: legacyRow.username,
            name: legacyRow.username,
            email: null,
            role: "admin",
          }
        : null;
    }

    if (!profileUser) {
      return Response.json({ success: false, error: "User not found." }, { status: 404, headers: apiHeaders });
    }

    const assignmentRow =
      payload.role === "teacher"
        ? await env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?")
            .bind(payload.id)
            .first()
        : null;
    const avatarRow = await env.DB.prepare(
      "SELECT avatar_key, avatar_content_type, updated_at FROM user_profiles WHERE user_id = ?"
    )
      .bind(payload.id)
      .first();

    return Response.json(
      {
        success: true,
        profile: {
          id: profileUser.id,
          username: profileUser.username || profileUser.email,
          name: profileUser.name || profileUser.username,
          email: profileUser.email || null,
          role: profileUser.role || payload.role,
          assignment: assignmentRow
            ? {
                level: assignmentRow.level,
                subject: assignmentRow.subject,
              }
            : null,
          avatarUrl: avatarRow?.avatar_key ? getAvatarUrl(avatarRow.updated_at as string) : null,
        },
      },
      { headers: apiHeaders }
    );
  }

  if (path === "/api/profile" && request.method === "PUT") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    if (!name) {
      return Response.json({ success: false, error: "Name is required." }, { status: 400, headers: apiHeaders });
    }

    const updated = await env.DB.prepare("UPDATE users SET name = ? WHERE id = ?").bind(name, payload.id).run();
    if (!updated.success) {
      return Response.json({ success: false, error: "Profile update failed." }, { status: 500, headers: apiHeaders });
    }

    await recordEditHistory(env.DB, payload, "Profile updated", { name });
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  if (path === "/api/profile/avatar" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });

    const avatarRow = await env.DB.prepare("SELECT avatar_key, avatar_content_type FROM user_profiles WHERE user_id = ?")
      .bind(payload.id)
      .first();
    if (!avatarRow?.avatar_key) {
      return Response.json({ success: false, error: "Avatar not found." }, { status: 404, headers: apiHeaders });
    }
    const object = await env.BUCKET.get(avatarRow.avatar_key as string);
    if (!object) {
      return Response.json({ success: false, error: "Avatar file missing." }, { status: 404, headers: apiHeaders });
    }
    const headers = new Headers(apiHeaders);
    headers.set("Content-Type", (avatarRow.avatar_content_type as string) || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=3600");
    return new Response(object.body, { headers });
  }

  if (path === "/api/profile/avatar" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return Response.json({ success: false, error: "Avatar file is required." }, { status: 400, headers: apiHeaders });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileKey = `avatars/${payload.id}-${crypto.randomUUID()}-${file.name}`;
    const contentType = file.type || "application/octet-stream";
    await env.BUCKET.put(fileKey, arrayBuffer, {
      httpMetadata: {
        contentType,
      },
    });

    const existing = await env.DB.prepare("SELECT avatar_key FROM user_profiles WHERE user_id = ?")
      .bind(payload.id)
      .first();

    await env.DB.prepare(
      "INSERT INTO user_profiles (user_id, avatar_key, avatar_content_type, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP) " +
        "ON CONFLICT(user_id) DO UPDATE SET avatar_key = excluded.avatar_key, avatar_content_type = excluded.avatar_content_type, updated_at = CURRENT_TIMESTAMP"
    )
      .bind(payload.id, fileKey, contentType)
      .run();

    if (existing?.avatar_key) {
      await env.BUCKET.delete(existing.avatar_key as string);
    }

    await recordEditHistory(env.DB, payload, "Avatar updated", { fileKey });

    return Response.json(
      {
        success: true,
        avatarUrl: getAvatarUrl(new Date().toISOString()),
      },
      { headers: apiHeaders }
    );
  }

  if (path === "/api/profile/history" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });

    const rows = await env.DB.prepare(
      "SELECT action, details, created_at FROM edit_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
    )
      .bind(payload.id)
      .all();
    const entries = (rows.results || []).map((row: any) => ({
      action: row.action,
      details: row.details,
      createdAt: row.created_at,
    }));

    return Response.json({ success: true, entries }, { headers: apiHeaders });
  }

  return null;
};
