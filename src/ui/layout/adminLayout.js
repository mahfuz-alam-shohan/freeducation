import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#080f1b;color:#e9eef8;font:14px/1.45 Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}
.admin-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto}
.admin-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;background:#0f1728;border-bottom:1px solid #24344f}
.admin-header-left{display:flex;align-items:center;gap:8px;min-width:0}
.admin-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid #2a3d5c;background:#142036;color:#e9eef8;cursor:pointer}
.admin-menu-toggle:hover{background:#1d2d48}
.admin-brand{font-weight:700;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-user{min-width:0;max-width:52vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#a8b5ca;font-size:12px}
.admin-logout{border:1px solid #2a3d5c;border-radius:8px;background:#1c2941;color:#e9eef8;padding:7px 10px;cursor:pointer;white-space:nowrap}
.admin-logout:hover{background:#243654}
.admin-nav-overlay{position:fixed;inset:0;background:rgba(3,8,17,.56);opacity:0;visibility:hidden;transition:opacity .2s ease;z-index:39}
.admin-sidebar{position:fixed;z-index:40;left:0;top:0;bottom:0;width:min(270px,86vw);background:#0f1728;border-right:1px solid #24344f;padding:12px;display:grid;grid-template-rows:auto 1fr;gap:10px;transform:translateX(-100%);transition:transform .2s ease}
.admin-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.admin-sidebar-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid #2a3d5c;background:#142036;color:#e9eef8;cursor:pointer}
.admin-nav{display:grid;gap:4px;align-content:start}
.admin-nav a{padding:8px 10px;border-radius:8px;color:#a8b5ca}
.admin-nav a.active,.admin-nav a:hover{background:#172741;color:#e9eef8}
.admin-content{padding:10px;display:grid;gap:10px;align-content:start}
.admin-footer{padding:10px 12px;border-top:1px solid #24344f;color:#a8b5ca;background:#0b1424;font-size:12px}
body.menu-open{overflow:hidden}
body.menu-open .admin-nav-overlay{opacity:1;visibility:visible}
body.menu-open .admin-sidebar{transform:translateX(0)}
.admin-logout:focus-visible,.admin-nav a:focus-visible,.admin-menu-toggle:focus-visible,.admin-sidebar-close:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@media (min-width:900px){
  .admin-shell{grid-template-columns:236px minmax(0,1fr);grid-template-rows:auto 1fr auto}
  .admin-header{grid-column:1 / -1;padding:10px 14px}
  .admin-content{padding:12px 14px}
  .admin-footer{grid-column:1 / -1;padding:10px 14px}
  .admin-menu-toggle,.admin-sidebar-close{display:none}
  .admin-nav-overlay{display:none}
  .admin-sidebar{position:sticky;top:54px;align-self:start;transform:none;height:calc(100vh - 54px);width:236px}
}
`;

const ADMIN_LAYOUT_SCRIPT = `
(() => {
  const body = document.body;
  const openButton = document.getElementById('adminMenuOpen');
  const closeButton = document.getElementById('adminMenuClose');
  const overlay = document.getElementById('adminMenuOverlay');
  const sidebar = document.getElementById('adminSidebar');

  if (!openButton || !closeButton || !overlay || !sidebar) return;

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  openButton.addEventListener('click', () => setMenu(true));
  closeButton.addEventListener('click', () => setMenu(false));
  overlay.addEventListener('click', () => setMenu(false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', () => setMenu(false));
})();
`;

export function renderAdminLayout({ title, activeMenu, admin, content, script = "", footerText = "Free education admin panel.", pageClass = "", pageStyles = "" }) {
  const nav = `<nav class="admin-nav">${ADMIN_NAV_ITEMS.map((item) => `<a class="${activeMenu === item.key ? "active" : ""}" href="${item.href}">${item.label}</a>`).join("")}</nav>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${ADMIN_BASE_STYLE}\n${pageStyles}`,
    body: `<div class="admin-shell"><header class="admin-header"><div class="admin-header-left"><button id="adminMenuOpen" class="admin-menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button><div class="admin-brand">${APP_NAME}</div></div><div class="admin-user">${admin.name} (${admin.email})</div><button id="logout" class="admin-logout">Logout</button></header><div id="adminMenuOverlay" class="admin-nav-overlay" aria-hidden="true"></div><aside id="adminSidebar" class="admin-sidebar"><div class="admin-sidebar-head"><div class="admin-brand">Navigation</div><button id="adminMenuClose" class="admin-sidebar-close" aria-label="Close menu">✕</button></div>${nav}</aside><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer></div>`,
    script: `${ADMIN_LAYOUT_SCRIPT}\n${script}`,
  });
}
