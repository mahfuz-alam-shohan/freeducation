import { readSessionCookie } from "../lib/auth.js";
import { roleHomePath } from "../lib/roles.js";
import { htmlResponse, redirect } from "../lib/http.js";
import { studentDashboardPage } from "../views/student.js";

async function handleStudentRoutes(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/student")) {
    return null;
  }

  const session = await readSessionCookie(request, env.JWT_SECRET);
  if (!session) {
    return redirect("/login");
  }

  if (session.role !== "student") {
    return redirect(roleHomePath(session.role));
  }

  if (url.pathname === "/student") {
    return htmlResponse(studentDashboardPage());
  }

  return htmlResponse("Not found", 404);
}

export { handleStudentRoutes };
