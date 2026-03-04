import { readBody, normalizeEmail } from "../../shared/http/request.js";
import { HttpError, mapDatabaseError } from "../../shared/http/errors.js";
import { findUserByEmail } from "../../infrastructure/db/usersRepository.js";
import { verifyPassword } from "../../shared/security/password.js";
import { createSession } from "../../infrastructure/db/sessionsRepository.js";
import { createToken, sessionCookie, tokenHash } from "../../shared/security/session.js";
import { dashboardPathForRole } from "../../shared/auth/roles.js";
import { getActiveExamAttemptForUser } from "../modules/examService.js";

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

  return [device, browser, os].filter(Boolean).join(" - ");
}

export async function loginUser(request, env) {
  const body = await readBody(request);
  const email = normalizeEmail(body.email);
  const user = await findUserByEmail(env.DB, email);
  if (!user) throw new HttpError(401, "Invalid login credentials");

  const validPassword = await verifyPassword(String(body.password || ""), user.password_salt, user.password_hash);
  if (!validPassword) throw new HttpError(401, "Invalid login credentials");

  const token = createToken();
  const tokenDigest = await tokenHash(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  const activeExam = await getActiveExamAttemptForUser(env, user.id);
  const activeAttemptId = Number(activeExam?.attempt?.id || 0);
  try {
    await createSession(env.DB, {
      userId: user.id,
      tokenHash: tokenDigest,
      expiresAt,
      deviceLabel: describeDeviceFromUserAgent(request),
      activeAttemptId,
    });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create session");
  }

  return {
    ok: true,
    status: 200,
    redirectTo: dashboardPathForRole(user.user_type),
    headers: { "set-cookie": sessionCookie(token, expiresAt) },
  };
}

