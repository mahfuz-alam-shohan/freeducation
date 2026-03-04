import { json } from "../../shared/http/response.js";
import { destroyAuthenticatedSession, getAuthenticatedUser } from "../../shared/auth/sessionAuth.js";
import { dashboardPathForRole, USER_TYPES } from "../../shared/auth/roles.js";
import { handleAdminWorkspaceRoute } from "./workspace/adminWorkspaceRoutes.js";
import { htmlRedirect } from "./workspace/common.js";
import { detectPortal, isPortalApiPath } from "./workspace/portalConfig.js";
import { handlePortalUserRoute } from "./workspace/portalUserRoutes.js";
import { getActiveExamAttemptForUser } from "../../features/modules/examService.js";
import { clearActiveAttemptForUserSessions } from "../../infrastructure/db/sessionsRepository.js";

export async function handleWorkspaceRoute(request, env, url) {
  if (request.method === "POST" && url.pathname === "/api/logout") {
    const result = await destroyAuthenticatedSession(request, env);
    return json({ ok: true }, 200, result.headers || {});
  }

  if (url.pathname === "/admin/login" || url.pathname === "/login") return undefined;

  const portal = detectPortal(url.pathname);
  if (!portal) return undefined;

  const user = await getAuthenticatedUser(request, env);
  if (!user) {
    if (isPortalApiPath(portal, url.pathname)) return json({ error: "Unauthorized" }, 401);
    return null;
  }

  if (request.method === "GET" && !isPortalApiPath(portal, url.pathname)) {
    const hintedAttemptId = Number(user.session_active_attempt_id || 0);
    if (hintedAttemptId > 0) {
      const active = await getActiveExamAttemptForUser(env, user.id);
      const activeAttemptId = Number(active?.attempt?.id || 0);
      if (activeAttemptId > 0) {
        return htmlRedirect(`/exam/${activeAttemptId}`);
      }
      await clearActiveAttemptForUserSessions(env.DB, { userId: user.id });
    }
  }

  if (user.user_type !== portal.role) {
    if (isPortalApiPath(portal, url.pathname)) return json({ error: "Forbidden" }, 403);
    if (url.pathname.startsWith(portal.portalPrefix)) return htmlRedirect(dashboardPathForRole(user.user_type));
    return undefined;
  }

  const portalUserResponse = await handlePortalUserRoute({ request, env, url, portal, user });
  if (portalUserResponse !== undefined) return portalUserResponse;

  if (portal.role !== USER_TYPES.ADMINISTRATOR) return undefined;
  return handleAdminWorkspaceRoute({ request, env, url, user });
}
