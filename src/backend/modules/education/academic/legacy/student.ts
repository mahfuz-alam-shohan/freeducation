import type { Env } from "../../../../../shared/types";
import { apiHeaders, getAuthPayload, recordEditHistory } from "./shared";

const isCompleteProfile = (profile: {
  religion?: string | null;
  classLabel?: string | null;
  groupLabel?: string | null;
  dateOfBirth?: string | null;
  batchYear?: string | null;
}) => {
  const classLabel = profile.classLabel ? String(profile.classLabel).trim() : "";
  const religion = profile.religion ? String(profile.religion).trim() : "";
  const dateOfBirth = profile.dateOfBirth ? String(profile.dateOfBirth).trim() : "";
  const batchYear = profile.batchYear ? String(profile.batchYear).trim() : "";
  const groupLabel = profile.groupLabel ? String(profile.groupLabel).trim() : "";
  const requiresGroup = classLabel === "SSC" || classLabel === "HSC";
  const requiresBatch = classLabel === "SSC" || classLabel === "HSC";
  if (!religion || !classLabel || !dateOfBirth) return false;
  if (requiresGroup && !groupLabel) return false;
  if (requiresBatch && !batchYear) return false;
  return true;
};

const loadPointsLog = async (db: D1Database, userId: number) => {
  const rows = await db
    .prepare("SELECT points, reason, created_at FROM user_points_log WHERE user_id = ? ORDER BY created_at DESC")
    .bind(userId)
    .all();
  return (rows.results || []).map((row: any) => ({
    points: row.points,
    reason: row.reason,
    createdAt: row.created_at,
  }));
};

export const handleStudent = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === "/api/student/profile" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== "student") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }

    const row = await env.DB.prepare(
      "SELECT id, name, email, class_label, group_label, religion, date_of_birth, batch_year, points FROM users WHERE id = ?"
    )
      .bind(payload.id)
      .first();

    if (!row) {
      return Response.json({ success: false, error: "User not found" }, { status: 404, headers: apiHeaders });
    }

    return Response.json(
      {
        success: true,
        profile: {
          id: row.id,
          name: row.name,
          email: row.email,
          classLabel: row.class_label,
          groupLabel: row.group_label,
          religion: row.religion,
          dateOfBirth: row.date_of_birth,
          batchYear: row.batch_year,
          points: row.points || 0,
        },
      },
      { headers: apiHeaders }
    );
  }

  if (path === "/api/student/profile" && request.method === "PUT") {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== "student") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }

    const body = await request.json().catch(() => ({}));
    const classLabel = body.classLabel ? String(body.classLabel).trim() : null;
    const groupLabel = body.groupLabel ? String(body.groupLabel).trim() : null;
    const religion = body.religion ? String(body.religion).trim() : null;
    const dateOfBirth = body.dateOfBirth ? String(body.dateOfBirth).trim() : null;
    const batchYear = body.batchYear ? String(body.batchYear).trim() : null;

    const existing = await env.DB.prepare(
      "SELECT class_label, group_label, religion, date_of_birth, batch_year, points FROM users WHERE id = ?"
    )
      .bind(payload.id)
      .first();

    if (!existing) {
      return Response.json({ success: false, error: "User not found" }, { status: 404, headers: apiHeaders });
    }

    const updatedProfile = {
      religion,
      classLabel,
      groupLabel,
      dateOfBirth,
      batchYear,
    };

    await env.DB.prepare(
      "UPDATE users SET class_label = ?, group_label = ?, religion = ?, date_of_birth = ?, batch_year = ? WHERE id = ?"
    )
      .bind(classLabel, groupLabel, religion, dateOfBirth, batchYear, payload.id)
      .run();

    const wasComplete = isCompleteProfile({
      religion: existing.religion as string | null,
      classLabel: existing.class_label as string | null,
      groupLabel: existing.group_label as string | null,
      dateOfBirth: existing.date_of_birth as string | null,
      batchYear: existing.batch_year as string | null,
    });
    const isComplete = isCompleteProfile(updatedProfile);

    let pointsAwarded = 0;
    if (!wasComplete && isComplete) {
      const hasLog = await env.DB.prepare(
        "SELECT id FROM user_points_log WHERE user_id = ? AND reason = ? LIMIT 1"
      )
        .bind(payload.id, "profile_complete")
        .first();
      if (!hasLog) {
        pointsAwarded = 10;
        const nextPoints = Number(existing.points || 0) + pointsAwarded;
        await env.DB.batch([
          env.DB.prepare("UPDATE users SET points = ? WHERE id = ?").bind(nextPoints, payload.id),
          env.DB.prepare("INSERT INTO user_points_log (user_id, points, reason) VALUES (?, ?, ?)")
            .bind(payload.id, pointsAwarded, "profile_complete"),
        ]);
      }
    }

    await recordEditHistory(env.DB, payload, "Student profile updated", {
      classLabel,
      groupLabel,
      religion,
      dateOfBirth,
      batchYear,
    });

    return Response.json(
      { success: true, pointsAwarded },
      { headers: apiHeaders }
    );
  }

  if (path === "/api/points" && request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!payload || payload.role !== "student") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }

    const row = await env.DB.prepare("SELECT points FROM users WHERE id = ?").bind(payload.id).first();
    if (!row) {
      return Response.json({ success: false, error: "User not found" }, { status: 404, headers: apiHeaders });
    }
    const logs = await loadPointsLog(env.DB, payload.id);

    return Response.json(
      { success: true, points: row.points || 0, logs },
      { headers: apiHeaders }
    );
  }

  return null;
};
