import { loginPage } from "../../presentation/pages/login/index.js";
import { homePage } from "../../presentation/pages/home/index.js";
import { classSubjectsPage, publicChapterPage, publicSectionPage, publicSubjectPage, publicTopicPage } from "../../presentation/pages/academics/index.js";
import { examSessionPage, examSetupPage } from "../../presentation/pages/exam/index.js";
import { examResultDetailPage, examResultsPage } from "../../presentation/pages/results/index.js";
import {
  socialCreatePage,
  socialMateRequestsPage,
  socialMatesPage,
  socialMyPostsPage,
  socialPage,
  socialPostPage,
  socialSearchPage,
} from "../../presentation/pages/social/index.js";
import { profilePage } from "../../presentation/pages/profile/index.js";
import { faviconResponse } from "../../presentation/layout/favicon.js";
import {
  LOGGED_OUT_NAV_SECTIONS,
  PRIMARY_NAV_SECTIONS,
  STUDENT_NAV_SECTIONS,
  TEACHER_NAV_SECTIONS,
} from "../../presentation/config/navigation.js";
import { html, json, redirect } from "../../shared/http/response.js";
import { loginUser } from "../../features/auth/authController.js";
import {
  cancelMateRequest,
  createComment,
  createMateRequest,
  deletePost,
  createPost,
  removeMate,
  respondMateRequest,
  setMateFollowState,
  socialAvatar,
  socialFeed,
  socialMateRequests,
  socialMateStatus,
  socialMates,
  socialNotificationRead,
  socialNotifications,
  socialNotificationsSeen,
  socialPost,
  socialPostImage,
  toggleCommentReaction,
  toggleReaction,
} from "../../features/social/socialController.js";
import { getAuthenticatedUser } from "../../shared/auth/sessionAuth.js";
import { getUserImage, getUserProfile } from "../../features/user/accountService.js";
import { searchProfilesForSocial } from "../../features/user/userDirectoryService.js";
import { HttpError } from "../../shared/http/errors.js";
import { profilePathForRole, USER_TYPES } from "../../shared/auth/roles.js";
import { imageResponse } from "../../features/user/profile/storage.js";
import { clearActiveAttemptForUserSessions } from "../../infrastructure/db/sessionsRepository.js";
import {
  getPublicChapterReader,
  getPublicModuleClassImageMeta,
  getPublicModuleClassSubjects,
  getPublicSubjectBooks,
  getPublicSubjectNodeChapters,
  getPublicTopicReader,
  listPublicModuleClasses,
} from "../../features/modules/modulesService.js";
import {
  exitExamAttempt,
  getActiveExamAttemptForUser,
  getExamAttemptPagePayload,
  getExamResultDetail,
  getExamResultsOverview,
  getExamSetupPayload,
  retakeExamSession,
  saveExamAttemptAnswer,
  startSubjectExam,
  submitExamAttempt,
} from "../../features/modules/examService.js";

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
  const socialMateStatusMatch = url.pathname.match(/^\/api\/social\/mates\/status\/(\d+)$/);
  const socialMateRequestCancelMatch = url.pathname.match(/^\/api\/social\/mates\/requests\/(\d+)\/cancel$/);
  const socialMateRequestRespondMatch = url.pathname.match(/^\/api\/social\/mates\/requests\/(\d+)\/respond$/);
  const socialMateRemoveMatch = url.pathname.match(/^\/api\/social\/mates\/(\d+)\/remove$/);
  const socialMateFollowMatch = url.pathname.match(/^\/api\/social\/mates\/(\d+)\/follow$/);
  const socialPostPageMatch = url.pathname.match(/^\/social\/post\/(\d+)$/);
  const publicProfileMatch = url.pathname.match(/^\/profile\/(\d+)$/);
  const publicProfileDataMatch = url.pathname.match(/^\/api\/public\/profiles\/(\d+)\/profile$/);
  const publicProfileImageMatch = url.pathname.match(/^\/api\/public\/profiles\/(\d+)\/profile\/image\/(avatar|cover)$/);
  const publicClassImageMatch = url.pathname.match(/^\/api\/public\/classes\/(\d+)\/image$/);
  const classSubjectsPageMatch = url.pathname.match(/^\/classes\/(\d+)$/);
  const subjectExamSetupPageMatch = url.pathname.match(/^\/subjects\/(\d+)\/exam$/);
  const publicSubjectPageMatch = url.pathname.match(/^\/subjects\/(\d+)$/);
  const publicSubjectSectionPageMatch = url.pathname.match(/^\/subjects\/(\d+)\/sections\/(\d+)$/);
  const publicSubjectChapterPageMatch = url.pathname.match(/^\/subjects\/(\d+)\/chapters\/(\d+)$/);
  const publicSubjectTopicPageMatch = url.pathname.match(/^\/subjects\/(\d+)\/topics\/(\d+)$/);
  const examAttemptPageMatch = url.pathname.match(/^\/exam\/(\d+)$/);
  const examResultsDetailPageMatch = url.pathname.match(/^\/results\/(\d+)$/);
  const startExamApiMatch = url.pathname.match(/^\/api\/public\/subjects\/(\d+)\/exams\/start$/);
  const saveExamAnswerApiMatch = url.pathname.match(/^\/api\/public\/exams\/attempts\/(\d+)\/answer$/);
  const submitExamApiMatch = url.pathname.match(/^\/api\/public\/exams\/attempts\/(\d+)\/submit$/);
  const exitExamApiMatch = url.pathname.match(/^\/api\/public\/exams\/attempts\/(\d+)\/exit$/);
  const retakeExamApiMatch = url.pathname.match(/^\/api\/public\/exams\/sessions\/(\d+)\/retake$/);

  if (request.method === "GET" && (url.pathname === "/favicon.svg" || url.pathname === "/favicon.ico")) {
    return faviconResponse();
  }

  let userLoaded = false;
  let userCache = null;
  const getCurrentUser = async () => {
    if (!userLoaded) {
      userLoaded = true;
      userCache = await getAuthenticatedUser(request, env);
    }
    return userCache;
  };

  const isPageRequest = request.method === "GET" && !url.pathname.startsWith("/api/");
  if (isPageRequest) {
    const user = await getCurrentUser();
    if (user) {
      const hintedAttemptId = Number(user.session_active_attempt_id || 0);
      const currentAttemptId = examAttemptPageMatch ? Number.parseInt(examAttemptPageMatch[1], 10) : 0;
      if (hintedAttemptId > 0 && (!Number.isInteger(currentAttemptId) || currentAttemptId !== hintedAttemptId)) {
        const active = await getActiveExamAttemptForUser(env, user.id);
        const activeAttemptId = Number(active?.attempt?.id || 0);
        if (activeAttemptId > 0) {
          return redirect(new URL(`/exam/${activeAttemptId}`, url), 302);
        }
        await clearActiveAttemptForUserSessions(env.DB, { userId: user.id });
      }
    }
  }

  if (request.method === "GET" && url.pathname === "/api/public/exams/active") {
    const user = await getCurrentUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const active = await getActiveExamAttemptForUser(env, user.id);
    if (!active?.attempt && Number(user.session_active_attempt_id || 0) > 0) {
      await clearActiveAttemptForUserSessions(env.DB, { userId: user.id });
    }
    return json(active);
  }

  if (request.method === "GET" && subjectExamSetupPageMatch) {
    const user = await getCurrentUser();
    if (!user) return redirect(new URL("/login", url), 302);
    const setupPayload = await getExamSetupPayload(env, user.id, subjectExamSetupPageMatch[1], {
      contextType: url.searchParams.get("contextType"),
      contextId: url.searchParams.get("contextId"),
    });
    return html(examSetupPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      subject: setupPayload.subject,
      setupPayload,
    }));
  }

  if (request.method === "POST" && startExamApiMatch) {
    const user = await getCurrentUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    return json(await startSubjectExam(request, env, user.id, startExamApiMatch[1]));
  }

  if (request.method === "GET" && examAttemptPageMatch) {
    const user = await getCurrentUser();
    if (!user) return redirect(new URL("/login", url), 302);
    const payload = await getExamAttemptPagePayload(env, user.id, examAttemptPageMatch[1]);
    return html(examSessionPage(payload));
  }

  if (request.method === "PATCH" && saveExamAnswerApiMatch) {
    const user = await getCurrentUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    return json(await saveExamAttemptAnswer(request, env, user.id, saveExamAnswerApiMatch[1]));
  }

  if (request.method === "POST" && submitExamApiMatch) {
    const user = await getCurrentUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    return json(await submitExamAttempt(env, user.id, submitExamApiMatch[1]));
  }

  if (request.method === "POST" && exitExamApiMatch) {
    const user = await getCurrentUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    return json(await exitExamAttempt(env, user.id, exitExamApiMatch[1]));
  }

  if (request.method === "GET" && url.pathname === "/results") {
    const user = await getCurrentUser();
    if (!user) return redirect(new URL("/login", url), 302);
    const payload = await getExamResultsOverview(env, user.id);
    return html(examResultsPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      sessions: payload.sessions,
    }));
  }

  if (request.method === "GET" && examResultsDetailPageMatch) {
    const user = await getCurrentUser();
    if (!user) return redirect(new URL("/login", url), 302);
    const attemptQuery = String(url.searchParams.get("attempt") || "").trim();
    const detail = await getExamResultDetail(env, user.id, examResultsDetailPageMatch[1], attemptQuery || null);
    return html(examResultDetailPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      detail,
    }));
  }

  if (request.method === "POST" && retakeExamApiMatch) {
    const user = await getCurrentUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    return json(await retakeExamSession(env, user.id, retakeExamApiMatch[1]));
  }

  if (request.method === "GET" && url.pathname === "/") {
    const user = await getCurrentUser();
    const featured = await listPublicModuleClasses(env, { onlyHome: true });
    const all = await listPublicModuleClasses(env, { onlyHome: false });
    return html(homePage({ user, featuredClasses: featured.classes, allClasses: all.classes, showAllClasses: false }));
  }

  if (request.method === "GET" && url.pathname === "/classes") {
    const user = await getCurrentUser();
    const featured = await listPublicModuleClasses(env, { onlyHome: true });
    const all = await listPublicModuleClasses(env, { onlyHome: false });
    return html(homePage({ user, featuredClasses: featured.classes, allClasses: all.classes, showAllClasses: true }));
  }

  if (request.method === "GET" && classSubjectsPageMatch) {
    const user = await getCurrentUser();
    const payload = await getPublicModuleClassSubjects(env, classSubjectsPageMatch[1]);
    return html(classSubjectsPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      classItem: payload.classItem,
      subjects: payload.subjects,
    }));
  }

  if (request.method === "GET" && publicSubjectPageMatch) {
    const user = await getCurrentUser();
    const payload = await getPublicSubjectBooks(env, publicSubjectPageMatch[1]);
    const roots = Array.isArray(payload?.roots) ? payload.roots : [];
    const templateCode = String(payload?.subject?.templateCode || "").trim().toUpperCase();
    const directChapterRoot = roots.length === 1
      && templateCode === "PHY-CHEM-BIO-NCTB2010"
      && Boolean(roots[0]?.supportsChapters);

    if (directChapterRoot) {
      const nodeId = Number(roots[0]?.id || 0);
      const chaptersPayload = await getPublicSubjectNodeChapters(
        env,
        payload?.subject?.id || publicSubjectPageMatch[1],
        nodeId,
      );
      return html(publicSectionPage({
        user,
        navItems: resolvePublicNav(user?.user_type),
        homePath: resolvePublicHomePath(user?.user_type),
        subject: chaptersPayload.subject,
        node: chaptersPayload.node,
        chapters: chaptersPayload.chapters,
      }));
    }

    return html(publicSubjectPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      subject: payload.subject,
      roots,
      childrenByRoot: payload.childrenByRoot,
    }));
  }

  if (request.method === "GET" && publicSubjectSectionPageMatch) {
    const user = await getCurrentUser();
    const payload = await getPublicSubjectNodeChapters(env, publicSubjectSectionPageMatch[1], publicSubjectSectionPageMatch[2]);
    return html(publicSectionPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      subject: payload.subject,
      node: payload.node,
      chapters: payload.chapters,
    }));
  }

  if (request.method === "GET" && publicSubjectChapterPageMatch) {
    const user = await getCurrentUser();
    const payload = await getPublicChapterReader(env, publicSubjectChapterPageMatch[1], publicSubjectChapterPageMatch[2]);
    return html(publicChapterPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      subject: payload.subject,
      node: payload.node,
      chapter: payload.chapter,
      chapters: payload.chapters,
      topics: payload.topics,
      contentModules: payload.contentModules,
      contentItemsByType: payload.contentItemsByType,
    }));
  }

  if (request.method === "GET" && publicSubjectTopicPageMatch) {
    const user = await getCurrentUser();
    const payload = await getPublicTopicReader(env, publicSubjectTopicPageMatch[1], publicSubjectTopicPageMatch[2]);
    return html(publicTopicPage({
      user,
      navItems: resolvePublicNav(user?.user_type),
      homePath: resolvePublicHomePath(user?.user_type),
      subject: payload.subject,
      node: payload.node,
      chapter: payload.chapter,
      topic: payload.topic,
      chapters: payload.chapters,
      topics: payload.topics,
      contentModules: payload.contentModules,
      contentItemsByType: payload.contentItemsByType,
    }));
  }

  if (request.method === "GET" && url.pathname === "/api/public/classes") {
    const onlyHome = String(url.searchParams.get("onlyHome") || "").trim().toLowerCase() === "true";
    return json(await listPublicModuleClasses(env, { onlyHome }));
  }

  if (request.method === "GET" && publicClassImageMatch) {
    const imageMeta = await getPublicModuleClassImageMeta(env, publicClassImageMatch[1]);
    if (!env?.BUCKET || typeof env.BUCKET.get !== "function") {
      return json({ error: "Class image storage is not configured" }, 500);
    }
    const object = await env.BUCKET.get(imageMeta.key);
    if (!object) return json({ error: "Class image not found" }, 404);
    return imageResponse(object);
  }

  if (request.method === "GET" && publicProfileMatch) {
    const viewer = await getCurrentUser();
    const profileUserId = parsePositiveId(publicProfileMatch[1], "profile id");
    const fromSocial = String(url.searchParams.get("from") || "").toLowerCase() === "social";

    if (viewer && Number(viewer.id) === profileUserId) {
      const ownProfileUrl = new URL(profilePathForRole(viewer.user_type), url);
      if (fromSocial) ownProfileUrl.searchParams.set("from", "social");
      return redirect(ownProfileUrl, 302);
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
      showBackToFeed: fromSocial,
      backToFeedHref: "/social",
    }));
  }

  if (request.method === "GET" && url.pathname === "/social") {
    const user = await getCurrentUser();
    return html(socialPage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/my-posts") {
    const user = await getCurrentUser();
    return html(socialMyPostsPage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/create") {
    const user = await getCurrentUser();
    return html(socialCreatePage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/search") {
    const user = await getCurrentUser();
    return html(socialSearchPage(user, url.searchParams.get("q") || ""));
  }

  if (request.method === "GET" && url.pathname === "/social/mates") {
    const user = await getCurrentUser();
    if (!user) return redirect(new URL("/login", url), 302);
    return html(socialMatesPage(user));
  }

  if (request.method === "GET" && url.pathname === "/social/mates/requests") {
    const user = await getCurrentUser();
    if (!user) return redirect(new URL("/login", url), 302);
    return html(socialMateRequestsPage(user));
  }

  if (request.method === "GET" && socialPostPageMatch) {
    const user = await getCurrentUser();
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
    const viewer = await getCurrentUser();
    return json(await socialFeed(env, viewer, {
      scope: url.searchParams.get("scope") || "",
      cursor: url.searchParams.get("cursor") || "",
      limit: url.searchParams.get("limit") || "",
      maxBytes: url.searchParams.get("maxBytes") || "",
      userId: url.searchParams.get("userId") || "",
    }));
  }

  if (request.method === "GET" && url.pathname === "/api/social/notifications") {
    const viewer = await getCurrentUser();
    return json(await socialNotifications(env, viewer, {
      limit: url.searchParams.get("limit") || "",
    }));
  }

  if (request.method === "POST" && url.pathname === "/api/social/notifications/seen") {
    const viewer = await getCurrentUser();
    return json(await socialNotificationsSeen(env, viewer));
  }

  if (request.method === "POST" && url.pathname === "/api/social/notifications/read") {
    const viewer = await getCurrentUser();
    return json(await socialNotificationRead(request, env, viewer));
  }

  if (request.method === "GET" && url.pathname === "/api/social/profiles/search") {
    const query = String(url.searchParams.get("q") || "");
    const limit = String(url.searchParams.get("limit") || "");
    return json({
      query,
      results: await searchProfilesForSocial(env, { query, limit }),
    });
  }

  if (request.method === "GET" && url.pathname === "/api/social/mates") {
    const viewer = await getCurrentUser();
    return json(await socialMates(env, viewer, {
      limit: url.searchParams.get("limit") || "",
    }));
  }

  if (request.method === "GET" && url.pathname === "/api/social/mates/requests") {
    const viewer = await getCurrentUser();
    return json(await socialMateRequests(env, viewer, {
      limit: url.searchParams.get("limit") || "",
    }));
  }

  if (request.method === "GET" && socialMateStatusMatch) {
    const viewer = await getCurrentUser();
    return json(await socialMateStatus(env, viewer, socialMateStatusMatch[1]));
  }

  if (request.method === "POST" && url.pathname === "/api/social/mates/request") {
    const viewer = await getCurrentUser();
    return json(await createMateRequest(request, env, viewer));
  }

  if (request.method === "POST" && socialMateRequestRespondMatch) {
    const viewer = await getCurrentUser();
    return json(await respondMateRequest(request, env, viewer, socialMateRequestRespondMatch[1]));
  }

  if (request.method === "POST" && socialMateRequestCancelMatch) {
    const viewer = await getCurrentUser();
    return json(await cancelMateRequest(env, viewer, socialMateRequestCancelMatch[1]));
  }

  if (request.method === "POST" && socialMateRemoveMatch) {
    const viewer = await getCurrentUser();
    return json(await removeMate(env, viewer, socialMateRemoveMatch[1]));
  }

  if (request.method === "POST" && socialMateFollowMatch) {
    const viewer = await getCurrentUser();
    return json(await setMateFollowState(request, env, viewer, socialMateFollowMatch[1]));
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
    const viewer = await getCurrentUser();
    return json(await createPost(request, env, viewer));
  }

  if (request.method === "GET" && socialPostMatch) {
    const viewer = await getCurrentUser();
    return json(await socialPost(env, viewer, socialPostMatch[1]));
  }

  if (request.method === "DELETE" && socialPostMatch) {
    const viewer = await getCurrentUser();
    return json(await deletePost(env, viewer, socialPostMatch[1]));
  }

  if (request.method === "POST" && socialMatch) {
    const viewer = await getCurrentUser();
    const postId = socialMatch[1];
    const action = socialMatch[2];
    if (action === "comments") return json(await createComment(request, env, viewer, postId));
    if (action === "reactions") return json(await toggleReaction(env, viewer, postId));
  }

  if (request.method === "POST" && socialCommentReactionMatch) {
    const viewer = await getCurrentUser();
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
