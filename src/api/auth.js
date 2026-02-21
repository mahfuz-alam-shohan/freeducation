import { SESSION_COOKIE } from '../env.js';
import { parseCookies } from '../http/request.js';
import { verifySignedToken } from '../security/session.js';
import { deleteSession, findSessionWithUser } from '../db/adminRepo.js';

export async function requireAuth(request, env) {
  const cookies = parseCookies(request);
  const raw = cookies[SESSION_COOKIE];
  const verified = await verifySignedToken(env.AUTH_SECRET, raw);
  if (!verified) return null;

  const record = await findSessionWithUser(env.DB, verified.sessionId);
  if (!record || record.expires_at < Date.now()) {
    if (record) await deleteSession(env.DB, verified.sessionId);
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    imageKey: record.image_key,
    coverImageKey: record.cover_image_key,
    dateOfBirth: record.date_of_birth,
    sessionId: verified.sessionId,
  };
}
