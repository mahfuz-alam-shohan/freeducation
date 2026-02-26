import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#080f1b;color:#e9eef8;font:17px/1.52 Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}
.admin-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto}
.admin-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(10px,env(safe-area-inset-top)) 12px 10px;background:rgba(15,23,40,.94);backdrop-filter:blur(10px);border-bottom:1px solid #24344f;min-height:60px}
.admin-header-left{display:flex;align-items:center;gap:9px;min-width:0;flex:1}
.admin-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid #2a3d5c;background:#142036;color:#e9eef8;cursor:pointer;transition:background .42s cubic-bezier(.22,1,.36,1),transform .48s cubic-bezier(.22,1,.36,1),box-shadow .48s cubic-bezier(.22,1,.36,1)}
.admin-menu-toggle:hover{background:#1d2d48;transform:translateY(-1px) scale(1.02)}
.admin-menu-toggle:active{transform:scale(.95)}
body.menu-open .admin-menu-toggle{transform:rotate(180deg) scale(1.03)}
.admin-brand{font-weight:700;font-size:1.03rem;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-brand.admin-brand-legacy{position:relative;display:inline-block;letter-spacing:.06em;text-transform:uppercase;color:#d9e5ff;text-shadow:0 1px 0 #8fa4d7,0 2px 0 #5f739f,0 3px 0 #394b72,0 8px 20px rgba(0,0,0,.42);transform-style:preserve-3d;animation:legacy-float 8.2s cubic-bezier(.45,.04,.55,.96) infinite}
.admin-brand.admin-brand-legacy::before{content:attr(data-brand);position:absolute;inset:0;color:#89b7ff;opacity:.36;transform:translate3d(.7px,2px,-1px);filter:blur(.5px);pointer-events:none;animation:legacy-glow 6.6s ease-in-out infinite}
.admin-header-right{display:flex;align-items:center;gap:8px;position:relative}
.admin-user-meta{display:none;min-width:0;text-align:right;line-height:1.2}
.admin-user-name{display:block;font-size:.82rem;color:#d6dff0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.admin-user-email{display:block;font-size:.77rem;color:#a8b5ca;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.admin-avatar{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;border:1px solid #2a3d5c;background:linear-gradient(180deg,#213354,#172640);color:#f2f6ff;font-size:.82rem;font-weight:700;cursor:pointer;letter-spacing:.02em;transition:transform .52s cubic-bezier(.19,1,.22,1),box-shadow .52s cubic-bezier(.19,1,.22,1),filter .52s cubic-bezier(.19,1,.22,1)}
.admin-avatar:hover{transform:translateY(-1px) scale(1.02);filter:brightness(1.05)}
.admin-avatar:active{transform:scale(.96)}
.admin-logout{display:none;border:1px solid #2a3d5c;border-radius:9px;background:#1c2941;color:#e9eef8;padding:8px 11px;cursor:pointer;white-space:nowrap;align-items:center;gap:6px;font-size:.9rem;transition:background .2s ease,transform .2s ease}
.admin-logout:hover{background:#243654;transform:translateY(-1px)}
.admin-icon{width:17px;height:17px;display:inline-block;flex:0 0 auto}
.admin-nav-overlay{position:fixed;inset:0;background:rgba(3,8,17,.56);opacity:0;visibility:hidden;transition:opacity .56s cubic-bezier(.22,1,.36,1),visibility .56s step-end;z-index:39;backdrop-filter:blur(1.5px)}
.admin-sidebar{position:fixed;z-index:40;left:0;top:0;bottom:0;width:min(272px,86vw);background:#0f1728;border-right:1px solid #24344f;padding:10px;display:grid;grid-template-rows:auto 1fr;gap:10px;transform:translateX(-102%);transition:transform .62s cubic-bezier(.19,1,.22,1),box-shadow .62s cubic-bezier(.19,1,.22,1)}
.admin-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.admin-sidebar-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid #2a3d5c;background:#142036;color:#e9eef8;cursor:pointer;transition:background .2s ease,transform .2s ease}
.admin-nav{display:grid;gap:4px;align-content:start}
.admin-nav a{padding:9px 10px;border-radius:8px;color:#a8b5ca;display:flex;align-items:center;gap:8px;transition:background .42s cubic-bezier(.22,1,.36,1),color .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1)}
.admin-nav a.active,.admin-nav a:hover{background:#172741;color:#e9eef8;transform:translateX(3px)}
.admin-profile-pop{position:absolute;right:0;top:calc(100% + 10px);width:min(280px,86vw);padding:10px;border-radius:12px;border:1px solid #2a3d5c;background:#0f1a2e;box-shadow:0 18px 48px rgba(0,0,0,.42);display:grid;gap:8px;opacity:0;transform:translateY(-14px) scale(.92) rotateX(-10deg);pointer-events:none;transform-origin:top right;transition:opacity .46s cubic-bezier(.22,1,.36,1),transform .58s cubic-bezier(.19,1,.22,1),filter .58s cubic-bezier(.19,1,.22,1);filter:blur(1.5px)}
.admin-profile-name{margin:0;font-weight:650;font-size:.94rem;color:#f0f4ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-profile-email{margin:0;font-size:.82rem;color:#a8b5ca;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-profile-divider{height:1px;background:#21324f}
.admin-profile-logout{height:36px;border:1px solid #2a3d5c;border-radius:8px;background:#1d2c45;color:#e9eef8;display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-size:.9rem}
.admin-profile-logout:hover{background:#253856}
body.profile-open .admin-profile-pop{opacity:1;transform:translateY(0) scale(1) rotateX(0);pointer-events:auto;filter:blur(0)}
.admin-content{padding:11px 11px;display:grid;gap:10px;align-content:start;animation:section-in .74s cubic-bezier(.22,1,.36,1) both;transition:opacity .32s ease,transform .32s ease,filter .32s ease}
.admin-footer{padding:9px 10px max(9px,env(safe-area-inset-bottom));border-top:1px solid #24344f;color:#a8b5ca;background:#0b1424;font-size:.84rem}
body.menu-open{overflow:hidden}
body.menu-open .admin-nav-overlay{opacity:1;visibility:visible}
body.menu-open .admin-sidebar{transform:translateX(0);box-shadow:14px 0 38px rgba(0,0,0,.48)}
body.app-navigating .admin-content{opacity:.55;transform:translateY(3px);filter:saturate(.8)}
.admin-logout:focus-visible,.admin-nav a:focus-visible,.admin-menu-toggle:focus-visible,.admin-sidebar-close:focus-visible,.admin-avatar:focus-visible,.admin-profile-logout:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@keyframes section-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes legacy-float{0%,100%{transform:perspective(520px) rotateX(15deg) rotateY(-5deg) translateY(0)}50%{transform:perspective(520px) rotateX(17deg) rotateY(5deg) translateY(-2px)}}
@keyframes legacy-glow{0%,100%{opacity:.2;filter:blur(.35px)}50%{opacity:.55;filter:blur(.65px)}}
@media (prefers-reduced-motion:reduce){
  .admin-menu-toggle,.admin-avatar,.admin-nav-overlay,.admin-sidebar,.admin-nav a,.admin-profile-pop,.admin-content,.admin-brand.admin-brand-legacy,.admin-brand.admin-brand-legacy::before{animation:none;transition:none}
}
@media (min-width:900px){
  .admin-shell{grid-template-columns:236px minmax(0,1fr);grid-template-rows:auto 1fr auto}
  .admin-header{grid-column:1 / -1;padding:11px 14px;min-height:64px}
  .admin-user-meta{display:block}
  .admin-logout{display:inline-flex}
  .admin-content{padding:12px 14px}
  .admin-footer{grid-column:1 / -1;padding:9px 14px}
  .admin-menu-toggle,.admin-sidebar-close{display:none}
  .admin-nav-overlay{display:none}
  .admin-sidebar{position:sticky;top:64px;align-self:start;transform:none;height:calc(100vh - 64px);width:236px}
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
  const avatarButton = document.getElementById('adminAvatar');
  const profilePanel = document.getElementById('adminProfilePanel');
  const profileLogout = document.getElementById('profileLogout');
  const mainLogout = document.getElementById('logout');

  if (!openButton || !closeButton || !overlay || !sidebar) return;

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const setProfile = (open) => {
    body.classList.toggle('profile-open', open);
    if (avatarButton) avatarButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  openButton.addEventListener('click', () => setMenu(true));
  closeButton.addEventListener('click', () => setMenu(false));
  overlay.addEventListener('click', () => setMenu(false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      setProfile(false);
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', () => setMenu(false));

  if (avatarButton && profilePanel) {
    avatarButton.addEventListener('click', () => setProfile(!body.classList.contains('profile-open')));
    document.addEventListener('click', (event) => {
      if (!body.classList.contains('profile-open')) return;
      if (profilePanel.contains(event.target) || avatarButton.contains(event.target)) return;
      setProfile(false);
    });
  }

  if (profileLogout && mainLogout) {
    profileLogout.addEventListener('click', () => {
      setProfile(false);
      mainLogout.click();
    });
  }

  const setNavigating = () => body.classList.add('app-navigating');

  document.querySelectorAll('a[href]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      const href = anchor.getAttribute('href') || '';
      if (!href || href.startsWith('#') || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      setNavigating();
    });
  });

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', setNavigating);
  });

  window.addEventListener('pageshow', () => {
    body.classList.remove('app-navigating');
    body.classList.remove('profile-open');
  });
})();
`;

const initialsFor = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

export function renderAdminLayout({ title, activeMenu, admin, content, script = "", footerText = "Free education admin panel.", pageClass = "", pageStyles = "" }) {
  const nav = `<nav class="admin-nav">${ADMIN_NAV_ITEMS.map((item) => `<a class="${activeMenu === item.key ? "active" : ""}" href="${item.href}">${item.icon}${item.label}</a>`).join("")}</nav>`;
  const initials = initialsFor(admin?.name);

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${ADMIN_BASE_STYLE}\n${pageStyles}`,
    body: `<div class="admin-shell"><header class="admin-header"><div class="admin-header-left"><button id="adminMenuOpen" class="admin-menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button><div class="admin-brand admin-brand-legacy" data-brand="${APP_NAME}">${APP_NAME}</div></div><div class="admin-header-right"><div class="admin-user-meta"><span class="admin-user-name" title="${admin.name}">${admin.name}</span><span class="admin-user-email" title="${admin.email}">${admin.email}</span></div><button id="adminAvatar" class="admin-avatar" aria-label="Open profile" aria-expanded="false" aria-haspopup="dialog">${initials}</button><button id="logout" class="admin-logout">${ICONS.logout}<span>Logout</span></button><div id="adminProfilePanel" class="admin-profile-pop" role="dialog" aria-label="Profile menu"><p class="admin-profile-name" title="${admin.name}">${admin.name}</p><p class="admin-profile-email" title="${admin.email}">${admin.email}</p><div class="admin-profile-divider"></div><button id="profileLogout" class="admin-profile-logout">${ICONS.logout}<span>Logout</span></button></div></div></header><div id="adminMenuOverlay" class="admin-nav-overlay" aria-hidden="true"></div><aside id="adminSidebar" class="admin-sidebar"><div class="admin-sidebar-head"><div class="admin-brand">Navigation</div><button id="adminMenuClose" class="admin-sidebar-close" aria-label="Close menu">${ICONS.close}</button></div>${nav}</aside><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer></div>`,
    script: `${ADMIN_LAYOUT_SCRIPT}\n${script}`,
  });
}
