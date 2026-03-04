import { PRIMARY_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderDashboardPage } from "../shared/dashboardRenderer.js";
import { socialCreateHtml, socialFeedHtml, socialPostHtml, socialSearchHtml } from "./html.js";
import { renderSocialHeaderSearch } from "./components/headerSearch.js";
import { renderSocialPostDetailSidebar } from "./components/postDetailSidebar.js";
import { renderSocialRightSidebar } from "./components/rightSidebar.js";
import { SOCIAL_STYLE } from "./style.js";
import { SOCIAL_SCRIPT } from "./script.js";

function resolveNav(userType) {
  const role = String(userType || "").toLowerCase();
  if (role === "administrator") return PRIMARY_NAV_SECTIONS;
  if (role === "teacher") return TEACHER_NAV_SECTIONS;
  if (role === "student") return STUDENT_NAV_SECTIONS;
  return LOGGED_OUT_NAV_SECTIONS;
}

function resolveHomePath(userType) {
  const role = String(userType || "").toLowerCase();
  if (role === "administrator") return "/admin/dashboard";
  if (role === "teacher") return "/teacher/dashboard";
  if (role === "student") return "/student/dashboard";
  return "/";
}

function resolveProfilePath(userType) {
  const role = String(userType || "").toLowerCase();
  if (role === "administrator") return "/admin/profile";
  if (role === "teacher") return "/teacher/profile";
  if (role === "student") return "/student/profile";
  return "";
}

function buildSocialQuickLinks(user) {
  const userType = user?.user_type || "";
  return resolveNav(userType);
}

function buildSocialPageContext(user) {
  return {
    viewerId: Number.parseInt(String(user?.id || 0), 10) || 0,
    viewerProfilePath: resolveProfilePath(user?.user_type || ""),
  };
}

function renderSocialShell(user, title, content, rightSidebar = "", options = {}) {
  const userType = user?.user_type || "";
  const searchQuery = String(options.searchQuery || "");
  return renderDashboardPage({
    title,
    activeMenu: "social",
    homePath: resolveHomePath(userType),
    navItems: resolveNav(userType),
    user: user || null,
    content,
    rightSidebar,
    pageClass: "page-social",
    pageStyles: SOCIAL_STYLE,
    script: SOCIAL_SCRIPT,
    headerCenter: renderSocialHeaderSearch(searchQuery),
  });
}

export function socialPage(user) {
  const pageContext = buildSocialPageContext(user);
  return renderSocialShell(
    user,
    "Social",
    socialFeedHtml(Boolean(user), "feed", pageContext),
    renderSocialRightSidebar({
      canInteract: Boolean(user),
      scope: "feed",
      navSections: buildSocialQuickLinks(user),
    }),
  );
}

export function socialMyPostsPage(user) {
  const pageContext = buildSocialPageContext(user);
  return renderSocialShell(
    user,
    "My posts",
    socialFeedHtml(Boolean(user), "mine", pageContext),
    renderSocialRightSidebar({
      canInteract: Boolean(user),
      scope: "mine",
      navSections: buildSocialQuickLinks(user),
    }),
  );
}

export function socialCreatePage(user) {
  const pageContext = buildSocialPageContext(user);
  return renderSocialShell(
    user,
    "Create post",
    socialCreateHtml(Boolean(user), pageContext),
    renderSocialRightSidebar({
      canInteract: Boolean(user),
      scope: "feed",
      navSections: buildSocialQuickLinks(user),
    }),
  );
}

export function socialPostPage(user, postId) {
  const pageContext = buildSocialPageContext(user);
  return renderSocialShell(
    user,
    "Post",
    socialPostHtml(Boolean(user), postId, pageContext),
    renderSocialPostDetailSidebar({
      canInteract: Boolean(user),
    }),
  );
}

export function socialSearchPage(user, query = "") {
  const safeQuery = String(query || "").trim();
  const pageContext = buildSocialPageContext(user);
  return renderSocialShell(
    user,
    safeQuery ? ("Search: " + safeQuery) : "Search profiles",
    socialSearchHtml(Boolean(user), safeQuery, pageContext),
    renderSocialRightSidebar({
      canInteract: Boolean(user),
      scope: "feed",
      navSections: buildSocialQuickLinks(user),
    }),
    { searchQuery: safeQuery },
  );
}
