import type { Env } from "./types";
import { handleAdmin } from "./admin/handlers";
import { renderPublicHome } from "./public";

export async function routeRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const path = url.pathname;

  if (path.startsWith("/admin")) {
    return handleAdmin(request, env);
  }

  if (path === "/" && method === "GET") {
    return renderPublicHome();
  }

  return new Response("Not Found", { status: 404 });
}
