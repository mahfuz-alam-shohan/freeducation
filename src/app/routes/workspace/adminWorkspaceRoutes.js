import { html, json } from "../../../shared/http/response.js";
import { fileManagerPage } from "../../../presentation/pages/file-manager/index.js";
import { usersPage } from "../../../presentation/pages/users/index.js";
import { getWorkspaceMetrics } from "../../../features/workspace/metricsService.js";
import { deleteWorkspaceResource, getWorkspaceResourceObject, listWorkspaceResources } from "../../../features/workspace/resourceService.js";
import { listUsersForWorkspace, registerUser, removeUser } from "../../../features/user/userDirectoryService.js";

export async function handleAdminWorkspaceRoute({ request, env, url, user }) {
  if (request.method === "GET" && url.pathname === "/admin/users") {
    return html(usersPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && url.pathname === "/admin/file-manager") {
    return html(fileManagerPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/overview" || url.pathname === "/api/admin/overview")) {
    return json(await getWorkspaceMetrics(env));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/users" || url.pathname === "/api/admin/users")) {
    return json({ users: await listUsersForWorkspace(env) });
  }

  if (request.method === "POST" && (url.pathname === "/api/workspace/users" || url.pathname === "/api/admin/users")) {
    const result = await registerUser(request, env);
    return json(result, 201);
  }

  if (request.method === "DELETE" && (url.pathname.startsWith("/api/workspace/users/") || url.pathname.startsWith("/api/admin/users/"))) {
    const userId = url.pathname.startsWith("/api/workspace/users/")
      ? url.pathname.slice("/api/workspace/users/".length)
      : url.pathname.slice("/api/admin/users/".length);
    const result = await removeUser(userId, env, user.id);
    return json(result);
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/files" || url.pathname === "/api/admin/files")) {
    const apiBase = url.pathname.startsWith("/api/workspace") ? "/api/workspace" : "/api/admin";
    return json(await listWorkspaceResources(env, {
      type: url.searchParams.get("type"),
      usage: url.searchParams.get("usage"),
      search: url.searchParams.get("search"),
      cursor: url.searchParams.get("cursor"),
      limit: url.searchParams.get("limit"),
      apiBase,
    }));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/files/object" || url.pathname === "/api/admin/files/object")) {
    return getWorkspaceResourceObject(env, url.searchParams.get("key"));
  }

  if (request.method === "DELETE" && (url.pathname === "/api/workspace/files/object" || url.pathname === "/api/admin/files/object")) {
    return json(await deleteWorkspaceResource(env, url.searchParams.get("key")));
  }

  return undefined;
}
