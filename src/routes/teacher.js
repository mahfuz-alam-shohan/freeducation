import { readSessionCookie } from "../lib/auth.js";
import { roleHomePath } from "../lib/roles.js";
import { htmlResponse, redirect } from "../lib/http.js";
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

  if (url.pathname === "/teacher") {
    return htmlResponse(teacherDashboardPage());
  }

  return htmlResponse("Not found", 404);
}

export { handleTeacherRoutes };
