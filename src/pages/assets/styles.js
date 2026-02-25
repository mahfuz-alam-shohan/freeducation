export const styles = `
:root {
  color-scheme: light;
  --bg: #f3f6ff;
  --bg-accent: #e9efff;
  --surface: #ffffff;
  --surface-soft: #f7f9ff;
  --line: #d6dff6;
  --line-strong: #b9c8ee;
  --text: #1a2750;
  --muted: #53658e;
  --primary: #5167ff;
  --primary-strong: #3347ce;
  --secondary: #0d9a7d;
  --danger: #d43e62;
  --shadow-soft: 0 8px 20px rgba(22, 38, 88, 0.08);
  --shadow-pop: 0 12px 28px rgba(34, 54, 116, 0.12);
  --sidebar-open: 252px;
  --sidebar-collapse: 74px;
  --font-body: 'Noto Sans Bengali', Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  --font-public-heading: 'Noto Serif Bengali', Georgia, 'Times New Roman', serif;
  --font-public-brand: 'Noto Serif Bengali', Georgia, 'Times New Roman', serif;
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  overflow-x: hidden;
  background:
    radial-gradient(circle at 10% 12%, #edf3ff 0%, transparent 22%),
    radial-gradient(circle at 82% 18%, #ebf6ff 0%, transparent 24%),
    var(--bg);
}
a { color: inherit; }

@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 180ms;
  animation-timing-function: ease;
}

::view-transition-old(root) {
  animation-name: pageCrossFadeOut;
}

::view-transition-new(root) {
  animation-name: pageCrossFadeIn;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(10, 16, 44, 0.38);
  opacity: 0;
  transition: opacity 160ms ease;
  z-index: 119;
  pointer-events: none;
}
body::after {
  content: '';
  position: fixed;
  width: 44px;
  height: 44px;
  left: 50%;
  top: 50%;
  margin-left: -22px;
  margin-top: -22px;
  border-radius: 999px;
  border: 3px solid #b9c8ff;
  border-top-color: #ffe073;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 160ms ease, transform 200ms ease;
  animation: pageLoaderSpin 760ms linear infinite;
  z-index: 120;
  pointer-events: none;
}
body.page-nav-pending::before, body.page-nav-pending::after { opacity: 1; }
body.page-nav-pending::after { transform: scale(1); }
body.page-entering .main-shell { opacity: 0; transform: translateY(8px); }
body.page-leaving .main-shell { opacity: 0.84; transform: translateY(-4px); }

.app-shell { min-height: 100vh; }
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-open);
  background: #f9fbff;
  border-right: 1px solid #d5def4;
  box-shadow: var(--shadow-pop);
  display: flex;
  flex-direction: column;
  transition: width 170ms ease;
  z-index: 35;
  overflow: hidden;
}
.app-shell.collapsed .sidebar { width: var(--sidebar-collapse); }
.sidebar-head {
  height: 58px;
  flex: 0 0 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid #ccdaf8;
  background: rgba(255, 255, 255, 0.82);
}
.brand { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
.brand-logo { width: 35px; height: 35px; display: inline-grid; place-items: center; border-radius: 11px; background: linear-gradient(135deg, #ffed97 0%, #fff8db 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8); }
.brand-logo svg { width: 100%; height: 100%; }
.brand-name { font-size: 19px; font-weight: 700; font-family: var(--font-public-brand); color: #2f3c8f; text-transform: lowercase; letter-spacing: 0.01em; }
.sidebar-toggle { border: 1px solid #ccdaf8; background: #fff; width: 34px; height: 34px; border-radius: 11px; cursor: pointer; display: inline-grid; place-items: center; }
.sidebar-toggle .toggle-icon { width: 16px; height: 16px; color: var(--text); display: inline-grid; }
.sidebar-scroll { overflow: auto; padding: 8px 6px; height: calc(100vh - 58px - 52px); }
.sidebar-foot { flex: 0 0 52px; padding: 6px; border-top: 1px solid #cfe0ff; background: linear-gradient(180deg, rgba(240, 246, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%); }
.sidebar-foot .menu-item { margin: 0; }
.sidebar-login-note { padding: 2px 10px 10px; border-bottom: 1px dashed #cad8fa; margin-bottom: 8px; }
.nav-group-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 10px 10px 8px; }
.menu-item,.submenu-item,.menu-expand {
  border-radius: 10px;
  min-height: 34px;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 8px;
  padding: 4px 8px;
  color: #24375c;
  font-size: 13px;
  margin-bottom: 3px;
  border: 1px solid transparent;
}
.menu-expand { width: 100%; background: transparent; cursor: pointer; justify-content: space-between; }
.menu-leading { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
.menu-item:hover,.menu-expand:hover,.submenu-item:hover { background: #f0f5ff; border-color: #cfddff; }
.menu-item.active,.submenu-item.active { background: #eef2ff; border-color: #bdcbf0; color: var(--primary-strong); font-weight: 700; }
.logout-item,.sidebar-login-item { border-width: 1px; border-style: solid; min-height: 38px; font-weight: 700; }
.logout-item { border-color: #ffc6d1; color: #b6284b; background: #fff2f5; }
.sidebar-login-item { border-color: #bccbff; color: var(--primary); background: #eef1ff; }
.icon { width: 18px; height: 18px; flex: none; display: inline-grid; place-items: center; color: #5a6f98; }
.icon svg { width: 100%; height: 100%; display: block; }
.label { overflow: hidden; white-space: nowrap; }
.app-shell.collapsed .brand-name,.app-shell.collapsed .label,.app-shell.collapsed .nav-group-title,.app-shell.collapsed .chevron,.app-shell.collapsed .sidebar-login-note { opacity: 0; width: 0; display: none; }
.app-shell.collapsed .brand { justify-content: center; width: 100%; }
.app-shell.collapsed .menu-item,.app-shell.collapsed .submenu-item,.app-shell.collapsed .menu-expand { justify-content: center; padding: 8px; }
.app-shell.collapsed.hover-expanded .sidebar { width: var(--sidebar-open); }
.app-shell.collapsed.hover-expanded .sidebar-toggle { display: inline-grid; }
.app-shell.collapsed.hover-expanded .brand-name,.app-shell.collapsed.hover-expanded .label,.app-shell.collapsed.hover-expanded .nav-group-title,.app-shell.collapsed.hover-expanded .chevron,.app-shell.collapsed.hover-expanded .sidebar-login-note { opacity: 1; width: auto; display: inline; }

.submenu-wrap { display: grid; gap: 3px; margin: 0 0 6px 24px; padding-left: 6px; border-left: 1px dashed #c3d4fa; }
.submenu-wrap[hidden] { display: none; }
.chevron { margin-left: auto; transition: transform 140ms ease; opacity: 0.8; }
.menu-expand[aria-expanded="true"] .chevron { transform: rotate(90deg); }

.main-shell {
  margin-left: var(--sidebar-open);
  min-height: 100vh;
  background: transparent;
  display: grid;
  grid-template-rows: 50px 1fr;
  transition: margin-left 170ms ease, opacity 170ms ease, transform 170ms ease;
}
.app-shell.collapsed .main-shell { margin-left: var(--sidebar-collapse); }
.app-shell.collapsed.hover-expanded .main-shell { margin-left: var(--sidebar-open); }
.container { padding: 6px; display: grid; gap: 8px; }
.container-full-bleed { padding: 0; }
.page-head { border: 1px solid #ccdafb; border-radius: 7px; background: #f7f9ff; padding: 3px 5px; box-shadow: none; display: inline-grid; gap: 1px; width: fit-content; max-width: 100%; justify-items: start; }
.page-title { margin: 0; font-size: clamp(15px, 1.6vw, 20px); line-height: 1.12; color: #1f3078; }
.page-subtitle { margin: 0; color: #4c5f8f; font-size: 10.5px; line-height: 1.22; }

.topbar { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 8px; border-bottom: 1px solid #d5def3; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(6px); position: sticky; top: 0; z-index: 20; }
.topbar-left,.topbar-right { display: flex; align-items: center; gap: 10px; }
.topbar-center { display: none; }
.icon-btn { border: 1px solid #cad7f8; background: #fff; border-radius: 10px; width: 36px; height: 36px; cursor: pointer; display: inline-grid; place-items: center; }
.mobile-menu-btn { width: 24px; height: 24px; border: 0; padding: 0; background: transparent; box-shadow: none; }
.mobile-icon { width: 24px; height: 24px; color: var(--text); display: inline-grid; place-items: center; }
.mobile-icon-close { display: none; }
.app-shell.mobile-open .mobile-icon-menu { display: none; }
.app-shell.mobile-open .mobile-icon-close { display: inline-grid; }
.avatar { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #bfd0fb; background: linear-gradient(135deg, #f0f4ff 0%, #e2fff9 100%); color: var(--primary-strong); display: inline-grid; place-items: center; font-size: 12px; font-weight: 700; overflow: hidden; }
.avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 999px; }
.avatar svg { width: 18px; height: 18px; }
.profile-menu { position: relative; }
.profile-trigger { border: 0; background: transparent; padding: 0; border-radius: 999px; cursor: pointer; }
.profile-popup { position: absolute; top: calc(100% + 8px); right: 0; z-index: 60; min-width: 220px; border: 1px solid #cad7f9; background: #fff; border-radius: 12px; padding: 10px; display: grid; gap: 8px; box-shadow: var(--shadow-pop); }
.profile-popup[hidden] { display: none; }
.profile-popup-name { margin: 0; font-size: 13px; font-weight: 700; color: var(--text); }
.profile-popup-email { margin: 0; font-size: 12px; color: var(--muted); word-break: break-word; }
.profile-popup-actions { display: grid; gap: 6px; }
.profile-popup-btn,.profile-popup-login-btn { width: 100%; }
.sidebar-login-item { margin-top: auto; }

.grid { display: grid; gap: 8px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.card { background: #fff; border: 1px solid #d4def7; border-radius: 10px; padding: 6px; box-shadow: var(--shadow-soft); }
.card-title { margin: 0 0 6px; font-size: 15px; color: #253b86; }
.section-stack { display: grid; gap: 8px; }
.inline-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.muted { margin: 0; font-size: 12px; color: var(--muted); line-height: 1.45; }
.table-empty { text-align: center; color: var(--muted); padding: 14px 10px; }

.btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid transparent; min-height: 32px; padding: 0 10px; font-weight: 700; font-size: 12px; text-decoration: none; cursor: pointer; }
.btn-primary { background: linear-gradient(110deg, #4e67ff 0%, #5d88ff 100%); color: #fff; border-color: #4f67ea; box-shadow: 0 6px 14px rgba(63, 86, 182, 0.2); }
.btn-secondary { background: #f2f6ff; color: #2f4f9d; border-color: #d0dcfa; }
.btn-danger { background: #fff1f3; color: var(--danger); border-color: #ffc7d4; }
.input,.select { height: 34px; border: 1px solid #c9d7f7; background: #fff; border-radius: 7px; padding: 0 8px; font-size: 13px; width: 100%; }

.badge { display: inline-flex; border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
.badge-success { background: #e7fff5; color: #0c7e63; }
.badge-info { background: #e9efff; color: #3450b2; }
.badge-warn { background: #fff8df; color: #9a6110; }

.table-wrap {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border: 1px solid #d2dcf5;
  border-radius: 10px;
  overflow-x: auto;
  overflow-y: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  background: #fff;
}
.table {
  width: 100%;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}
.table thead th { position: sticky; top: 0; z-index: 1; background: #f0f5ff; color: #5b6fa4; text-transform: uppercase; font-size: 10px; padding: 6px 8px; border-bottom: 1px solid #cad8fa; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.table tbody td { padding: 6px 8px; border-bottom: 1px solid #dce5fb; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.dropdown,.modal,.toast { border: 1px solid #cad8f9; border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-soft); }
.modal { padding: 20px; max-width: 460px; }
.mobile-overlay { position: fixed; inset: 0; background: rgba(14, 20, 52, 0.45); opacity: 0; pointer-events: none; transition: opacity 160ms ease; z-index: 30; }
.mobile-overlay.show,.app-shell.mobile-open .mobile-overlay { opacity: 1; pointer-events: auto; }
.mobile-only { display: none; }
.public-main-shell { display: flex; flex-direction: column; min-height: 100vh; }
.public-content-shell { flex: 1; }
.public-footer { border-top: 1px solid #cbd8f7; padding: 5px 8px; color: #546b9a; font-size: 11px; background: rgba(255,255,255,0.7); }

:focus-visible { outline: 2px solid var(--primary); outline-offset: 1px; }
@keyframes pageLoaderSpin { to { transform: rotate(360deg); } }
@keyframes pageCrossFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pageCrossFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0.9;
    transform: translateY(-4px);
  }
}

@media (max-width: 1024px) {
  .grid-4,.grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 840px) {
  .sidebar { transform: translateX(-100%); transition: transform 170ms ease; width: min(84vw, 310px); }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; margin-left: 0; }
  .admin-page-head { text-align: left; padding: 3px 5px; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-center { display: flex; position: absolute; left: 50%; transform: translateX(-50%); max-width: calc(100% - 78px); min-width: 0; }
  .topbar-brand { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-width: 0; }
  .topbar-brand .brand-logo { width: 31px; height: 31px; }
  .topbar-brand .brand-name { font-size: 17px; overflow: hidden; text-overflow: ellipsis; }
  .grid-4,.grid-3,.grid-2 { grid-template-columns: 1fr; }
  .container { padding: 4px; }
}

@media (prefers-reduced-motion: reduce) {
  body::before, body::after, .main-shell, .sidebar, .mobile-overlay, .submenu-wrap {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
  }
  body.page-entering .main-shell { opacity: 1; transform: none; }
}
`;
