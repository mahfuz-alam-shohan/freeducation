import { readSessionCookie } from "../lib/auth.js";
import { findUserById, getSiteSettings } from "../lib/db.js";
import { roleHomePath } from "../lib/roles.js";
import { htmlResponse, redirect } from "../lib/http.js";
import { getThemePalette } from "../lib/site-settings.js";
import { teacherDashboardPage } from "../views/teacher.js";

async function handleTeacherRoutes(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/teacher")) {
    return null;
  }

  const session = await readSessionCookie(request, env.JWT_SECRET);
  if (!session) {
    return redirect("/login");
  }

  if (session.role !== "teacher") {
    return redirect(roleHomePath(session.role));
  }

  const currentUser = await findUserById(env.DB, session.sub);
  const userProfile = {
    name: currentUser?.display_name || session.name || "User",
    email: currentUser?.email || "",
  };
  const siteSettings = await getSiteSettings(env.DB);
  const theme = getThemePalette(siteSettings?.theme_id);

  if (url.pathname === "/teacher") {
    return htmlResponse(teacherDashboardPage(userProfile, siteSettings, theme));
  }

  return htmlResponse("Not found", 404);
}

export { handleTeacherRoutes };
