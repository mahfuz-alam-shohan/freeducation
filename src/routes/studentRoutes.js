import { html, json } from "../core/response.js";
import { getAuthenticatedAdmin } from "../core/auth.js";
import { dashboardPathForRole, USER_TYPES } from "../core/roles.js";
import { STUDENT_NAV_ITEMS } from "../ui/config/navigation.js";
import { profilePage } from "../ui/pages/profile/index.js";
import { renderSimpleRoleDashboard } from "../ui/pages/shared/dashboardRenderer.js";
import { getAdminImage, getAdminProfile, updateAdminProfile, uploadAdminImage, changeAdminPassword } from "../controllers/adminController.js";

export async function handleStudentRoute(request, env, url) {
  const user = await getAuthenticatedAdmin(request, env);
  if (!user) return null;

  if (user.user_type !== USER_TYPES.STUDENT) {
    if (url.pathname.startsWith("/student")) return htmlRedirect(dashboardPathForRole(user.user_type));
    if (url.pathname.startsWith("/api/student")) return json({ error: "Forbidden" }, 403);
    return undefined;
  }

  if (request.method === "GET" && url.pathname === "/student/dashboard") {
    return html(renderSimpleRoleDashboard({
      roleName: "Student",
      homePath: "/student/dashboard",
      navItems: STUDENT_NAV_ITEMS,
      admin: user,
      currentDeviceLabel: user.session_device_label || "",
      loginAt: user.session_created_at || "",
    }));
  }

  if (request.method === "GET" && url.pathname === "/student/profile") {
    return html(profilePage(user, { navItems: STUDENT_NAV_ITEMS, homePath: "/student/dashboard", apiBase: "/api/student" }));
  }

  if (request.method === "GET" && url.pathname === "/api/student/profile") {
    return json({ profile: await getAdminProfile(env, user.id) });
  }

  if (request.method === "GET" && (url.pathname === "/api/student/profile/image/avatar" || url.pathname === "/api/student/profile/image/cover")) {
    const type = url.pathname.endsWith("/avatar") ? "avatar" : "cover";
    return getAdminImage(env, user.id, type);
  }

  if (request.method === "POST" && url.pathname === "/api/student/profile/image") {
    return json(await uploadAdminImage(request, env, user.id));
  }

  if (request.method === "POST" && url.pathname === "/api/student/change-password") {
    return json(await changeAdminPassword(request, env, user.id));
  }

  if (request.method === "PATCH" && url.pathname === "/api/student/profile") {
    return json(await updateAdminProfile(request, env, user.id));
  }

  return undefined;
}

function htmlRedirect(location) {
  return new Response(null, { status: 302, headers: { location } });
}
