import { renderAdminLayout } from "../../layout/adminLayout.js";
import { dashboardHtml } from "./html.js";
import { DASHBOARD_STYLE } from "./style.js";
import { DASHBOARD_SCRIPT } from "./script.js";

export function dashboardPage(admin) {
  return renderAdminLayout({
    title: "Dashboard",
    activeMenu: "dashboard",
    admin,
    content: dashboardHtml(),
    pageClass: "page-dashboard",
    pageStyles: DASHBOARD_STYLE,
    script: DASHBOARD_SCRIPT,
  });
}
