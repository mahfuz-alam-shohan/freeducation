import { html, json } from "../../../shared/http/response.js";
import { USER_TYPES } from "../../../shared/auth/roles.js";
import { dashboardPage } from "../../../presentation/pages/dashboard/index.js";
import { profilePage } from "../../../presentation/pages/profile/index.js";
import { renderSimpleRoleDashboard, renderTeacherDashboard } from "../../../presentation/pages/shared/dashboardRenderer.js";
import { changeUserPassword, getUserImage, getUserProfile, updateUserProfile, uploadUserImage } from "../../../features/user/accountService.js";
import { matchApiPath } from "./portalConfig.js";

export async function handlePortalUserRoute({ request, env, url, portal, user }) {
  if (request.method === "GET" && url.pathname === `${portal.portalPrefix}/dashboard`) {
    if (portal.role === USER_TYPES.ADMINISTRATOR) {
      return html(dashboardPage(user, { apiBase: portal.defaultApiBase }));
    }

    if (portal.role === USER_TYPES.TEACHER) {
      return html(renderTeacherDashboard({
        homePath: portal.homePath,
        navItems: portal.navItems,
        user,
        currentDeviceLabel: user.session_device_label || "",
        loginAt: user.session_created_at || "",
        apiBase: portal.defaultApiBase,
      }));
    }

    return html(renderSimpleRoleDashboard({
      roleName: "Student",
      homePath: portal.homePath,
      navItems: portal.navItems,
      user,
      currentDeviceLabel: user.session_device_label || "",
      loginAt: user.session_created_at || "",
      apiBase: portal.defaultApiBase,
    }));
  }

  if (request.method === "GET" && url.pathname === `${portal.portalPrefix}/profile`) {
    const fromSocial = String(url.searchParams.get("from") || "").toLowerCase() === "social";
    return html(profilePage(user, {
      navItems: portal.navItems,
      homePath: portal.homePath,
      apiBase: portal.defaultApiBase,
      showBackToFeed: fromSocial,
      backToFeedHref: "/social",
    }));
  }

  if (request.method === "GET" && matchApiPath(url.pathname, portal, "/profile")) {
    return json({ profile: await getUserProfile(env, user.id) });
  }

  if (request.method === "GET" && (matchApiPath(url.pathname, portal, "/profile/image/avatar") || matchApiPath(url.pathname, portal, "/profile/image/cover"))) {
    const type = url.pathname.endsWith("/avatar") ? "avatar" : "cover";
    return getUserImage(env, user.id, type);
  }

  if (request.method === "POST" && matchApiPath(url.pathname, portal, "/profile/image")) {
    return json(await uploadUserImage(request, env, user.id, { apiBase: portal.defaultApiBase }));
  }

  if (request.method === "POST" && matchApiPath(url.pathname, portal, "/change-password")) {
    return json(await changeUserPassword(request, env, user.id));
  }

  if (request.method === "PATCH" && matchApiPath(url.pathname, portal, "/profile")) {
    return json(await updateUserProfile(request, env, user.id));
  }

  return undefined;
}
