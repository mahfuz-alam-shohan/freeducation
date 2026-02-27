import { renderAdminLayout } from "../../layout/adminLayout.js";
import { TEACHER_NAV_ITEMS } from "../../config/navigation.js";
import { teacherDashboardHtml } from "./html.js";
import { TEACHER_DASHBOARD_STYLE } from "./style.js";
import { TEACHER_DASHBOARD_SCRIPT } from "./script.js";

export function teacherDashboardPage(admin) {
  return renderAdminLayout({
    title: "Teacher dashboard",
    activeMenu: "",
    homePath: "/teacher/dashboard",
    navItems: TEACHER_NAV_ITEMS,
    admin,
    content: teacherDashboardHtml(),
    pageClass: "page-teacher-dashboard",
    pageStyles: TEACHER_DASHBOARD_STYLE,
    script: TEACHER_DASHBOARD_SCRIPT,
  });
}
