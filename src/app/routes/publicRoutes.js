import { loginPage } from "../../presentation/pages/login/index.js";
import { homePage } from "../../presentation/pages/home/index.js";
import { socialCreatePage, socialMyPostsPage, socialPage, socialPostPage, socialSearchPage } from "../../presentation/pages/social/index.js";
import { profilePage } from "../../presentation/pages/profile/index.js";
import { SOCIAL_STYLE } from "../../presentation/pages/social/style.js";
import { renderProfileSocialContextSidebar } from "../../presentation/pages/profile/components/socialContextSidebar.js";
import {
  LOGGED_OUT_NAV_SECTIONS,
  PRIMARY_NAV_SECTIONS,
  STUDENT_NAV_SECTIONS,
  TEACHER_NAV_SECTIONS,
} from "../../presentation/config/navigation.js";
import { html, json, redirect } from "../../shared/http/response.js";
import { loginUser } from "../../features/auth/authController.js";
import { createComment, createPost, socialAvatar, socialFeed, socialNotifications, socialPost, socialPostImage, toggleCommentReaction, toggleReaction } from "../../features/social/socialController.js";
import { getAuthenticatedUser } from "../../shared/auth/sessionAuth.js";
import { getUserImage, getUserProfile } from "../../features/user/accountService.js";
import { searchProfilesForSocial } from "../../features/user/userDirectoryService.js";
import { HttpError } from "../../shared/http/errors.js";
import { profilePathForRole, USER_TYPES } from "../../shared/auth/roles.js";

function resolvePublicNav(userType = "") {
  const role = String(userType || "").toLowerCase();
  if (role === USER_TYPES.ADMINISTRATOR.toLowerCase()) return PRIMARY_NAV_SECTIONS;
  if (role === USER_TYPES.TEACHER.toLowerCase()) return TEACHER_NAV_SECTIONS;
  if (role === USER_TYPES.STUDENT.toLowerCase()) return STUDENT_NAV_SECTIONS;
  return LOGGED_OUT_NAV_SECTIONS;
}

function resolvePublicHomePath(userType = "") {
  const role = String(userType || "").toLowerCase();
  if (role === USER_TYPES.ADMINISTRATOR.toLowerCase()) return "/admin/dashboard";
  if (role === USER_TYPES.TEACHER.toLowerCase()) return "/teacher/dashboard";
  if (role === USER_TYPES.STUDENT.toLowerCase()) return "/student/dashboard";
  return "/";
}

function parsePositiveId(value, label = "id") {
  const id = Number.parseInt(String(value || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `Invalid ${label}`);
  return id;
}

export async function handlePublicRoute(request, env, url) {
  const socialMatch = url.pathname.match(/^\/api\/social\/posts\/(\d+)\/(comments|reactions)$/);
  const socialCommentReactionMatch = url.pathname.match(/^\/api\/social\/comments\/(\d+)\/reactions$/);
  const socialPostMatch = url.pathname.match(/^\/api\/social\/posts\/(\d+)$/);
  const socialImageMatch = url.pathname.match(/^\/api\/social\/posts\/(\d+)\/image$/);
  const socialAvatarMatch = url.pathname.match(/^\/api\/social\/avatar\/(\d+)$/);
  const socialPostPageMatch = url.pathname.match(/^\/social\/post\/(\d+)$/);
  const publicProfileMatch = url.pathname.match(/^\/profile\/(\d+)$/);
  const publicProfileDataMatch = url.pathname.match(/^\/api\/public\/profiles\/(\d+)\/profile$/);
  const publicProfileImageMatch = url.pathname.match(/^\/api\/public\/profiles\/(\d+)\/profile\/image\/(avatar|cover)$/);

  if (request.method === "GET" && url.pathname === "/") {
    const user = await getAuthenticatedUser(request, env);
    return html(homePage({ user }));
  }

  if (request.method === "GET" && publicProfileMatch) {
    const viewer = await getAuthenticatedUser(request, env);
    const profileUserId = parsePositiveId(publicProfileMatch[1], "profile id");
    const fromSocial = String(url.searchParams.get("from") || "").toLowerCase() === "social";

    if (viewer && Number(viewer.id) === profileUserId && !fromSocial) {
      return redirect(new URL(profilePathForRole(viewer.user_type), url), 302);
    }

    const profileUser = await getUserProfile(env, profileUserId);
    return html(profilePage(viewer, {
      navItems: resolvePublicNav(viewer?.user_type),
      homePath: resolvePublicHomePath(viewer?.user_type),
      apiBase: `/api/public/profiles/${profileUserId}`,
      profileUser,
      readOnly: true,
      profileUserId,
      canInteract: Boolean(viewer),
      ...(fromSocial
        ? {
          activeMenu: "social",
          pageClass: "page-social profile-social-context",
          pageStyles: SOCIAL_STYLE,
          rightSidebar: renderProfileSocialContextSidebar({
            canInteract: Boolean(viewer),
            profileUserId,
          }),
        }
        : {}),
    }));
  }

  if (request.method === "GET" && url.pathname === "/social") {
    const user = await getAuthenticatedUser(request, env);
    return html(socialPage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/my-posts") {
    const user = await getAuthenticatedUser(request, env);
    return html(socialMyPostsPage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/create") {
    const user = await getAuthenticatedUser(request, env);
    return html(socialCreatePage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/search") {
    const user = await getAuthenticatedUser(request, env);
    return html(socialSearchPage(user, url.searchParams.get("q") || ""));
  }

  if (request.method === "GET" && socialPostPageMatch) {
    const user = await getAuthenticatedUser(request, env);
    const postId = parsePositiveId(socialPostPageMatch[1], "post id");
    return html(socialPostPage(user, postId));
  }

  if (request.method === "GET" && (url.pathname === "/admin/login" || url.pathname === "/login")) {
    return html(loginPage());
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const result = await loginUser(request, env);
    const contentType = String(request.headers.get("content-type") || "").toLowerCase();
    const wantsHtml = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
    if (wantsHtml) {
      const response = redirect(new URL(result.redirectTo || "/", url), 303);
      for (const [header, value] of Object.entries(result.headers || {})) {
        response.headers.set(header, value);
      }
      return response;
    }
    return json({ ok: result.ok, redirectTo: result.redirectTo || "/" }, result.status || 200, result.headers || {});
  }

  if (request.method === "GET" && url.pathname === "/api/social/feed") {
    const viewer = await getAuthenticatedUser(request, env);
    return json(await socialFeed(env, viewer, {
      scope: url.searchParams.get("scope") || "",
      cursor: url.searchParams.get("cursor") || "",
      limit: url.searchParams.get("limit") || "",
      maxBytes: url.searchParams.get("maxBytes") || "",
      userId: url.searchParams.get("userId") || "",
    }));
  }

  if (request.method === "GET" && url.pathname === "/api/social/notifications") {
    const viewer = await getAuthenticatedUser(request, env);
    return json(await socialNotifications(env, viewer, {
      limit: url.searchParams.get("limit") || "",
    }));
  }

  if (request.method === "GET" && url.pathname === "/api/social/profiles/search") {
    const query = String(url.searchParams.get("q") || "");
    const limit = String(url.searchParams.get("limit") || "");
    return json({
      query,
      results: await searchProfilesForSocial(env, { query, limit }),
    });
  }

  if (request.method === "GET" && publicProfileDataMatch) {
    const profileUserId = parsePositiveId(publicProfileDataMatch[1], "profile id");
    return json({ profile: await getUserProfile(env, profileUserId) });
  }

  if (request.method === "GET" && publicProfileImageMatch) {
    const profileUserId = parsePositiveId(publicProfileImageMatch[1], "profile id");
    const imageType = publicProfileImageMatch[2] === "cover" ? "cover" : "avatar";
    return getUserImage(env, profileUserId, imageType);
  }

  if (request.method === "POST" && url.pathname === "/api/social/posts") {
    const viewer = await getAuthenticatedUser(request, env);
    return json(await createPost(request, env, viewer));
  }

  if (request.method === "GET" && socialPostMatch) {
    const viewer = await getAuthenticatedUser(request, env);
    return json(await socialPost(env, viewer, socialPostMatch[1]));
  }

  if (request.method === "POST" && socialMatch) {
    const viewer = await getAuthenticatedUser(request, env);
    const postId = socialMatch[1];
    const action = socialMatch[2];
    if (action === "comments") return json(await createComment(request, env, viewer, postId));
    if (action === "reactions") return json(await toggleReaction(env, viewer, postId));
  }

  if (request.method === "POST" && socialCommentReactionMatch) {
    const viewer = await getAuthenticatedUser(request, env);
    return json(await toggleCommentReaction(env, viewer, socialCommentReactionMatch[1]));
  }

  if (request.method === "GET" && socialImageMatch) {
    return socialPostImage(env, socialImageMatch[1], { index: url.searchParams.get("i") || "0" });
  }

  if (request.method === "GET" && socialAvatarMatch) {
    return socialAvatar(env, socialAvatarMatch[1]);
  }

  return null;
}
