import { ADMIN_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderDashboardPage } from "../shared/dashboardRenderer.js";
import { socialCreateHtml, socialFeedHtml } from "./html.js";
import { SOCIAL_STYLE } from "./style.js";
import { SOCIAL_SCRIPT } from "./script.js";

function resolveNav(userType) {
  const role = String(userType || "").toLowerCase();
  if (role === "administrator") return ADMIN_NAV_SECTIONS;
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

function renderSocialShell(user, title, content) {
  const userType = user?.user_type || "";
  return renderDashboardPage({
    title,
    activeMenu: "social",
    homePath: resolveHomePath(userType),
    navItems: resolveNav(userType),
    admin: user || null,
    content,
    pageClass: "page-social",
    pageStyles: SOCIAL_STYLE,
    script: SOCIAL_SCRIPT,
  });
}

export function socialPage(user) {
  return renderSocialShell(user, "Social", socialFeedHtml(Boolean(user)));
}

export function socialCreatePage(user) {
  return renderSocialShell(user, "Create post", socialCreateHtml(Boolean(user)));
}
