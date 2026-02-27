import { renderAdminLayout } from "../../layout/adminLayout.js";
import { STUDENT_NAV_ITEMS } from "../../config/navigation.js";
import { studentDashboardHtml } from "./html.js";
import { STUDENT_DASHBOARD_STYLE } from "./style.js";
import { STUDENT_DASHBOARD_SCRIPT } from "./script.js";

export function studentDashboardPage(admin) {
  return renderAdminLayout({
    title: "Student dashboard",
    activeMenu: "",
    homePath: "/student/dashboard",
    navItems: STUDENT_NAV_ITEMS,
    admin,
    content: studentDashboardHtml(),
    pageClass: "page-student-dashboard",
    pageStyles: STUDENT_DASHBOARD_STYLE,
    script: STUDENT_DASHBOARD_SCRIPT,
  });
}
