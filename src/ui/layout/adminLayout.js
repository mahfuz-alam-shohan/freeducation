import { APP_NAME } from "../../config.js";
import { ADMIN_NAV_SECTIONS } from "../config/navigation.js";
import { globalFooterText } from "./footer.js";
import { renderDocument } from "./document.js";

const ADMIN_BASE_STYLE = `
:root{color-scheme:dark;--bg:#0f131a;--surface:#171d26;--surface-soft:#141a22;--surface-strong:#10161e;--text:#edf0f4;--text-muted:#aab2bf;--border:#2d3644;--accent:#b28a58;--accent-ink:#1a1208;--overlay:rgba(6,8,12,.64);--motion-spring:cubic-bezier(.22,.82,.31,1);--motion-swift:cubic-bezier(.3,.7,.2,1);--motion-smooth:cubic-bezier(.22,.61,.36,1);--pointer-x:50%;--pointer-y:12%;--page-content-max:1100px;--page-form-max:560px}
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
.admin-brand{display:inline-flex;align-items:center;justify-content:center;width:212px;max-width:62vw;height:46px;max-height:50px}
.admin-brand.admin-brand-signature{position:relative;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;color:var(--accent);user-select:none;border:0;background:none;cursor:pointer}
.admin-brand-svg{width:100%;height:100%;display:block;filter:drop-shadow(0 3px 9px color-mix(in srgb,var(--accent) 40%,transparent));overflow:visible}
.admin-brand-word{font-family:'Comic Sans MS','Trebuchet MS','Segoe Print','Avenir Next','Segoe UI',sans-serif;font-weight:800;letter-spacing:.75px}
.admin-brand-word-shadow{fill:color-mix(in srgb,var(--accent) 24%,#000)}
.admin-brand-word-extrude{fill:color-mix(in srgb,var(--accent) 62%,#2f2012)}
.admin-brand-word-front{fill:url(#adminBrandWordGradient);stroke:color-mix(in srgb,var(--accent) 62%,#fff);stroke-width:.45;paint-order:stroke fill}
.admin-brand-doodle{fill:none;stroke:color-mix(in srgb,var(--accent) 78%,#fff);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;opacity:.88}
.admin-brand-doodle-secondary{fill:none;stroke:color-mix(in srgb,var(--accent) 66%,#fff);stroke-width:1.05;stroke-linecap:round;stroke-linejoin:round;opacity:.74}
.admin-brand-doodle-guide{fill:none;stroke:color-mix(in srgb,var(--accent) 52%,#fff);stroke-width:.85;stroke-linecap:round;stroke-linejoin:round;opacity:.6;stroke-dasharray:1.2 3.2}
.admin-brand-spark{fill:color-mix(in srgb,var(--accent) 84%,#fff);opacity:.86}
.admin-header-right{display:flex;align-items:center;gap:8px;position:relative}
.admin-user-meta{display:none;min-width:0;text-align:right;line-height:1.2}
.admin-user-name{display:block;font-size:.82rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.admin-user-email{display:block;font-size:.77rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.admin-avatar{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:.82rem;font-weight:700;cursor:pointer;letter-spacing:.02em;transition:transform .2s ease,background .2s ease;overflow:hidden;padding:0;position:relative}
.admin-avatar [hidden]{display:none!important}
.admin-avatar-image{width:100%;height:100%;object-fit:cover;display:block}
.admin-avatar-fallback{display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%}
.admin-avatar-loader{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .2s ease;background:linear-gradient(90deg,var(--surface-soft),color-mix(in srgb,var(--accent) 22%,var(--surface-soft)),var(--surface-soft));background-size:220% 100%}
.admin-avatar.is-loading .admin-avatar-loader{opacity:1;animation:avatar-skeleton 1s linear infinite}
@keyframes avatar-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}
.admin-avatar:hover{background:var(--surface-soft)}
.admin-avatar:active{transform:scale(.96)}
.admin-logout{display:none;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);padding:7px 10px;cursor:pointer;white-space:nowrap;align-items:center;gap:6px;font-size:.9rem;transition:background .2s ease}
.admin-logout:hover{background:var(--surface-soft)}
.admin-icon{width:17px;height:17px;display:inline-block;flex:0 0 auto}
.admin-nav-overlay{position:fixed;inset:0;background:transparent;opacity:0;visibility:hidden;transition:visibility .2s step-end;z-index:39}
.admin-sidebar{position:fixed;z-index:40;left:0;top:0;bottom:0;width:min(272px,86vw);background:var(--surface-strong);border-right:1px solid var(--border);padding:10px;display:grid;grid-template-rows:auto 1fr auto;gap:10px;transform:translate3d(-102%,0,0) perspective(1000px) rotateY(var(--sidebar-tilt,0deg));transition:transform .42s var(--motion-spring),border-color .24s ease;will-change:transform;backface-visibility:hidden;contain:paint}
.admin-sidebar::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--pointer-x) var(--pointer-y),color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%);opacity:.6;transition:opacity .26s ease}
.admin-sidebar-head{display:flex;align-items:center;justify-content:flex-end;min-height:30px}
.admin-sidebar-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;transition:background .2s ease}
.admin-nav{display:grid;gap:10px;align-content:start}
.admin-nav-section{display:grid;gap:4px}
.admin-nav-title{margin:0;padding:0 4px;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted)}
.admin-nav-links{display:grid;gap:4px}
.admin-nav a{padding:8px 10px;border-radius:8px;color:var(--text-muted);display:flex;align-items:center;gap:8px;transition:background .22s ease,color .22s ease,transform .42s var(--motion-spring),opacity .42s ease,box-shadow .3s ease,border-color .2s ease;opacity:.92;transform:translateX(-3px);border:1px solid transparent}
.admin-nav a.active,.admin-nav a:hover{background:var(--surface);color:var(--text);transform:translateX(0);box-shadow:0 5px 14px color-mix(in srgb,var(--accent) 16%,transparent)}
.admin-nav a.admin-nav-highlight{color:color-mix(in srgb,var(--accent) 70%,#fff);border-color:color-mix(in srgb,var(--accent) 40%,var(--border));background:color-mix(in srgb,var(--accent) 16%,var(--surface-soft));box-shadow:0 0 0 1px color-mix(in srgb,var(--accent) 18%,transparent)}
.admin-nav a.admin-nav-highlight.active,.admin-nav a.admin-nav-highlight:hover{background:color-mix(in srgb,var(--accent) 25%,var(--surface));color:var(--text)}
.admin-theme-wrap{border-top:1px solid var(--border);padding-top:10px}
.admin-theme-toggle{position:relative;isolation:isolate;width:100%;min-height:44px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;padding:4px 8px 4px 6px;cursor:pointer;font-size:.84rem;font-weight:600;letter-spacing:.02em;transition:background .2s ease,border-color .2s ease,transform .2s var(--motion-swift)}
.admin-theme-toggle::before{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(120deg,color-mix(in srgb,var(--accent) 18%,transparent),transparent 45%);opacity:0;transition:opacity .28s ease;z-index:-1}
.admin-theme-toggle:hover{background:var(--surface-soft);border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}
.admin-theme-toggle:hover::before,.admin-theme-toggle[data-theme-state='switching']::before{opacity:.9}
.admin-theme-toggle:active{transform:scale(.985)}
.admin-theme-orb{position:relative;display:inline-grid;place-items:center;width:30px;height:30px;border-radius:999px;border:1px solid color-mix(in srgb,var(--accent) 55%,var(--border));background:color-mix(in srgb,var(--surface) 78%,var(--accent) 22%);overflow:hidden;transition:transform .36s var(--motion-smooth),background .28s ease,border-color .22s ease}
.admin-theme-orb svg{position:absolute;width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:opacity .3s ease,transform .34s var(--motion-smooth),filter .28s ease}
.admin-theme-sun{color:var(--accent);opacity:0;transform:scale(.52) rotate(-38deg);filter:blur(2px)}
.admin-theme-moon{color:var(--text);opacity:1;transform:scale(1) rotate(0deg)}
body[data-theme='light'] .admin-theme-orb{background:color-mix(in srgb,var(--surface) 74%,var(--accent) 26%)}
body[data-theme='light'] .admin-theme-sun{opacity:1;transform:scale(1) rotate(0deg);filter:blur(0)}
body[data-theme='light'] .admin-theme-moon{opacity:0;transform:scale(.58) rotate(36deg);filter:blur(2px)}
.admin-theme-copy{display:grid;line-height:1.1;text-align:left;gap:2px;min-width:0}
.admin-theme-copy > span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-theme-label{font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);font-weight:700}
.admin-theme-text{font-size:.86rem;color:var(--text)}
.admin-theme-chip{justify-self:end;min-width:62px;padding:4px 8px;border-radius:999px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-muted);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;text-align:center;transition:background .22s ease,color .22s ease,border-color .22s ease}
.admin-theme-toggle[data-theme-state='switching']{cursor:progress}
.admin-theme-toggle[data-theme-state='switching'] .admin-theme-chip{color:var(--text);border-color:color-mix(in srgb,var(--accent) 44%,var(--border));background:color-mix(in srgb,var(--accent) 18%,var(--surface-soft));animation:theme-chip-pulse .7s ease-in-out infinite}
.admin-theme-toggle[data-theme-state='switching'] .admin-theme-orb{animation:theme-orb-spin .9s var(--motion-swift) infinite}
@keyframes theme-chip-pulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
@keyframes theme-orb-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.admin-profile-pop{position:absolute;right:0;top:calc(100% + 10px);width:min(280px,86vw);padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface-strong);box-shadow:0 14px 38px rgba(0,0,0,.24);display:grid;gap:8px;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .22s ease,transform .24s ease}
.admin-profile-name{margin:0;font-weight:650;font-size:.94rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-profile-email{margin:0;font-size:.82rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-profile-divider{height:1px;background:var(--border)}
.admin-profile-logout,.admin-profile-login{height:36px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-size:.9rem}
.admin-profile-logout:hover,.admin-profile-login:hover{background:var(--surface-soft)}
.admin-profile-help{margin:0;font-size:.82rem;color:var(--text-muted);line-height:1.4}
body.profile-open .admin-profile-pop{opacity:1;transform:translateY(0);pointer-events:auto}
.admin-content{padding:6px 6px 8px;display:grid;gap:6px;align-content:start;animation:section-in .24s var(--motion-swift) both;transition:opacity .2s ease;min-height:220px}
.admin-content > *{animation:content-float-in .36s var(--motion-smooth) both;animation-delay:calc(var(--content-seq,0) * 32ms);transform-origin:50% 0;width:100%}
.admin-content > *:nth-child(1){--content-seq:1}.admin-content > *:nth-child(2){--content-seq:2}.admin-content > *:nth-child(3){--content-seq:3}.admin-content > *:nth-child(4){--content-seq:4}.admin-content > *:nth-child(5){--content-seq:5}.admin-content > *:nth-child(n+6){--content-seq:6}
.admin-content.admin-content-flush{padding:0;gap:0}
.admin-footer{padding:8px 8px max(8px,env(safe-area-inset-bottom));border-top:1px solid var(--border);color:var(--text-muted);background:var(--surface-strong);font-size:.84rem}
.admin-status-toast{position:fixed;left:50%;bottom:16px;transform:translate(-50%,20px);min-width:min(320px,88vw);max-width:min(440px,92vw);padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 92%,transparent);color:var(--text);opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;z-index:70;box-shadow:0 12px 30px rgba(0,0,0,.2)}
.admin-status-toast.is-visible{opacity:1;transform:translate(-50%,0)}
.admin-status-toast[data-status='error']{border-color:#c76167;color:#ffd8dc}
.admin-status-toast[data-status='success']{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
body.menu-open{overflow:hidden}
body.menu-open .admin-nav-overlay{visibility:visible}
body.menu-open .admin-sidebar{transform:translate3d(0,0,0)}
body.menu-open .admin-nav a{animation:menu-item-in .56s cubic-bezier(.18,.75,.25,1) both}
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
@media (prefers-reduced-motion:reduce){.admin-menu-toggle,.admin-avatar,.admin-nav-overlay,.admin-sidebar,.admin-nav a,.admin-profile-pop,.admin-content,.admin-content > *,.admin-shell::before,.admin-theme-toggle,.admin-theme-orb,.admin-theme-orb svg,.admin-theme-chip,::view-transition-old(root),::view-transition-new(root){animation:none;transition:none}}
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
  const avatarImage = document.getElementById('adminAvatarImage');
  const avatarFallback = document.getElementById('adminAvatarFallback');
  let activeAvatarVersion = '';
  const profilePanel = document.getElementById('adminProfilePanel');
  const profileLogout = document.getElementById('profileLogout');
  const mainLogout = document.getElementById('logout');
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeToggleText');
  const themeChip = document.getElementById('themeToggleChip');
  const themeStorageKey = 'freeducation-theme';
  const avatarVersionStorageKey = 'freeducation-avatar-version';
  const brandHome = document.getElementById('adminBrandHome');
  const statusToast = document.getElementById('adminStatusToast');
  const header = document.querySelector('.admin-header');
  const canAnimateMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let themeSwitching = false;
  let statusTimer;

  const applyTheme = (theme) => {
    const finalTheme = theme === 'light' ? 'light' : 'dark';
    body.setAttribute('data-theme', finalTheme);
    if (themeText) themeText.textContent = finalTheme === 'light' ? 'Light mode on' : 'Dark mode on';
    if (themeChip) themeChip.textContent = finalTheme === 'light' ? 'Light' : 'Dark';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', finalTheme === 'light' ? 'true' : 'false');
    return finalTheme;
  };

  const setThemeState = (state = 'idle') => {
    if (!themeToggle) return;
    const nextState = state === 'switching' ? 'switching' : 'idle';
    themeToggle.dataset.themeState = nextState;
    themeToggle.setAttribute('aria-busy', nextState === 'switching' ? 'true' : 'false');
  };

  const waitForThemeMotion = () => new Promise((resolve) => {
    if (!canAnimateMotion) {
      resolve();
      return;
    }
    window.setTimeout(resolve, 240);
  });

  const switchTheme = async (targetTheme) => {
    if (themeSwitching) return;
    const nextTheme = targetTheme === 'light' ? 'light' : 'dark';
    const currentTheme = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    if (currentTheme === nextTheme) return;

    themeSwitching = true;
    setThemeState('switching');

    const runUpdate = () => {
      applyTheme(nextTheme);
      window.localStorage.setItem(themeStorageKey, nextTheme);
    };

    try {
      if (document.startViewTransition && canAnimateMotion) {
        await document.startViewTransition(() => runUpdate()).finished.catch(() => {});
      } else {
        runUpdate();
      }
      await waitForThemeMotion();
    } finally {
      themeSwitching = false;
      setThemeState('idle');
    }
  };

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  applyTheme(savedTheme);
  setThemeState('idle');

  if (themeToggle) {
    themeToggle.addEventListener('click', async () => {
      const isLight = body.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      await switchTheme(nextTheme);
    }, { signal });
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== themeStorageKey) return;
    applyTheme(String(event.newValue || '').trim());
  }, { signal });

  const setAvatarState = (state = 'fallback') => {
    if (!avatarButton) return;
    const nextState = state === 'image' || state === 'loading' ? state : 'fallback';
    avatarButton.classList.toggle('is-loading', nextState === 'loading');
    avatarButton.setAttribute('aria-busy', nextState === 'loading' ? 'true' : 'false');
    if (avatarImage) avatarImage.hidden = nextState !== 'image';
    if (avatarFallback) avatarFallback.hidden = nextState === 'image';
  };

  const loadAvatar = (version = '', persistVersion = false) => {
    if (!avatarImage || !avatarButton) return;
    const nextVersion = String(version || '').trim();
    activeAvatarVersion = nextVersion;
    if (!nextVersion) {
      avatarImage.removeAttribute('src');
      setAvatarState('fallback');
      return;
    }

    if (persistVersion) window.localStorage.setItem(avatarVersionStorageKey, nextVersion);
    avatarButton.dataset.avatarVersion = nextVersion;
    setAvatarState('loading');
    avatarImage.src = '/api/admin/profile/image/avatar?v=' + encodeURIComponent(nextVersion);
  };

  if (avatarImage) {
    avatarImage.addEventListener('load', () => {
      const currentVersion = (avatarButton?.dataset.avatarVersion || '').trim();
      if (!currentVersion || currentVersion !== activeAvatarVersion) return;
      setAvatarState('image');
    }, { signal });
    avatarImage.addEventListener('error', () => setAvatarState('fallback'), { signal });
  }

  const initialAvatarVersion = (avatarButton?.dataset.avatarVersion || '').trim() || (window.localStorage.getItem(avatarVersionStorageKey) || '').trim();
  if (initialAvatarVersion) {
    loadAvatar(initialAvatarVersion, true);
  } else {
    setAvatarState('fallback');
  }

  window.addEventListener('freeducation:avatar-updated', (event) => {
    const nextVersion = String(event?.detail?.version || Date.now());
    loadAvatar(nextVersion, true);
  }, { signal });

  window.addEventListener('storage', (event) => {
    if (event.key !== avatarVersionStorageKey) return;
    const nextVersion = String(event.newValue || '').trim();
    if (!nextVersion) {
      loadAvatar('', false);
      return;
    }
    loadAvatar(nextVersion, false);
  }, { signal });

  if (brandHome) {
    const homeHref = brandHome.dataset.home || '/admin/dashboard';
    brandHome.addEventListener('click', () => {
      if (window.__appNavigate) window.__appNavigate(homeHref);
      else window.location.href = homeHref;
    }, { signal });
  }

  if (canAnimateMotion && header && sidebar) {
    const updatePointer = (event, element, tiltMultiplier = 1) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      body.style.setProperty('--pointer-x', Math.max(0, Math.min(100, x)).toFixed(2) + '%');
      body.style.setProperty('--pointer-y', Math.max(0, Math.min(100, y)).toFixed(2) + '%');
      const tiltX = (((y - 50) / 50) * -1.5 * tiltMultiplier).toFixed(2);
      const tiltY = (((x - 50) / 50) * 2.3 * tiltMultiplier).toFixed(2);
      body.style.setProperty('--header-tilt-x', tiltX + 'deg');
      body.style.setProperty('--header-tilt-y', tiltY + 'deg');
      body.style.setProperty('--sidebar-tilt', (tiltY * 0.75).toFixed(2) + 'deg');
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
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) setProfile(false);
  };

  const setProfile = (open) => {
    body.classList.toggle('profile-open', open);
    if (avatarButton) avatarButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (profilePanel) profilePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) setMenu(false);
  };

  openButton.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')), { signal });
  closeButton.addEventListener('click', () => setMenu(false), { signal });
  overlay.addEventListener('click', () => setMenu(false), { signal });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      setProfile(false);
    }
  }, { signal });

  const desktopMedia = window.matchMedia('(min-width: 900px)');
  if (typeof desktopMedia.addEventListener === 'function') {
    desktopMedia.addEventListener('change', () => setMenu(false), { signal });
  } else if (typeof desktopMedia.addListener === 'function') {
    desktopMedia.addListener(() => setMenu(false));
  }

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

  if (mainLogout) {
    mainLogout.addEventListener('click', async () => {
      setProfile(false);
      setNavigating(1800);
      await fetch('/api/logout', { method: 'POST', signal });
      if (window.__appNavigate) window.__appNavigate('/');
      else window.location.href = '/';
    }, { signal });
  }

  let navigationClearTimer = 0;
  const clearNavigating = () => {
    body.classList.remove('app-navigating');
    if (navigationClearTimer) {
      window.clearTimeout(navigationClearTimer);
      navigationClearTimer = 0;
    }
  };

  const setNavigating = (autoClearMs = 0) => {
    body.classList.add('app-navigating');
    if (navigationClearTimer) {
      window.clearTimeout(navigationClearTimer);
      navigationClearTimer = 0;
    }

    if (autoClearMs > 0) {
      navigationClearTimer = window.setTimeout(() => {
        navigationClearTimer = 0;
        body.classList.remove('app-navigating');
      }, autoClearMs);
    }
  };

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => setNavigating(1800), { signal });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) return;
    setMenu(false);
    setProfile(false);
    setNavigating();
  }, { signal });

  window.addEventListener('pageshow', clearNavigating, { signal });

  clearNavigating();
  setMenu(false);
  setProfile(false);
})();
`;


function normalizeNavSections(navItems = []) {
  if (!Array.isArray(navItems) || !navItems.length) return [];
  const first = navItems[0] || {};
  if (Array.isArray(first.items)) return navItems;
  return [{ title: "", items: navItems }];
}

const BRAND_SVG = `<svg class="admin-brand-svg" viewBox="0 0 248 52" aria-hidden="true" focusable="false"><defs><linearGradient id="adminBrandWordGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="color-mix(in srgb,var(--accent) 95%,#fff)"/><stop offset="100%" stop-color="color-mix(in srgb,var(--accent) 56%,#3a2514)"/></linearGradient><radialGradient id="adminBrandSparkGradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="color-mix(in srgb,var(--accent) 94%,#fff)"/><stop offset="100%" stop-color="color-mix(in srgb,var(--accent) 62%,transparent)"/></radialGradient></defs><text class="admin-brand-word admin-brand-word-shadow" x="14.6" y="36.4" font-size="28">Freeducation</text><text class="admin-brand-word admin-brand-word-extrude" x="13.2" y="35" font-size="28">Freeducation</text><text class="admin-brand-word admin-brand-word-front" x="12" y="33.8" font-size="28">Freeducation</text><path class="admin-brand-doodle" d="M10 39.2c10.2 4.2 20.8 4.5 31.4 1.4 10.4-3 20.7-3.2 31 .4 10.2 3.6 20.5 3.8 30.9.8 10.2-2.9 20.4-3.1 30.7.2 10.1 3.3 20.3 3.4 30.5.5 10.1-2.8 20.1-2.9 30.1.2 10.2 3.2 20.1 3 30-.3"/><path class="admin-brand-doodle-secondary" d="M10.4 42.1c10.1 3.8 20.4 4 30.8 1.1 10.3-2.9 20.6-3.1 30.9.3 10.2 3.4 20.3 3.6 30.6.7 10.1-2.8 20.2-3 30.4.1 10 3.1 20.1 3.3 30.2.5 10-2.7 20.1-2.9 30 .2 10 3 19.9 2.9 29.7-.2"/><path class="admin-brand-doodle-guide" d="M10.2 36.4c10.2 3.2 20.4 3.4 30.7 1 10.4-2.5 20.8-2.6 31.2.2 10.4 2.8 20.7 2.9 31.1.5 10.3-2.4 20.6-2.5 31 .1 10.2 2.6 20.4 2.8 30.6.4 10.1-2.3 20.2-2.4 30.2.1 10 2.5 20 2.4 30-.2"/><path class="admin-brand-doodle-secondary" d="M27.2 17.2c8.2-4.2 16.8-4.6 25.6-1.8 8.6 2.7 17.3 2.8 25.9.3m16.2.4c7.8-3.8 15.9-4.1 24.3-1.5 8.2 2.5 16.4 2.6 24.6.3m15.5.5c7.8-3.7 15.8-3.9 24.1-1.4 8 2.4 16 2.5 24 .3"/><circle class="admin-brand-spark" cx="40.8" cy="12.6" r="1.05"/><circle class="admin-brand-spark" cx="95.1" cy="11.4" r="1.05"/><circle class="admin-brand-spark" cx="149.4" cy="10.9" r="1.05"/><circle class="admin-brand-spark" cx="203.7" cy="11.8" r="1.05"/><circle cx="122.5" cy="8.9" r="2" fill="url(#adminBrandSparkGradient)" opacity=".62"/></svg>`;

function renderNav(navItems = [], activeMenu = "") {
  const sections = normalizeNavSections(navItems);
  return `<nav class="admin-nav">${sections.map((section) => {
    const title = String(section?.title || "").trim();
    const items = Array.isArray(section?.items) ? section.items : [];
    return `<section class="admin-nav-section">${title ? `<h3 class="admin-nav-title">${title}</h3>` : ""}<div class="admin-nav-links">${items.map((item) => `<a class="${activeMenu === item.key ? "active" : ""} ${item.kind === "highlight" ? "admin-nav-highlight" : ""}" href="${item.href}">${item.icon}${item.label}</a>`).join("")}</div></section>`;
  }).join("")}</nav>`;
}

const initialsFor = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

export function renderAdminLayout({ title, activeMenu, admin, content, contentClass = "", script = "", footerText = globalFooterText(), homePath = "/", navItems = ADMIN_NAV_SECTIONS, pageClass = "", pageStyles = "" }) {
  const nav = renderNav(navItems, activeMenu);
  const isAuthenticated = Boolean(admin);
  const safeAdmin = admin || { name: "Guest", email: "Not signed in" };
  const initials = initialsFor(admin?.name);
  const avatarVersion = String(admin?.avatar_key || '').trim();
  const avatarFallback = isAuthenticated ? initials : `<svg class="admin-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z"/><path d="M4 21c.35-3.6 3.4-6.1 8-6.1s7.65 2.5 8 6.1" /></svg>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${ADMIN_BASE_STYLE}
${pageStyles}`,
    body: `<div class="admin-shell"><header class="admin-header"><div class="admin-header-left"><button id="adminMenuOpen" class="admin-menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button><button id="adminBrandHome" class="admin-brand admin-brand-signature" type="button" aria-label="Go to ${APP_NAME} homepage" data-brand="${APP_NAME}" data-home="${homePath}">${BRAND_SVG}</button></div><div class="admin-header-right"><div class="admin-user-meta"><span class="admin-user-name" title="${safeAdmin.name}">${safeAdmin.name}</span><span class="admin-user-email" title="${safeAdmin.email}">${safeAdmin.email}</span></div><button id="adminAvatar" class="admin-avatar" data-avatar-version="${avatarVersion}" aria-label="${isAuthenticated ? "Open profile" : "Open login menu"}" aria-expanded="false" aria-haspopup="dialog" aria-busy="false"><img id="adminAvatarImage" class="admin-avatar-image" alt="" hidden /><span id="adminAvatarFallback" class="admin-avatar-fallback">${avatarFallback}</span><span class="admin-avatar-loader" aria-hidden="true"></span></button>${isAuthenticated ? `<button id="logout" class="admin-logout">${ICONS.logout}<span>Logout</span></button>` : ""}<div id="adminProfilePanel" class="admin-profile-pop" role="dialog" aria-label="${isAuthenticated ? "Profile menu" : "Login menu"}">${isAuthenticated ? `<p class="admin-profile-name" title="${safeAdmin.name}">${safeAdmin.name}</p><p class="admin-profile-email" title="${safeAdmin.email}">${safeAdmin.email}</p><div class="admin-profile-divider"></div><button id="profileLogout" class="admin-profile-logout">${ICONS.logout}<span>Logout</span></button>` : `<p class="admin-profile-name">Welcome</p><p class="admin-profile-help">You are currently logged out. Please sign in to access dashboard pages and your profile.</p><div class="admin-profile-divider"></div><a class="admin-profile-login" href="/admin/login">Login</a>`}</div></div></header><div id="adminMenuOverlay" class="admin-nav-overlay" aria-hidden="true"></div><aside id="adminSidebar" class="admin-sidebar"><div class="admin-sidebar-head"><button id="adminMenuClose" class="admin-sidebar-close" aria-label="Close menu">${ICONS.close}</button></div>${nav}<div class="admin-theme-wrap"><button id="themeToggle" class="admin-theme-toggle" type="button" data-theme-state="idle" aria-pressed="false" aria-busy="false"><span class="admin-theme-orb" aria-hidden="true"><svg class="admin-theme-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"></path></svg><svg class="admin-theme-moon" viewBox="0 0 24 24"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"></path></svg></span><span class="admin-theme-copy"><span class="admin-theme-label">Theme</span><span id="themeToggleText" class="admin-theme-text">Dark mode on</span></span><span id="themeToggleChip" class="admin-theme-chip">Dark</span></button></div></aside><main class="admin-content ${contentClass}">${content}</main><footer class="admin-footer">${footerText}</footer><div id="adminStatusToast" class="admin-status-toast" role="status" aria-live="polite"></div></div>`,
    script: `${ADMIN_LAYOUT_SCRIPT}
${script}`,
  });
}
