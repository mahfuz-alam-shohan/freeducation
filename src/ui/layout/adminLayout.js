import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark;--bg:#0f131a;--surface:#171d26;--surface-soft:#141a22;--surface-strong:#10161e;--text:#edf0f4;--text-muted:#aab2bf;--border:#2d3644;--accent:#b28a58;--accent-ink:#1a1208;--overlay:rgba(6,8,12,.64)}
body[data-theme='light']{color-scheme:light;--bg:#f3f0ea;--surface:#fffdfa;--surface-soft:#f6f2ec;--surface-strong:#ece6dd;--text:#1f2022;--text-muted:#666d76;--border:#d5cfc5;--accent:#8a6640;--accent-ink:#fff8ef;--overlay:rgba(50,43,33,.2)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:17px/1.52 Inter,system-ui,sans-serif;transition:background .25s ease,color .25s ease}
a{text-decoration:none;color:inherit}
.admin-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto}
.admin-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(8px,env(safe-area-inset-top)) 10px 8px;background:color-mix(in srgb,var(--surface-strong) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);min-height:58px}
.admin-header-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
.admin-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;transition:background .25s ease,transform .2s ease}
.admin-menu-toggle:hover{background:var(--surface-soft)}
.admin-menu-toggle:active{transform:scale(.96)}
body.menu-open .admin-menu-toggle{transform:rotate(180deg)}
.admin-brand{font-weight:700;font-size:1.02rem;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-brand.admin-brand-signature{position:relative;display:inline-block;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:800;padding:2px 0 4px;text-shadow:0 0 0 rgba(0,0,0,0),0 0 12px color-mix(in srgb,var(--accent) 50%,transparent);animation:brandPulse 2.9s ease-in-out infinite}
.admin-brand.admin-brand-signature::before{content:'';position:absolute;inset:-3px -8px;border:1px solid color-mix(in srgb,var(--accent) 48%,transparent);border-radius:6px;opacity:.4;pointer-events:none;animation:brandFrame 3.8s linear infinite}
.admin-brand.admin-brand-signature::after{content:'';position:absolute;left:0;bottom:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.95}
@keyframes brandPulse{0%,100%{transform:translateY(0);text-shadow:0 0 10px color-mix(in srgb,var(--accent) 44%,transparent)}50%{transform:translateY(-1px);text-shadow:0 0 16px color-mix(in srgb,var(--accent) 65%,transparent)}}
@keyframes brandFrame{0%{opacity:.26;transform:scale(1)}50%{opacity:.5;transform:scale(1.01)}100%{opacity:.26;transform:scale(1)}}
.admin-header-right{display:flex;align-items:center;gap:8px;position:relative}
.admin-user-meta{display:none;min-width:0;text-align:right;line-height:1.2}
.admin-user-name{display:block;font-size:.82rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.admin-user-email{display:block;font-size:.77rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.admin-avatar{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:.82rem;font-weight:700;cursor:pointer;letter-spacing:.02em;transition:transform .2s ease,background .2s ease}
.admin-avatar:hover{background:var(--surface-soft)}
.admin-avatar:active{transform:scale(.96)}
.admin-logout{display:none;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);padding:7px 10px;cursor:pointer;white-space:nowrap;align-items:center;gap:6px;font-size:.9rem;transition:background .2s ease}
.admin-logout:hover{background:var(--surface-soft)}
.admin-icon{width:17px;height:17px;display:inline-block;flex:0 0 auto}
.admin-nav-overlay{position:fixed;inset:0;background:var(--overlay);opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s step-end;z-index:39}
.admin-sidebar{position:fixed;z-index:40;left:0;top:0;bottom:0;width:min(272px,86vw);background:var(--surface-strong);border-right:1px solid var(--border);padding:10px;display:grid;grid-template-rows:auto 1fr auto;gap:10px;transform:translateX(-102%);transition:transform .3s ease,box-shadow .3s ease}
.admin-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.admin-sidebar-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;transition:background .2s ease}
.admin-nav{display:grid;gap:4px;align-content:start}
.admin-nav a{padding:8px 10px;border-radius:8px;color:var(--text-muted);display:flex;align-items:center;gap:8px;transition:background .2s ease,color .2s ease,transform .24s ease,opacity .24s ease;opacity:.92}
.admin-nav a:nth-child(1){--menu-delay:40ms}.admin-nav a:nth-child(2){--menu-delay:90ms}.admin-nav a:nth-child(3){--menu-delay:140ms}.admin-nav a:nth-child(4){--menu-delay:190ms}.admin-nav a:nth-child(5){--menu-delay:240ms}
.admin-nav a.active,.admin-nav a:hover{background:var(--surface);color:var(--text)}
.admin-theme-wrap{border-top:1px solid var(--border);padding-top:10px}
.admin-theme-toggle{width:100%;height:36px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:.86rem;font-weight:600;letter-spacing:.02em;transition:background .2s ease}
.admin-theme-toggle:hover{background:var(--surface-soft)}
.admin-profile-pop{position:absolute;right:0;top:calc(100% + 10px);width:min(280px,86vw);padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface-strong);box-shadow:0 14px 38px rgba(0,0,0,.24);display:grid;gap:8px;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .22s ease,transform .24s ease}
.admin-profile-name{margin:0;font-weight:650;font-size:.94rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-profile-email{margin:0;font-size:.82rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-profile-divider{height:1px;background:var(--border)}
.admin-profile-logout{height:36px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-size:.9rem}
.admin-profile-logout:hover{background:var(--surface-soft)}
body.profile-open .admin-profile-pop{opacity:1;transform:translateY(0);pointer-events:auto}
.admin-content{padding:9px 10px;display:grid;gap:8px;align-content:start;animation:section-in .32s ease both;transition:opacity .2s ease}
.admin-footer{padding:8px 10px max(8px,env(safe-area-inset-bottom));border-top:1px solid var(--border);color:var(--text-muted);background:var(--surface-strong);font-size:.84rem}
body.menu-open{overflow:hidden}
body.menu-open .admin-nav-overlay{opacity:1;visibility:visible}
body.menu-open .admin-sidebar{transform:translateX(0);box-shadow:10px 0 30px rgba(0,0,0,.28)}
body.menu-open .admin-nav a{animation:menu-item-in .34s ease both;animation-delay:var(--menu-delay,0ms)}
body.app-navigating .admin-content{opacity:.6}
.admin-logout:focus-visible,.admin-nav a:focus-visible,.admin-menu-toggle:focus-visible,.admin-sidebar-close:focus-visible,.admin-avatar:focus-visible,.admin-profile-logout:focus-visible,.admin-theme-toggle:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
@keyframes section-in{from{opacity:0}to{opacity:1}}
@keyframes menu-item-in{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){.admin-menu-toggle,.admin-avatar,.admin-nav-overlay,.admin-sidebar,.admin-nav a,.admin-profile-pop,.admin-content{animation:none;transition:none}}
@media (min-width:900px){
  .admin-shell{grid-template-columns:236px minmax(0,1fr);grid-template-rows:auto 1fr auto}
  .admin-header{grid-column:1 / -1;padding:10px 12px;min-height:62px}
  .admin-user-meta{display:block}
  .admin-logout{display:inline-flex}
  .admin-content{padding:10px 12px}
  .admin-footer{grid-column:1 / -1;padding:8px 12px}
  .admin-menu-toggle,.admin-sidebar-close{display:none}
  .admin-nav-overlay{display:none}
  .admin-sidebar{position:sticky;top:62px;align-self:start;transform:none;height:calc(100vh - 62px);width:236px;animation:desktop-sidebar-in .45s ease both}
  .admin-sidebar .admin-nav a{animation:menu-item-in .36s ease both;animation-delay:var(--menu-delay,0ms)}
  @keyframes desktop-sidebar-in{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
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
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeToggleText');
  const themeStorageKey = 'freeducation-theme';

  const applyTheme = (theme) => {
    const finalTheme = theme === 'light' ? 'light' : 'dark';
    body.setAttribute('data-theme', finalTheme);
    if (themeText) themeText.textContent = finalTheme === 'light' ? 'Use dark theme' : 'Use light theme';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', finalTheme === 'light' ? 'true' : 'false');
    return finalTheme;
  };

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      applyTheme(nextTheme);
      window.localStorage.setItem(themeStorageKey, nextTheme);
    });
  }

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

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', setNavigating);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) return;
    setMenu(false);
    setProfile(false);
  });

  body.classList.remove('app-navigating');
  body.classList.remove('profile-open');
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
    pageStyles: `${ADMIN_BASE_STYLE}
${pageStyles}`,
    body: `<div class="admin-shell"><header class="admin-header"><div class="admin-header-left"><button id="adminMenuOpen" class="admin-menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button><div class="admin-brand admin-brand-signature" data-brand="${APP_NAME}">${APP_NAME}</div></div><div class="admin-header-right"><div class="admin-user-meta"><span class="admin-user-name" title="${admin.name}">${admin.name}</span><span class="admin-user-email" title="${admin.email}">${admin.email}</span></div><button id="adminAvatar" class="admin-avatar" aria-label="Open profile" aria-expanded="false" aria-haspopup="dialog">${initials}</button><button id="logout" class="admin-logout">${ICONS.logout}<span>Logout</span></button><div id="adminProfilePanel" class="admin-profile-pop" role="dialog" aria-label="Profile menu"><p class="admin-profile-name" title="${admin.name}">${admin.name}</p><p class="admin-profile-email" title="${admin.email}">${admin.email}</p><div class="admin-profile-divider"></div><button id="profileLogout" class="admin-profile-logout">${ICONS.logout}<span>Logout</span></button></div></div></header><div id="adminMenuOverlay" class="admin-nav-overlay" aria-hidden="true"></div><aside id="adminSidebar" class="admin-sidebar"><div class="admin-sidebar-head"><div class="admin-brand">Navigation</div><button id="adminMenuClose" class="admin-sidebar-close" aria-label="Close menu">${ICONS.close}</button></div>${nav}<div class="admin-theme-wrap"><button id="themeToggle" class="admin-theme-toggle" type="button" aria-pressed="false"><span>Theme</span><span id="themeToggleText">Use light theme</span></button></div></aside><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer></div>`,
    script: `${ADMIN_LAYOUT_SCRIPT}
${script}`,
  });
}
