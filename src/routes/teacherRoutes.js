import { html, json } from "../core/response.js";
import { getAuthenticatedAdmin } from "../core/auth.js";
import { dashboardPathForRole, USER_TYPES } from "../core/roles.js";
import { TEACHER_NAV_SECTIONS } from "../ui/config/navigation.js";
import { profilePage } from "../ui/pages/profile/index.js";
import { renderTeacherDashboard } from "../ui/pages/shared/dashboardRenderer.js";
import { getAdminImage, getAdminProfile, updateAdminProfile, uploadAdminImage, changeAdminPassword } from "../controllers/adminController.js";

export async function handleTeacherRoute(request, env, url) {
  const user = await getAuthenticatedAdmin(request, env);
  if (!user) {
    if (url.pathname.startsWith("/api/teacher")) {
      return json({ error: "Unauthorized" }, 401);
    }
    return null;
  }

  if (user.user_type !== USER_TYPES.TEACHER) {
    if (url.pathname.startsWith("/teacher")) return htmlRedirect(dashboardPathForRole(user.user_type));
    if (url.pathname.startsWith("/api/teacher")) return json({ error: "Forbidden" }, 403);
    return undefined;
  }

  if (request.method === "GET" && url.pathname === "/teacher/dashboard") {
    return html(renderTeacherDashboard({
      homePath: "/teacher/dashboard",
      navItems: TEACHER_NAV_SECTIONS,
      admin: user,
      currentDeviceLabel: user.session_device_label || "",
      loginAt: user.session_created_at || "",
    }));
  }

  if (request.method === "GET" && url.pathname === "/teacher/profile") {
    return html(profilePage(user, { navItems: TEACHER_NAV_SECTIONS, homePath: "/teacher/dashboard", apiBase: "/api/teacher" }));
  }

  if (request.method === "GET" && url.pathname === "/api/teacher/profile") {
    return json({ profile: await getAdminProfile(env, user.id) });
  }

  if (request.method === "GET" && (url.pathname === "/api/teacher/profile/image/avatar" || url.pathname === "/api/teacher/profile/image/cover")) {
    const type = url.pathname.endsWith("/avatar") ? "avatar" : "cover";
    return getAdminImage(env, user.id, type);
  }

  if (request.method === "POST" && url.pathname === "/api/teacher/profile/image") {
    return json(await uploadAdminImage(request, env, user.id));
  }

  if (request.method === "POST" && url.pathname === "/api/teacher/change-password") {
    return json(await changeAdminPassword(request, env, user.id));
  }

  if (request.method === "PATCH" && url.pathname === "/api/teacher/profile") {
    return json(await updateAdminProfile(request, env, user.id));
  }

  return undefined;
}

function htmlRedirect(location) {
  return new Response(null, { status: 302, headers: { location } });
}
