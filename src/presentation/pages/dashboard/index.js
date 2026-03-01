import { PRIMARY_NAV_SECTIONS } from "../../config/navigation.js";
import { renderDashboardPage } from "../shared/dashboardRenderer.js";
import { dashboardHtml } from "./html.js";
import { DASHBOARD_STYLE } from "./style.js";
import { DASHBOARD_SCRIPT } from "./script.js";

export function dashboardPage(user, options = {}) {
  return renderDashboardPage({
    title: "Dashboard",
    activeMenu: "dashboard",
    navItems: PRIMARY_NAV_SECTIONS,
    user,
    apiBase: String(options.apiBase || ""),
    content: dashboardHtml(),
    pageClass: "page-dashboard",
    pageStyles: DASHBOARD_STYLE,
    script: DASHBOARD_SCRIPT,
  });
}
