import { ensureSchema } from "./lib/db.js";
import { htmlResponse } from "./lib/http.js";
import { handleAdminRoutes } from "./routes/admin.js";
import { handleTeacherRoutes } from "./routes/teacher.js";
import { handleStudentRoutes } from "./routes/student.js";
import { handlePublicRoutes } from "./routes/public.js";

export default {
  async fetch(request, env) {
    await ensureSchema(env.DB);

    const adminResponse = await handleAdminRoutes(request, env);
    if (adminResponse) {
      return adminResponse;
    }

    const teacherResponse = await handleTeacherRoutes(request, env);
    if (teacherResponse) {
      return teacherResponse;
    }

    const studentResponse = await handleStudentRoutes(request, env);
    if (studentResponse) {
      return studentResponse;
    }

    const publicResponse = await handlePublicRoutes(request, env);
    if (publicResponse) {
      return publicResponse;
    }

    return htmlResponse("Not found", 404);
  },
};
