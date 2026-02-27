import { ADMIN_NAV_ITEMS } from "../../config/navigation.js";
import { renderDashboardPage } from "../shared/dashboardRenderer.js";
import { dashboardHtml } from "./html.js";
import { DASHBOARD_STYLE } from "./style.js";
import { DASHBOARD_SCRIPT } from "./script.js";

export function dashboardPage(admin) {
  return renderDashboardPage({
    title: "Dashboard",
    activeMenu: "dashboard",
    navItems: ADMIN_NAV_ITEMS,
    admin,
    content: dashboardHtml(),
    pageClass: "page-dashboard",
    pageStyles: DASHBOARD_STYLE,
    script: DASHBOARD_SCRIPT,
  });
}
