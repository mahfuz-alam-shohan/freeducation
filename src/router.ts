import type { Env } from "./types";
import { handleAdminRequest } from "./admin";
import { renderHome } from "./public";

export async function routeRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith("/admin")) {
    return handleAdminRequest(request, env);
  }

  if (url.pathname === "/") {
    return renderHome();
  }

  return new Response("Not Found", { status: 404 });
}
