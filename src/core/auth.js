import { findSession, deleteSession } from "../db/admins.js";
import { parseCookie, tokenHash, clearSessionCookie } from "../security/session.js";

export async function getAuthenticatedAdmin(request, env) {
  const token = parseCookie(request);
  if (!token) return null;

  const session = await findSession(env.DB, await tokenHash(token));
  if (!session) return null;

  if (session.expires_at <= new Date().toISOString()) {
    await deleteSession(env.DB, await tokenHash(token));
    return null;
  }

  return {
    id: session.id,
    name: session.name,
    email: session.email,
    user_type: session.user_type || "Administrator",
    date_of_birth: session.date_of_birth || "",
    gender: session.gender || "",
    avatar_key: session.avatar_key || "",
    cover_key: session.cover_key || "",
    session_device_label: session.device_label || "",
    session_created_at: session.session_created_at || "",
  };
}

export async function destroySession(request, env) {
  const token = parseCookie(request);
  if (token) {
    await deleteSession(env.DB, await tokenHash(token));
  }
  return { ok: true, headers: { "set-cookie": clearSessionCookie() } };
}
