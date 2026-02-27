import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_ITEMS } from "../config/navigation.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark;--bg:#0f131a;--surface:#171d26;--surface-soft:#141a22;--surface-strong:#10161e;--text:#edf0f4;--text-muted:#aab2bf;--border:#2d3644;--accent:#b28a58;--accent-ink:#1a1208;--overlay:rgba(6,8,12,.64);--motion-spring:cubic-bezier(.22,.82,.31,1);--motion-swift:cubic-bezier(.3,.7,.2,1);--motion-smooth:cubic-bezier(.22,.61,.36,1);--pointer-x:50%;--pointer-y:12%}
body[data-theme='light']{color-scheme:light;--bg:#f3f0ea;--surface:#fffdfa;--surface-soft:#f6f2ec;--surface-strong:#ece6dd;--text:#1f2022;--text-muted:#666d76;--border:#d5cfc5;--accent:#8a6640;--accent-ink:#fff8ef;--overlay:rgba(50,43,33,.2)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:17px/1.52 Inter,system-ui,sans-serif;transition:background .25s ease,color .25s ease}
a{text-decoration:none;color:inherit}
::view-transition-old(root),::view-transition-new(root){animation-duration:.34s;animation-timing-function:cubic-bezier(.22,.61,.36,1)}
::view-transition-old(root){animation-name:page-out-forward}
::view-transition-new(root){animation-name:page-in-forward}
html[data-nav-motion='back']::view-transition-old(root){animation-name:page-out-back}
html[data-nav-motion='back']::view-transition-new(root){animation-name:page-in-back}
.admin-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;position:relative}
.admin-shell::before{content:'';position:fixed;inset:0;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--accent) 20%,transparent),transparent 50%);transition:opacity .4s ease;z-index:20}
body.app-navigating .admin-shell::before{opacity:.42}
.admin-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(8px,env(safe-area-inset-top)) 8px 8px;background:color-mix(in srgb,var(--surface-strong) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);min-height:58px;transform:perspective(900px) rotateX(var(--header-tilt-x,0deg)) rotateY(var(--header-tilt-y,0deg));transform-origin:center top;transition:transform .44s var(--motion-spring),border-color .25s ease}
.admin-header::after{content:'';position:absolute;inset:auto 0 -1px;height:1px;background:radial-gradient(circle at var(--pointer-x) 50%,color-mix(in srgb,var(--accent) 70%,transparent),transparent 55%);opacity:.58;pointer-events:none;transition:opacity .28s ease}
.admin-header-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
.admin-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;transition:background .25s ease,transform .2s ease}
.admin-menu-toggle:hover{background:var(--surface-soft)}
.admin-menu-toggle:active{transform:scale(.96)}
body.menu-open .admin-menu-toggle{transform:rotate(180deg)}
.admin-brand{font-weight:700;font-size:1.02rem;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-brand.admin-brand-signature{position:relative;display:inline-block;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:800;padding:2px 0 4px;text-shadow:0 0 12px color-mix(in srgb,var(--accent) 52%,transparent);user-select:none;border:0;background:none;cursor:pointer}
.admin-brand.admin-brand-signature::before{content:'';position:absolute;inset:-4px -10px;border:1px solid color-mix(in srgb,var(--accent) 60%,transparent);border-radius:8px;opacity:.48;pointer-events:none;animation:brandFrame 2.8s ease-in-out infinite}
.admin-brand.admin-brand-signature::after{content:'';position:absolute;left:-4px;bottom:-1px;width:calc(100% + 8px);height:2px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--accent) 70%,#fff),transparent);opacity:.95;filter:blur(.2px);animation:brandGlow 2.4s ease-in-out infinite}
@keyframes brandFrame{0%,100%{opacity:.32;box-shadow:0 0 0 color-mix(in srgb,var(--accent) 0%,transparent)}50%{opacity:.72;box-shadow:0 0 18px color-mix(in srgb,var(--accent) 44%,transparent)}}
@keyframes brandGlow{0%,100%{opacity:.7;transform:scaleX(.95)}50%{opacity:1;transform:scaleX(1.02)}}
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
.admin-nav-overlay{position:fixed;inset:0;background:transparent;opacity:0;visibility:hidden;transition:visibility .2s step-end;z-index:39}
.admin-sidebar{position:fixed;z-index:40;left:0;top:0;bottom:0;width:min(272px,86vw);background:var(--surface-strong);border-right:1px solid var(--border);padding:10px;display:grid;grid-template-rows:auto 1fr auto;gap:10px;transform:translate3d(-102%,0,0) perspective(1000px) rotateY(var(--sidebar-tilt,0deg));transition:transform .42s var(--motion-spring),border-color .24s ease;will-change:transform;backface-visibility:hidden;contain:paint}
.admin-sidebar::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--pointer-x) var(--pointer-y),color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%);opacity:.6;transition:opacity .26s ease}
.admin-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.admin-sidebar-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;transition:background .2s ease}
.admin-nav{display:grid;gap:4px;align-content:start}
.admin-nav a{padding:8px 10px;border-radius:8px;color:var(--text-muted);display:flex;align-items:center;gap:8px;transition:background .22s ease,color .22s ease,transform .42s var(--motion-spring),opacity .42s ease,box-shadow .3s ease;opacity:.92;transform:translateX(-3px)}
.admin-nav a:nth-child(1){--menu-delay:90ms}.admin-nav a:nth-child(2){--menu-delay:160ms}.admin-nav a:nth-child(3){--menu-delay:230ms}.admin-nav a:nth-child(4){--menu-delay:300ms}.admin-nav a:nth-child(5){--menu-delay:370ms}
.admin-nav a.active,.admin-nav a:hover{background:var(--surface);color:var(--text);transform:translateX(0);box-shadow:0 5px 14px color-mix(in srgb,var(--accent) 16%,transparent)}
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
.admin-content{padding:6px 6px 8px;display:grid;gap:6px;align-content:start;animation:section-in .24s var(--motion-swift) both;transition:opacity .2s ease;min-height:220px}
.admin-content > *{animation:content-float-in .36s var(--motion-smooth) both;animation-delay:calc(var(--content-seq,0) * 32ms);transform-origin:50% 0}
.admin-content > *:nth-child(1){--content-seq:1}.admin-content > *:nth-child(2){--content-seq:2}.admin-content > *:nth-child(3){--content-seq:3}.admin-content > *:nth-child(4){--content-seq:4}.admin-content > *:nth-child(5){--content-seq:5}.admin-content > *:nth-child(n+6){--content-seq:6}
.admin-footer{padding:8px 8px max(8px,env(safe-area-inset-bottom));border-top:1px solid var(--border);color:var(--text-muted);background:var(--surface-strong);font-size:.84rem}
.admin-status-toast{position:fixed;left:50%;bottom:16px;transform:translate(-50%,20px);min-width:min(320px,88vw);max-width:min(440px,92vw);padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 92%,transparent);color:var(--text);opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;z-index:70;box-shadow:0 12px 30px rgba(0,0,0,.2)}
.admin-status-toast.is-visible{opacity:1;transform:translate(-50%,0)}
.admin-status-toast[data-status='error']{border-color:#c76167;color:#ffd8dc}
.admin-status-toast[data-status='success']{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
body.menu-open{overflow:hidden}
body.menu-open .admin-nav-overlay{visibility:visible}
body.menu-open .admin-sidebar{transform:translate3d(0,0,0)}
body.menu-open .admin-nav a{animation:menu-item-in .56s cubic-bezier(.18,.75,.25,1) both;animation-delay:var(--menu-delay,0ms)}
body.app-navigating .admin-content{opacity:.78}
body.app-navigating .admin-content::after{content:'Loading content...';display:block;border:1px dashed var(--border);background:var(--surface);color:var(--text-muted);font-size:.84rem;padding:6px 8px;border-radius:8px}
.admin-logout:focus-visible,.admin-nav a:focus-visible,.admin-menu-toggle:focus-visible,.admin-sidebar-close:focus-visible,.admin-avatar:focus-visible,.admin-profile-logout:focus-visible,.admin-theme-toggle:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
@keyframes section-in{from{opacity:0}to{opacity:1}}
@keyframes content-float-in{from{opacity:0;transform:translate3d(0,8px,0) scale(.994);filter:blur(1.2px)}to{opacity:1;transform:translate3d(0,0,0) scale(1);filter:blur(0)}}
@keyframes page-out-forward{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:.18;transform:translateX(-3.5%) scale(.99)}}
@keyframes page-in-forward{from{opacity:0;transform:translateX(4.5%) scale(.995)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes page-out-back{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:.22;transform:translateX(3%) scale(.992)}}
@keyframes page-in-back{from{opacity:0;transform:translateX(-4%) scale(.995)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes menu-item-in{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){.admin-menu-toggle,.admin-avatar,.admin-nav-overlay,.admin-sidebar,.admin-nav a,.admin-profile-pop,.admin-content,.admin-content > *,.admin-shell::before,::view-transition-old(root),::view-transition-new(root){animation:none;transition:none}}
@media (min-width:900px){
  .admin-shell{grid-template-columns:236px minmax(0,1fr);grid-template-rows:auto 1fr auto}
  .admin-header{grid-column:1 / -1;padding:10px 8px;min-height:62px}
  .admin-user-meta{display:block}
  .admin-logout{display:inline-flex}
  .admin-content{padding:8px}
  .admin-footer{grid-column:1 / -1;padding:8px}
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
  const listenerController = new AbortController();
  const { signal } = listenerController;
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => listenerController.abort());
  }

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
  const brandHome = document.getElementById('adminBrandHome');
  const statusToast = document.getElementById('adminStatusToast');
  const header = document.querySelector('.admin-header');
  const canAnimateMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let statusTimer;

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
    }, { signal });
  }

  if (brandHome) {
    brandHome.addEventListener('click', () => {
      if (window.__appNavigate) window.__appNavigate('/admin/dashboard');
      else window.location.href = '/admin/dashboard';
    }, { signal });
  }

  if (canAnimateMotion && header && sidebar) {
    const updatePointer = (event, element, tiltMultiplier = 1) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      body.style.setProperty('--pointer-x', `${Math.max(0, Math.min(100, x)).toFixed(2)}%`);
      body.style.setProperty('--pointer-y', `${Math.max(0, Math.min(100, y)).toFixed(2)}%`);
      const tiltX = (((y - 50) / 50) * -1.5 * tiltMultiplier).toFixed(2);
      const tiltY = (((x - 50) / 50) * 2.3 * tiltMultiplier).toFixed(2);
      body.style.setProperty('--header-tilt-x', `${tiltX}deg`);
      body.style.setProperty('--header-tilt-y', `${tiltY}deg`);
      body.style.setProperty('--sidebar-tilt', `${(tiltY * 0.75).toFixed(2)}deg`);
    };

    const resetPointer = () => {
      body.style.setProperty('--pointer-x', '50%');
      body.style.setProperty('--pointer-y', '12%');
      body.style.setProperty('--header-tilt-x', '0deg');
      body.style.setProperty('--header-tilt-y', '0deg');
      body.style.setProperty('--sidebar-tilt', '0deg');
    };

    header.addEventListener('pointermove', (event) => updatePointer(event, header, 1), { signal });
    sidebar.addEventListener('pointermove', (event) => updatePointer(event, sidebar, 0.6), { signal });
    header.addEventListener('pointerleave', resetPointer, { signal });
    sidebar.addEventListener('pointerleave', resetPointer, { signal });
  }

  window.__showAppStatus = (message, kind = 'info', holdMs = 2600) => {
    if (!statusToast) return;
    statusToast.textContent = message || '';
    statusToast.dataset.status = kind;
    statusToast.classList.add('is-visible');
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => statusToast.classList.remove('is-visible'), holdMs);
  };

  if (!openButton || !closeButton || !overlay || !sidebar) return;

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const setProfile = (open) => {
    body.classList.toggle('profile-open', open);
    if (avatarButton) avatarButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  openButton.addEventListener('click', () => setMenu(true), { signal });
  closeButton.addEventListener('click', () => setMenu(false), { signal });
  overlay.addEventListener('click', () => setMenu(false), { signal });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      setProfile(false);
    }
  }, { signal });

  const desktopMedia = window.matchMedia('(min-width: 900px)');
  desktopMedia.addEventListener('change', () => setMenu(false), { signal });

  if (avatarButton && profilePanel) {
    avatarButton.addEventListener('click', () => setProfile(!body.classList.contains('profile-open')), { signal });
    document.addEventListener('click', (event) => {
      if (!body.classList.contains('profile-open')) return;
      if (profilePanel.contains(event.target) || avatarButton.contains(event.target)) return;
      setProfile(false);
    }, { signal });
  }

  if (profileLogout && mainLogout) {
    profileLogout.addEventListener('click', () => {
      setProfile(false);
      mainLogout.click();
    }, { signal });
  }

  const setNavigating = () => body.classList.add('app-navigating');

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', setNavigating, { signal });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) return;
    setMenu(false);
    setProfile(false);
    body.classList.add('app-navigating');
  }, { signal });

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
    body: `<div class="admin-shell"><header class="admin-header"><div class="admin-header-left"><button id="adminMenuOpen" class="admin-menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button><button id="adminBrandHome" class="admin-brand admin-brand-signature" type="button" aria-label="Go to dashboard" data-brand="${APP_NAME}">${APP_NAME}</button></div><div class="admin-header-right"><div class="admin-user-meta"><span class="admin-user-name" title="${admin.name}">${admin.name}</span><span class="admin-user-email" title="${admin.email}">${admin.email}</span></div><button id="adminAvatar" class="admin-avatar" aria-label="Open profile" aria-expanded="false" aria-haspopup="dialog">${initials}</button><button id="logout" class="admin-logout">${ICONS.logout}<span>Logout</span></button><div id="adminProfilePanel" class="admin-profile-pop" role="dialog" aria-label="Profile menu"><p class="admin-profile-name" title="${admin.name}">${admin.name}</p><p class="admin-profile-email" title="${admin.email}">${admin.email}</p><div class="admin-profile-divider"></div><button id="profileLogout" class="admin-profile-logout">${ICONS.logout}<span>Logout</span></button></div></div></header><div id="adminMenuOverlay" class="admin-nav-overlay" aria-hidden="true"></div><aside id="adminSidebar" class="admin-sidebar"><div class="admin-sidebar-head"><div class="admin-brand">Navigation</div><button id="adminMenuClose" class="admin-sidebar-close" aria-label="Close menu">${ICONS.close}</button></div>${nav}<div class="admin-theme-wrap"><button id="themeToggle" class="admin-theme-toggle" type="button" aria-pressed="false"><span>Theme</span><span id="themeToggleText">Use light theme</span></button></div></aside><main class="admin-content">${content}</main><footer class="admin-footer">${footerText}</footer><div id="adminStatusToast" class="admin-status-toast" role="status" aria-live="polite"></div></div>`,
    script: `${ADMIN_LAYOUT_SCRIPT}
${script}`,
  });
}
