import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0b1220;color:#e9eef8;font:14px/1.45 Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}
.admin-shell{min-height:100vh;display:grid;grid-template-columns:1fr}
.admin-sidebar{background:#0f1728;border-bottom:1px solid #24344f;padding:10px;display:grid;gap:8px}
.admin-brand{font-weight:700;letter-spacing:.2px}
.admin-nav{display:flex;gap:6px;flex-wrap:wrap}
.admin-nav a{padding:7px 9px;border-radius:8px;color:#a8b5ca}
.admin-nav a.active,.admin-nav a:hover{background:#172741;color:#e9eef8}
.admin-main{display:grid;grid-template-rows:auto 1fr auto}
.admin-header,.admin-footer{padding:10px;border-bottom:1px solid #24344f}
.admin-footer{border-top:1px solid #24344f;border-bottom:0;color:#a8b5ca}
.admin-header-row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.admin-user{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.admin-content{padding:10px;display:grid;gap:10px}
.admin-logout{border:1px solid #2a3d5c;border-radius:8px;background:#1c2941;color:#e9eef8;padding:7px 10px;cursor:pointer}
.admin-logout:hover{background:#243654}
.admin-logout:focus-visible,.admin-nav a:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@media (min-width:900px){
  .admin-shell{grid-template-columns:220px 1fr}
  .admin-sidebar{border-right:1px solid #24344f;border-bottom:0;align-content:start}
  .admin-nav{display:grid;gap:4px}
}
`;

export function renderAdminLayout({ title, activeMenu, admin, content, script = "", footerText = "Free education admin panel.", pageClass = "", pageStyles = "" }) {
  const nav = `<nav class="admin-nav">${ADMIN_NAV_ITEMS.map((item) => `<a class="${activeMenu === item.key ? "active" : ""}" href="${item.href}">${item.label}</a>`).join("")}</nav>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${ADMIN_BASE_STYLE}\n${pageStyles}`,
    body: `<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-brand">${APP_NAME}</div>${nav}</aside><section class="admin-main"><header class="admin-header"><div class="admin-header-row"><div class="admin-user">${admin.name} (${admin.email})</div><button id="logout" class="admin-logout">Logout</button></div></header><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer></section></div>`,
    script,
  });
}
