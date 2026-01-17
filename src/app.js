import { ensureSchema } from "./db/schema.js";
import { handleAdminHome, handleAdminUsers, handleLogout } from "./handlers/admin.js";
import { handleHome, handleLogin, handleSetup } from "./handlers/public.js";
import { renderNotFound } from "./layouts/public.js";
import { htmlHeaders } from "./utils/http.js";

const routes = {
  "/": handleHome,
  "/login": handleLogin,
  "/setup": handleSetup,
  "/logout": handleLogout,
  "/admin": handleAdminHome,
  "/admin/users": handleAdminUsers,
};

export async function handleRequest(request, env) {
  await ensureSchema(env);
  const url = new URL(request.url);
  const handler = routes[url.pathname];

  if (handler) {
    return handler(request, env);
  }

  return new Response(renderNotFound(), {
    status: 404,
    headers: htmlHeaders(),
  });
}
