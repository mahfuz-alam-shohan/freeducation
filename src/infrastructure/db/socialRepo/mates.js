function normalizeUserId(value) {
  const id = Number.parseInt(String(value || 0), 10);
  return Number.isInteger(id) && id > 0 ? id : 0;
}

function normalizeLimit(value, fallback = 80, min = 1, max = 200) {
  const parsed = Number.parseInt(String(value || fallback), 10);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function pairForUsers(a, b) {
  const first = normalizeUserId(a);
  const second = normalizeUserId(b);
  if (!first || !second || first === second) return null;
  return first < second
    ? { lowId: first, highId: second }
    : { lowId: second, highId: first };
}

async function findMateRowByPair(db, userA, userB) {
  const pair = pairForUsers(userA, userB);
  if (!pair) return null;
  return db.prepare(
    `SELECT id, user_low_id, user_high_id, requester_id, receiver_id, status, follow_low, follow_high, created_at, responded_at, updated_at
     FROM freeducation_social_mates
     WHERE user_low_id = ?1 AND user_high_id = ?2`,
  ).bind(pair.lowId, pair.highId).first();
}

function normalizeMateStatus(row, viewerId) {
  if (!row) return { status: "none", requestId: 0 };
  const relationId = Number.parseInt(String(row.id || 0), 10) || 0;
  const status = String(row.status || "").trim().toLowerCase();
  if (status === "accepted") {
    const safeViewerId = normalizeUserId(viewerId);
    const lowId = normalizeUserId(row.user_low_id);
    const highId = normalizeUserId(row.user_high_id);
    const isLow = safeViewerId > 0 && safeViewerId === lowId;
    const isHigh = safeViewerId > 0 && safeViewerId === highId;
    const followingByViewer = isLow
      ? Number(row.follow_low || 0) !== 0
      : isHigh
        ? Number(row.follow_high || 0) !== 0
        : false;
    return {
      status: "mates",
      requestId: relationId,
      relationId,
      followingByViewer,
    };
  }
  if (status !== "pending") return { status: "none", requestId: 0 };

  const requesterId = Number.parseInt(String(row.requester_id || 0), 10) || 0;
  const receiverId = Number.parseInt(String(row.receiver_id || 0), 10) || 0;
  if (viewerId > 0 && requesterId === viewerId) return { status: "pending_outgoing", requestId: relationId, relationId };
  if (viewerId > 0 && receiverId === viewerId) return { status: "pending_incoming", requestId: relationId, relationId };
  return { status: "pending", requestId: relationId, relationId };
}

export async function getSocialMateStatus(db, { viewerId, targetUserId }) {
  const safeViewerId = normalizeUserId(viewerId);
  const safeTargetId = normalizeUserId(targetUserId);
  if (!safeViewerId || !safeTargetId || safeViewerId === safeTargetId) {
    return { status: safeViewerId && safeViewerId === safeTargetId ? "self" : "none", requestId: 0 };
  }
  const row = await findMateRowByPair(db, safeViewerId, safeTargetId);
  return normalizeMateStatus(row, safeViewerId);
}

export async function createSocialMateRequest(db, { requesterId, receiverId }) {
  const safeRequesterId = normalizeUserId(requesterId);
  const safeReceiverId = normalizeUserId(receiverId);
  const pair = pairForUsers(safeRequesterId, safeReceiverId);
  if (!pair) return { ok: false, status: "none", requestId: 0 };

  const now = new Date().toISOString();
  const existing = await findMateRowByPair(db, safeRequesterId, safeReceiverId);

  if (!existing) {
    const result = await db.prepare(
      `INSERT INTO freeducation_social_mates
       (user_low_id, user_high_id, requester_id, receiver_id, status, follow_low, follow_high, created_at, responded_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, 'pending', 1, 1, ?5, '', ?5)`,
    ).bind(pair.lowId, pair.highId, safeRequesterId, safeReceiverId, now).run();
    return {
      ok: true,
      status: "pending_outgoing",
      requestId: Number(result.meta?.last_row_id || 0),
      relationId: Number(result.meta?.last_row_id || 0),
      followingByViewer: true,
    };
  }

  const existingStatus = String(existing.status || "").trim().toLowerCase();
  if (existingStatus === "accepted") {
    const normalized = normalizeMateStatus(existing, safeRequesterId);
    return {
      ok: true,
      status: normalized.status,
      requestId: normalized.requestId,
      relationId: normalized.relationId || Number(existing.id || 0),
      followingByViewer: normalized.followingByViewer !== false,
    };
  }
  if (existingStatus === "pending") {
    const normalized = normalizeMateStatus(existing, safeRequesterId);
    return {
      ok: true,
      status: normalized.status,
      requestId: normalized.requestId,
      relationId: normalized.relationId || Number(existing.id || 0),
      followingByViewer: true,
    };
  }

  await db.prepare(
    `UPDATE freeducation_social_mates
     SET requester_id = ?1,
         receiver_id = ?2,
         status = 'pending',
         follow_low = 1,
         follow_high = 1,
         created_at = ?3,
         responded_at = '',
         updated_at = ?3
     WHERE id = ?4`,
  ).bind(safeRequesterId, safeReceiverId, now, existing.id).run();

  return {
    ok: true,
    status: "pending_outgoing",
    requestId: Number(existing.id || 0),
    relationId: Number(existing.id || 0),
    followingByViewer: true,
  };
}

export async function respondToSocialMateRequest(db, { requestId, receiverId, action }) {
  const safeRequestId = Number.parseInt(String(requestId || 0), 10);
  const safeReceiverId = normalizeUserId(receiverId);
  const safeAction = String(action || "").trim().toLowerCase();
  if (!Number.isInteger(safeRequestId) || safeRequestId <= 0 || !safeReceiverId) return { ok: false };
  if (!["accept", "decline"].includes(safeAction)) return { ok: false };

  const row = await db.prepare(
    `SELECT id, requester_id, receiver_id, user_low_id, user_high_id, status, follow_low, follow_high
     FROM freeducation_social_mates
     WHERE id = ?1`,
  ).bind(safeRequestId).first();
  if (!row) return { ok: false, missing: true };

  const receiver = normalizeUserId(row.receiver_id);
  if (receiver !== safeReceiverId) return { ok: false, forbidden: true };

  const status = String(row.status || "").trim().toLowerCase();
  if (status !== "pending") {
    const followingByViewer = safeReceiverId === normalizeUserId(row.user_low_id)
      ? Number(row.follow_low || 0) !== 0
      : safeReceiverId === normalizeUserId(row.user_high_id)
        ? Number(row.follow_high || 0) !== 0
        : false;
    return {
      ok: true,
      status: status === "accepted" ? "mates" : "none",
      requestId: safeRequestId,
      relationId: safeRequestId,
      requesterId: normalizeUserId(row.requester_id),
      receiverId: receiver,
      followingByViewer,
    };
  }

  const nextStatus = safeAction === "accept" ? "accepted" : "declined";
  const now = new Date().toISOString();
  await db.prepare(
    `UPDATE freeducation_social_mates
     SET status = ?1,
         follow_low = CASE WHEN ?1 = 'accepted' THEN 1 ELSE follow_low END,
         follow_high = CASE WHEN ?1 = 'accepted' THEN 1 ELSE follow_high END,
         responded_at = ?2,
         updated_at = ?2
     WHERE id = ?3`,
  ).bind(nextStatus, now, safeRequestId).run();

  return {
    ok: true,
    status: nextStatus === "accepted" ? "mates" : "none",
    requestId: safeRequestId,
    relationId: safeRequestId,
    requesterId: normalizeUserId(row.requester_id),
    receiverId: receiver,
    followingByViewer: nextStatus === "accepted",
    respondedAt: now,
  };
}

export async function listSocialMates(db, { userId, limit = 120 }) {
  const safeUserId = normalizeUserId(userId);
  if (!safeUserId) return [];
  const safeLimit = normalizeLimit(limit, 120, 1, 300);

  const rows = await db.prepare(
    `SELECT m.id AS relation_id,
            m.user_low_id,
            m.user_high_id,
            m.updated_at,
            m.responded_at,
            m.follow_low,
            m.follow_high,
            a.id AS mate_id,
            a.name AS mate_name,
            a.email AS mate_email,
            a.user_type AS mate_role,
            a.avatar_key AS mate_avatar_key
     FROM freeducation_social_mates m
     JOIN freeducation_admins a
       ON (a.id = m.user_low_id OR a.id = m.user_high_id)
      AND a.id <> ?1
     WHERE (m.user_low_id = ?1 OR m.user_high_id = ?1)
       AND m.status = 'accepted'
     ORDER BY datetime(COALESCE(NULLIF(m.responded_at, ''), m.updated_at)) DESC, m.id DESC
     LIMIT ?2`,
  ).bind(safeUserId, safeLimit).all();

  return (rows.results || []).map((row) => {
    const mateId = normalizeUserId(row.mate_id);
    return {
      relationId: Number.parseInt(String(row.relation_id || 0), 10) || 0,
      mateId,
      name: String(row.mate_name || "User"),
      email: String(row.mate_email || ""),
      role: String(row.mate_role || ""),
      avatarUrl: row.mate_avatar_key ? `/api/social/avatar/${mateId}` : "",
      profileUrl: `/profile/${mateId}?from=social`,
      connectedAt: String(row.responded_at || row.updated_at || ""),
      followingByViewer: safeUserId === Number(row.user_low_id || 0)
        ? Number(row.follow_low || 0) !== 0
        : Number(row.follow_high || 0) !== 0,
    };
  }).filter((entry) => entry.mateId > 0);
}

export async function listSocialMateRequests(db, { userId, limit = 120 }) {
  const safeUserId = normalizeUserId(userId);
  if (!safeUserId) {
    return { incoming: [], outgoing: [] };
  }
  const safeLimit = normalizeLimit(limit, 120, 1, 250);

  const incomingRows = await db.prepare(
    `SELECT m.id AS request_id,
            m.requester_id,
            m.created_at,
            m.updated_at,
            a.name AS requester_name,
            a.email AS requester_email,
            a.user_type AS requester_role,
            a.avatar_key AS requester_avatar_key
     FROM freeducation_social_mates m
     JOIN freeducation_admins a ON a.id = m.requester_id
     WHERE m.receiver_id = ?1
       AND m.status = 'pending'
     ORDER BY datetime(m.updated_at) DESC, m.id DESC
     LIMIT ?2`,
  ).bind(safeUserId, safeLimit).all();

  const outgoingRows = await db.prepare(
    `SELECT m.id AS request_id,
            m.receiver_id,
            m.created_at,
            m.updated_at,
            a.name AS receiver_name,
            a.email AS receiver_email,
            a.user_type AS receiver_role,
            a.avatar_key AS receiver_avatar_key
     FROM freeducation_social_mates m
     JOIN freeducation_admins a ON a.id = m.receiver_id
     WHERE m.requester_id = ?1
       AND m.status = 'pending'
     ORDER BY datetime(m.updated_at) DESC, m.id DESC
     LIMIT ?2`,
  ).bind(safeUserId, safeLimit).all();

  const incoming = (incomingRows.results || []).map((row) => {
    const requesterId = normalizeUserId(row.requester_id);
    return {
      requestId: Number.parseInt(String(row.request_id || 0), 10) || 0,
      userId: requesterId,
      name: String(row.requester_name || "User"),
      email: String(row.requester_email || ""),
      role: String(row.requester_role || ""),
      avatarUrl: row.requester_avatar_key ? `/api/social/avatar/${requesterId}` : "",
      profileUrl: `/profile/${requesterId}?from=social`,
      createdAt: String(row.created_at || row.updated_at || ""),
      updatedAt: String(row.updated_at || row.created_at || ""),
    };
  }).filter((entry) => entry.requestId > 0 && entry.userId > 0);

  const outgoing = (outgoingRows.results || []).map((row) => {
    const receiverId = normalizeUserId(row.receiver_id);
    return {
      requestId: Number.parseInt(String(row.request_id || 0), 10) || 0,
      userId: receiverId,
      name: String(row.receiver_name || "User"),
      email: String(row.receiver_email || ""),
      role: String(row.receiver_role || ""),
      avatarUrl: row.receiver_avatar_key ? `/api/social/avatar/${receiverId}` : "",
      profileUrl: `/profile/${receiverId}?from=social`,
      createdAt: String(row.created_at || row.updated_at || ""),
      updatedAt: String(row.updated_at || row.created_at || ""),
    };
  }).filter((entry) => entry.requestId > 0 && entry.userId > 0);

  return { incoming, outgoing };
}

export async function cancelSocialMateRequest(db, { requestId, requesterId }) {
  const safeRequestId = Number.parseInt(String(requestId || 0), 10);
  const safeRequesterId = normalizeUserId(requesterId);
  if (!Number.isInteger(safeRequestId) || safeRequestId <= 0 || !safeRequesterId) return { ok: false };

  const row = await db.prepare(
    `SELECT id, requester_id, status
     FROM freeducation_social_mates
     WHERE id = ?1`,
  ).bind(safeRequestId).first();
  if (!row) return { ok: false, missing: true };
  if (normalizeUserId(row.requester_id) !== safeRequesterId) return { ok: false, forbidden: true };

  const status = String(row.status || "").trim().toLowerCase();
  if (status !== "pending") {
    return {
      ok: true,
      status: status === "accepted" ? "mates" : "none",
      requestId: safeRequestId,
      relationId: safeRequestId,
    };
  }

  const now = new Date().toISOString();
  await db.prepare(
    `UPDATE freeducation_social_mates
     SET status = 'cancelled',
         responded_at = ?1,
         updated_at = ?1
     WHERE id = ?2`,
  ).bind(now, safeRequestId).run();

  return {
    ok: true,
    status: "none",
    requestId: safeRequestId,
    relationId: safeRequestId,
    respondedAt: now,
  };
}

export async function removeSocialMate(db, { relationId, userId }) {
  const safeRelationId = Number.parseInt(String(relationId || 0), 10);
  const safeUserId = normalizeUserId(userId);
  if (!Number.isInteger(safeRelationId) || safeRelationId <= 0 || !safeUserId) return { ok: false };

  const row = await db.prepare(
    `SELECT id, user_low_id, user_high_id, status
     FROM freeducation_social_mates
     WHERE id = ?1`,
  ).bind(safeRelationId).first();
  if (!row) return { ok: false, missing: true };
  const isMember = safeUserId === normalizeUserId(row.user_low_id) || safeUserId === normalizeUserId(row.user_high_id);
  if (!isMember) return { ok: false, forbidden: true };

  const status = String(row.status || "").trim().toLowerCase();
  if (status !== "accepted") {
    return { ok: true, status: "none", relationId: safeRelationId };
  }

  const now = new Date().toISOString();
  await db.prepare(
    `UPDATE freeducation_social_mates
     SET status = 'removed',
         responded_at = ?1,
         updated_at = ?1
     WHERE id = ?2`,
  ).bind(now, safeRelationId).run();

  return {
    ok: true,
    status: "none",
    relationId: safeRelationId,
    respondedAt: now,
  };
}

export async function setSocialMateFollowState(db, { relationId, userId, follow }) {
  const safeRelationId = Number.parseInt(String(relationId || 0), 10);
  const safeUserId = normalizeUserId(userId);
  if (!Number.isInteger(safeRelationId) || safeRelationId <= 0 || !safeUserId) return { ok: false };
  const nextFollow = Boolean(follow);

  const row = await db.prepare(
    `SELECT id, user_low_id, user_high_id, status, follow_low, follow_high
     FROM freeducation_social_mates
     WHERE id = ?1`,
  ).bind(safeRelationId).first();
  if (!row) return { ok: false, missing: true };
  const lowId = normalizeUserId(row.user_low_id);
  const highId = normalizeUserId(row.user_high_id);
  const isLow = safeUserId === lowId;
  const isHigh = safeUserId === highId;
  if (!isLow && !isHigh) return { ok: false, forbidden: true };

  const status = String(row.status || "").trim().toLowerCase();
  if (status !== "accepted") {
    return { ok: true, status: "none", relationId: safeRelationId, followingByViewer: false };
  }

  const now = new Date().toISOString();
  if (isLow) {
    await db.prepare(
      `UPDATE freeducation_social_mates
       SET follow_low = ?1,
           updated_at = ?2
       WHERE id = ?3`,
    ).bind(nextFollow ? 1 : 0, now, safeRelationId).run();
  } else {
    await db.prepare(
      `UPDATE freeducation_social_mates
       SET follow_high = ?1,
           updated_at = ?2
       WHERE id = ?3`,
    ).bind(nextFollow ? 1 : 0, now, safeRelationId).run();
  }

  return {
    ok: true,
    status: "mates",
    relationId: safeRelationId,
    followingByViewer: nextFollow,
    updatedAt: now,
  };
}
