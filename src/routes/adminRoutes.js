import { dashboardPage } from "../ui/pages/dashboard/index.js";
import { usersPage } from "../ui/pages/users/index.js";
import { profilePage } from "../ui/pages/profile/index.js";
import { teacherDashboardPage } from "../ui/pages/teacherDashboard/index.js";
import { studentDashboardPage } from "../ui/pages/studentDashboard/index.js";
import { sharedProfilePage } from "../ui/pages/shared/profile/index.js";
import { STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS } from "../ui/config/navigation.js";
import { html, json } from "../core/response.js";
import { changeAdminPassword, createAdminUser, deleteAdminUser, getAdminImage, getAdminProfile, listAdminUsers, overview, updateAdminProfile, uploadAdminImage } from "../controllers/adminController.js";
import { destroySession, getAuthenticatedAdmin } from "../core/auth.js";
import { dashboardPathForRole, profilePathForRole, USER_TYPES } from "../core/roles.js";

export async function handleAdminRoute(request, env, url) {
  if (request.method === "POST" && url.pathname === "/api/logout") {
    const result = await destroySession(request, env);
    return json({ ok: true }, 200, result.headers || {});
  }

  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return null;

  const roleDashboardPath = dashboardPathForRole(admin.user_type);
  const roleProfilePath = profilePathForRole(admin.user_type);
  const isAdmin = admin.user_type === USER_TYPES.ADMINISTRATOR;

  if (request.method === "GET" && url.pathname === "/admin/dashboard") {
    if (!isAdmin) return htmlResponseRedirect(roleDashboardPath);
    return html(dashboardPage(admin));
  }

  if (request.method === "GET" && url.pathname === "/teacher/dashboard") {
    if (admin.user_type !== USER_TYPES.TEACHER) return htmlResponseRedirect(roleDashboardPath);
    return html(teacherDashboardPage(admin));
  }

  if (request.method === "GET" && url.pathname === "/student/dashboard") {
    if (admin.user_type !== USER_TYPES.STUDENT) return htmlResponseRedirect(roleDashboardPath);
    return html(studentDashboardPage(admin));
  }

  if (request.method === "GET" && url.pathname === "/admin/users") {
    if (!isAdmin) return htmlResponseRedirect(roleDashboardPath);
    return html(usersPage(admin));
  }

  if (request.method === "GET" && url.pathname === "/admin/profile") {
    if (!isAdmin) return htmlResponseRedirect(roleProfilePath);
    return html(profilePage(admin));
  }

  if (request.method === "GET" && url.pathname === "/teacher/profile") {
    if (admin.user_type !== USER_TYPES.TEACHER) return htmlResponseRedirect(roleProfilePath);
    return html(sharedProfilePage(admin, { navItems: TEACHER_NAV_ITEMS, homePath: "/teacher/dashboard" }));
  }

  if (request.method === "GET" && url.pathname === "/student/profile") {
    if (admin.user_type !== USER_TYPES.STUDENT) return htmlResponseRedirect(roleProfilePath);
    return html(sharedProfilePage(admin, { navItems: STUDENT_NAV_ITEMS, homePath: "/student/dashboard" }));
  }

  if (request.method === "GET" && url.pathname === "/api/admin/overview") {
    if (!isAdmin) return json({ error: "Forbidden" }, 403);
    return json(await overview(env));
  }

  if (request.method === "GET" && url.pathname === "/api/admin/users") {
    if (!isAdmin) return json({ error: "Forbidden" }, 403);
    return json({ users: await listAdminUsers(env) });
  }

  if (request.method === "GET" && url.pathname === "/api/admin/profile") {
    return json({ profile: await getAdminProfile(env, admin.id) });
  }

  if (request.method === "GET" && (url.pathname === "/api/admin/profile/image/avatar" || url.pathname === "/api/admin/profile/image/cover")) {
    const type = url.pathname.endsWith("/avatar") ? "avatar" : "cover";
    return getAdminImage(env, admin.id, type);
  }

  if (request.method === "POST" && url.pathname === "/api/admin/users") {
    if (!isAdmin) return json({ error: "Forbidden" }, 403);
    const result = await createAdminUser(request, env);
    return json(result, 201);
  }

  if (request.method === "POST" && url.pathname === "/api/admin/profile/image") {
    return json(await uploadAdminImage(request, env, admin.id));
  }

  if (request.method === "POST" && url.pathname === "/api/admin/change-password") {
    return json(await changeAdminPassword(request, env, admin.id));
  }

  if (request.method === "PATCH" && url.pathname === "/api/admin/profile") {
    return json(await updateAdminProfile(request, env, admin.id));
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/admin/users/")) {
    if (!isAdmin) return json({ error: "Forbidden" }, 403);
    const userId = url.pathname.slice("/api/admin/users/".length);
    const result = await deleteAdminUser(userId, env, admin.id);
    return json(result);
  }

  return undefined;
}

function htmlResponseRedirect(location) {
  return new Response(null, { status: 302, headers: { location } });
}
