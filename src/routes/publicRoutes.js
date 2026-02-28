import { loginPage } from "../ui/pages/login/index.js";
import { homePage } from "../ui/pages/home/index.js";
import { socialPage } from "../ui/pages/social/index.js";
import { html, json, redirect } from "../core/response.js";
import { loginAdmin } from "../controllers/publicController.js";
import { createComment, createPost, socialAvatar, socialFeed, socialPostImage, toggleReaction } from "../controllers/socialController.js";
import { getAuthenticatedAdmin } from "../core/auth.js";

export async function handlePublicRoute(request, env, url) {
  const socialMatch = url.pathname.match(/^\/api\/social\/posts\/(\d+)\/(comments|reactions)$/);
  const socialImageMatch = url.pathname.match(/^\/api\/social\/posts\/(\d+)\/image$/);
  const socialAvatarMatch = url.pathname.match(/^\/api\/social\/avatar\/(\d+)$/);

  if (request.method === "GET" && url.pathname === "/") {
    const admin = await getAuthenticatedAdmin(request, env);
    return html(homePage({ admin }));
  }

  if (request.method === "GET" && url.pathname === "/social") {
    const user = await getAuthenticatedAdmin(request, env);
    return html(socialPage(user));
  }

  if (request.method === "GET" && url.pathname === "/admin/login") {
    return html(loginPage());
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const result = await loginAdmin(request, env);
    const contentType = String(request.headers.get("content-type") || "").toLowerCase();
    const wantsHtml = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
    if (wantsHtml) {
      const response = redirect(new URL(result.redirectTo || "/admin/dashboard", url), 303);
      for (const [header, value] of Object.entries(result.headers || {})) {
        response.headers.set(header, value);
      }
      return response;
    }
    return json({ ok: result.ok, redirectTo: result.redirectTo || "/admin/dashboard" }, result.status || 200, result.headers || {});
  }

  if (request.method === "GET" && url.pathname === "/api/social/feed") {
    const viewer = await getAuthenticatedAdmin(request, env);
    return json(await socialFeed(env, viewer));
  }

  if (request.method === "POST" && url.pathname === "/api/social/posts") {
    const viewer = await getAuthenticatedAdmin(request, env);
    return json(await createPost(request, env, viewer));
  }

  if (request.method === "POST" && socialMatch) {
    const viewer = await getAuthenticatedAdmin(request, env);
    const postId = socialMatch[1];
    const action = socialMatch[2];
    if (action === "comments") return json(await createComment(request, env, viewer, postId));
    if (action === "reactions") return json(await toggleReaction(env, viewer, postId));
  }

  if (request.method === "GET" && socialImageMatch) {
    return socialPostImage(env, socialImageMatch[1]);
  }

  if (request.method === "GET" && socialAvatarMatch) {
    return socialAvatar(env, socialAvatarMatch[1]);
  }

  return null;
}
