import { readSessionCookie } from "../lib/auth.js";
import { findUserById } from "../lib/db.js";
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

  const currentUser = await findUserById(env.DB, session.sub);
  const userProfile = {
    name: currentUser?.display_name || session.name || "User",
    email: currentUser?.email || "",
  };

  if (url.pathname === "/student") {
    return htmlResponse(studentDashboardPage(userProfile));
  }

  return htmlResponse("Not found", 404);
}

export { handleStudentRoutes };
