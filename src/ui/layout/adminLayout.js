import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#080f1b;color:#e9eef8;font:16px/1.5 Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}
.admin-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto}
.admin-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:max(8px,env(safe-area-inset-top)) 10px 8px;background:rgba(15,23,40,.94);backdrop-filter:blur(8px);border-bottom:1px solid #24344f}
.admin-header-left{display:flex;align-items:center;gap:8px;min-width:0}
.admin-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid #2a3d5c;background:#142036;color:#e9eef8;cursor:pointer}
.admin-menu-toggle:hover{background:#1d2d48}
.admin-brand{font-weight:700;font-size:1rem;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-user{min-width:0;max-width:52vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#a8b5ca;font-size:.82rem}
.admin-logout{border:1px solid #2a3d5c;border-radius:8px;background:#1c2941;color:#e9eef8;padding:7px 10px;cursor:pointer;white-space:nowrap;display:inline-flex;gap:6px;align-items:center}
.admin-logout:hover{background:#243654}
.admin-icon{width:16px;height:16px;display:inline-block;flex:0 0 auto}
.admin-nav-overlay{position:fixed;inset:0;background:rgba(3,8,17,.56);opacity:0;visibility:hidden;transition:opacity .2s ease;z-index:39}
.admin-sidebar{position:fixed;z-index:40;left:0;top:0;bottom:0;width:min(270px,86vw);background:#0f1728;border-right:1px solid #24344f;padding:10px;display:grid;grid-template-rows:auto 1fr;gap:10px;transform:translateX(-100%);transition:transform .2s ease}
.admin-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.admin-sidebar-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid #2a3d5c;background:#142036;color:#e9eef8;cursor:pointer}
.admin-nav{display:grid;gap:4px;align-content:start}
.admin-nav a{padding:8px 10px;border-radius:8px;color:#a8b5ca;display:flex;align-items:center;gap:8px}
.admin-nav a.active,.admin-nav a:hover{background:#172741;color:#e9eef8}
.admin-content{padding:9px;display:grid;gap:9px;align-content:start;animation:section-in .35s ease both}
.admin-footer{padding:8px 10px max(8px,env(safe-area-inset-bottom));border-top:1px solid #24344f;color:#a8b5ca;background:#0b1424;font-size:.82rem}
body.menu-open{overflow:hidden}
body.menu-open .admin-nav-overlay{opacity:1;visibility:visible}
body.menu-open .admin-sidebar{transform:translateX(0)}
.admin-logout:focus-visible,.admin-nav a:focus-visible,.admin-menu-toggle:focus-visible,.admin-sidebar-close:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@keyframes section-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@media (min-width:900px){
  .admin-shell{grid-template-columns:236px minmax(0,1fr);grid-template-rows:auto 1fr auto}
  .admin-header{grid-column:1 / -1;padding:9px 12px}
  .admin-content{padding:10px 12px}
  .admin-footer{grid-column:1 / -1;padding:8px 12px}
  .admin-menu-toggle,.admin-sidebar-close{display:none}
  .admin-nav-overlay{display:none}
  .admin-sidebar{position:sticky;top:52px;align-self:start;transform:none;height:calc(100vh - 52px);width:236px}
}
`;

const icon = (path) => `<svg class="admin-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const ICONS = {
  menu: icon("<path d='M4 7h16M4 12h16M4 17h16' />"),
  close: icon("<path d='M6 6l12 12M18 6L6 18' />"),
  logout: icon("<path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><path d='M16 17l5-5-5-5'/><path d='M21 12H9' />"),
};

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
  const nav = `<nav class="admin-nav">${ADMIN_NAV_ITEMS.map((item) => `<a class="${activeMenu === item.key ? "active" : ""}" href="${item.href}">${item.icon}${item.label}</a>`).join("")}</nav>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${ADMIN_BASE_STYLE}\n${pageStyles}`,
    body: `<div class="admin-shell"><header class="admin-header"><div class="admin-header-left"><button id="adminMenuOpen" class="admin-menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button><div class="admin-brand">${APP_NAME}</div></div><div class="admin-user">${admin.name} (${admin.email})</div><button id="logout" class="admin-logout">${ICONS.logout}<span>Logout</span></button></header><div id="adminMenuOverlay" class="admin-nav-overlay" aria-hidden="true"></div><aside id="adminSidebar" class="admin-sidebar"><div class="admin-sidebar-head"><div class="admin-brand">Navigation</div><button id="adminMenuClose" class="admin-sidebar-close" aria-label="Close menu">${ICONS.close}</button></div>${nav}</aside><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer></div>`,
    script: `${ADMIN_LAYOUT_SCRIPT}\n${script}`,
  });
}
