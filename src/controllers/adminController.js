import { readBody, normalizeEmail } from "../core/request.js";
import { validateAdminPayload } from "../core/validation.js";
import { HttpError, mapDatabaseError } from "../core/errors.js";
import { createAdmin, findAdminByEmail, listAdmins } from "../db/admins.js";
import { hashPassword } from "../security/password.js";

export async function overview(env) {
  const users = await listAdmins(env.DB);
  const sessions = await env.DB.prepare("SELECT COUNT(*) total FROM freeducation_sessions").first();
  return {
    totalAdmins: users.length,
    activeSessions: Number(sessions?.total || 0),
  };
}

export async function listAdminUsers(env) {
  return listAdmins(env.DB);
}

export async function createAdminUser(request, env) {
  const body = await readBody(request);
  const validationError = validateAdminPayload(body);
  if (validationError) throw new HttpError(400, validationError);

  if (await findAdminByEmail(env.DB, normalizeEmail(body.email))) {
    throw new HttpError(409, "Email already in use");
  }

  const { hash, salt } = await hashPassword(body.password);
  try {
    await createAdmin(env.DB, { name: body.name, email: body.email, hash, salt });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create administrator");
  }
  return { ok: true };
}
