import { readBody, normalizeEmail } from "../core/request.js";
import { validateAdminPayload } from "../core/validation.js";
import { HttpError, mapDatabaseError } from "../core/errors.js";
import { createAdmin, findAdminByEmail } from "../db/admins.js";
import { hashPassword, verifyPassword } from "../security/password.js";
import { createSession } from "../db/admins.js";
import { createToken, sessionCookie, tokenHash } from "../security/session.js";
import { dashboardPathForRole } from "../core/roles.js";

function describeDeviceFromUserAgent(request) {
  const raw = String(request.headers.get("user-agent") || "").toLowerCase();
  if (!raw) return "Unknown device";

  const device = /mobile|iphone|android/.test(raw) ? "Mobile" : /ipad|tablet/.test(raw) ? "Tablet" : "Desktop";
  let browser = "Browser";
  if (raw.includes("edg/")) browser = "Edge";
  else if (raw.includes("chrome/")) browser = "Chrome";
  else if (raw.includes("safari/") && !raw.includes("chrome/")) browser = "Safari";
  else if (raw.includes("firefox/")) browser = "Firefox";

  let os = "";
  if (raw.includes("windows")) os = "Windows";
  else if (raw.includes("mac os")) os = "macOS";
  else if (raw.includes("android")) os = "Android";
  else if (raw.includes("iphone") || raw.includes("ios")) os = "iOS";
  else if (raw.includes("linux")) os = "Linux";

  return [device, browser, os].filter(Boolean).join(" • ");
}


export async function setupFirstAdmin(request, env, hasAdmin) {
  if (hasAdmin) throw new HttpError(403, "Initial setup already completed");

  const body = await readBody(request);
  const validationError = validateAdminPayload(body);
  if (validationError) throw new HttpError(400, validationError);

  if (await findAdminByEmail(env.DB, normalizeEmail(body.email))) {
    throw new HttpError(409, "Email already in use");
  }

  let hash;
  let salt;
  try {
    const passwordData = await hashPassword(String(body.password || ""));
    hash = passwordData.hash;
    salt = passwordData.salt;
  } catch (error) {
    throw new HttpError(500, "Unable to secure password", {
      code: "PASSWORD_HASH_FAILED",
      detail: String(error?.message || error),
    });
  }

  try {
    await createAdmin(env.DB, { name: body.name, email: normalizeEmail(body.email), hash, salt });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create administrator");
  }

  return { ok: true, status: 201 };
}

export async function loginAdmin(request, env, hasAdmin) {
  if (!hasAdmin) throw new HttpError(403, "Initial setup required");

  const body = await readBody(request);
  const email = normalizeEmail(body.email);
  const admin = await findAdminByEmail(env.DB, email);
  if (!admin) throw new HttpError(401, "Invalid login credentials");

  const validPassword = await verifyPassword(String(body.password || ""), admin.password_salt, admin.password_hash);
  if (!validPassword) throw new HttpError(401, "Invalid login credentials");

  const token = createToken();
  const tokenDigest = await tokenHash(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  try {
    await createSession(env.DB, { adminId: admin.id, tokenHash: tokenDigest, expiresAt, deviceLabel: describeDeviceFromUserAgent(request) });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create session");
  }

  return {
    ok: true,
    status: 200,
    redirectTo: dashboardPathForRole(admin.user_type),
    headers: { "set-cookie": sessionCookie(token, expiresAt) },
  };
}
