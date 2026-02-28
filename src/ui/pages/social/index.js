import { ADMIN_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderDashboardPage } from "../shared/dashboardRenderer.js";
import { socialHtml } from "./html.js";
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

export function socialPage(user) {
  const userType = user?.user_type || "";
  return renderDashboardPage({
    title: "Social",
    activeMenu: "social",
    homePath: resolveHomePath(userType),
    navItems: resolveNav(userType),
    admin: user || null,
    content: socialHtml(Boolean(user)),
    pageClass: "page-social",
    pageStyles: SOCIAL_STYLE,
    script: SOCIAL_SCRIPT,
  });
}
