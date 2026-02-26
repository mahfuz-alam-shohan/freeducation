import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

export function renderAdminLayout({ title, activeMenu, admin, content, script = "", footerText = "Free education admin panel.", pageClass = "", pageStyles = "" }) {
  const nav = `<nav class="admin-nav">${ADMIN_NAV_ITEMS.map((item) => `<a class="${activeMenu === item.key ? "active" : ""}" href="${item.href}">${item.label}</a>`).join("")}</nav>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles,
    body: `<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-brand">${APP_NAME}</div>${nav}</aside><section class="admin-main"><header class="admin-header">${admin.name} (${admin.email})<button id="logout" class="admin-logout">Logout</button></header><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer></section></div>`,
    script,
  });
}
