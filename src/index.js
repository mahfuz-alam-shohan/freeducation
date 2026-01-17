import { ensureSchema } from "./lib/db.js";
import { htmlResponse } from "./lib/http.js";
import { handleAdminRoutes } from "./routes/admin.js";
import { handlePublicRoutes } from "./routes/public.js";

export default {
  async fetch(request, env) {
    await ensureSchema(env.DB);

    const adminResponse = await handleAdminRoutes(request, env);
    if (adminResponse) {
      return adminResponse;
    }

    const publicResponse = await handlePublicRoutes(request, env);
    if (publicResponse) {
      return publicResponse;
    }

    return htmlResponse("Not found", 404);
  },
};
