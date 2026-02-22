export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@500;600;700&family=Playfair+Display:wght@600;700&display=swap');

:root {
  color-scheme: light;
  --bg: #f4f7ff;
  --bg-accent: #eefcf7;
  --surface: #ffffff;
  --surface-soft: #f8faff;
  --line: #d9e2f3;
  --line-strong: #c3d1ec;
  --text: #12203c;
  --muted: #4f6287;
  --primary: #3f5efb;
  --primary-strong: #2747e0;
  --secondary: #22c55e;
  --danger: #dc2626;
  --shadow-soft: 0 8px 30px rgba(36, 53, 107, 0.08);
  --sidebar-open: 248px;
  --sidebar-collapse: 74px;
  --font-body: Inter, 'Noto Sans Bengali', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  --font-public-heading: 'Playfair Display', 'Noto Serif Bengali', Georgia, 'Times New Roman', serif;
  --font-public-brand: 'Cinzel', 'Noto Serif Bengali', Georgia, 'Times New Roman', serif;
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  background:
    radial-gradient(circle at 0% 0%, #e6efff 0, transparent 42%),
    radial-gradient(circle at 100% 100%, #e6fff1 0, transparent 38%),
    linear-gradient(180deg, var(--bg) 0%, #edf2ff 100%);
}
a { color: inherit; }

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(18, 32, 60, 0.26);
  opacity: 0;
  transition: opacity 150ms ease;
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
  border: 3px solid #c7d7ff;
  border-top-color: var(--primary);
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 150ms ease, transform 190ms ease;
  animation: pageLoaderSpin 620ms linear infinite;
  z-index: 120;
  pointer-events: none;
}
body.page-nav-pending::before, body.page-nav-pending::after { opacity: 1; }
body.page-nav-pending::after { transform: scale(1); }
body.page-entering .main-shell { opacity: 0; transform: translateY(8px); }

.app-shell { display: grid; grid-template-columns: var(--sidebar-open) 1fr; min-height: 100vh; }
.app-shell.collapsed { grid-template-columns: var(--sidebar-collapse) 1fr; }
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-open);
  background: linear-gradient(180deg, #f8fbff 0%, #f0f6ff 100%);
  border-right: 1px solid var(--line-strong);
  box-shadow: 6px 0 20px rgba(34, 55, 108, 0.06);
  display: flex;
  flex-direction: column;
  transition: width 160ms ease;
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
  border-bottom: 1px solid var(--line);
  background: #ffffffd9;
  backdrop-filter: blur(4px);
}
.brand { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
.brand-logo { width: 34px; height: 34px; display: inline-grid; place-items: center; }
.brand-logo svg { width: 100%; height: 100%; }
.brand-name { font-size: 19px; font-weight: 700; font-family: var(--font-public-brand); color: #1a2a52; text-transform: lowercase; }
.sidebar-toggle { border: 1px solid var(--line); background: #fff; width: 34px; height: 34px; border-radius: 10px; cursor: pointer; display: inline-grid; place-items: center; }
.sidebar-toggle .toggle-icon { width: 16px; height: 16px; color: var(--text); display: inline-grid; }
.sidebar-scroll { overflow: auto; padding: 8px 6px; height: calc(100vh - 58px - 52px); }
.sidebar-foot { flex: 0 0 52px; padding: 6px; border-top: 1px solid var(--line); background: #ffffffd9; }
.sidebar-foot .menu-item { margin: 0; }
.sidebar-login-note { padding: 2px 10px 10px; border-bottom: 1px solid var(--line); margin-bottom: 8px; }
.nav-group-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 10px 10px 8px; }
.menu-item,.submenu-item,.menu-expand {
  border-radius: 8px;
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
.menu-item:hover,.menu-expand:hover,.submenu-item:hover { background: #ecf3ff; border-color: #d2ddf5; }
.menu-item.active,.submenu-item.active { background: linear-gradient(90deg, #e8edff 0%, #e4f8ef 100%); border-color: #b9caf2; color: var(--primary-strong); font-weight: 600; }
.logout-item,.sidebar-login-item { border-width: 1px; border-style: solid; min-height: 38px; font-weight: 600; }
.logout-item { border-color: #fecaca; color: #9f1239; background: #fff1f2; }
.sidebar-login-item { border-color: #bfd1ff; color: var(--primary); background: #eff4ff; }
.icon { width: 18px; height: 18px; flex: none; display: inline-grid; place-items: center; color: #5a6f98; }
.icon svg { width: 100%; height: 100%; display: block; }
.label { overflow: hidden; white-space: nowrap; }
.app-shell.collapsed .brand-name,.app-shell.collapsed .label,.app-shell.collapsed .nav-group-title,.app-shell.collapsed .chevron,.app-shell.collapsed .sidebar-login-note { opacity: 0; width: 0; display: none; }
.app-shell.collapsed .brand { justify-content: center; width: 100%; }
.app-shell.collapsed .menu-item,.app-shell.collapsed .submenu-item,.app-shell.collapsed .menu-expand { justify-content: center; padding: 8px; }
.app-shell.collapsed.hover-expanded { grid-template-columns: var(--sidebar-open) 1fr; }
.app-shell.collapsed.hover-expanded .sidebar { width: var(--sidebar-open); }
.app-shell.collapsed.hover-expanded .sidebar-toggle { display: inline-grid; }
.app-shell.collapsed.hover-expanded .brand-name,.app-shell.collapsed.hover-expanded .label,.app-shell.collapsed.hover-expanded .nav-group-title,.app-shell.collapsed.hover-expanded .chevron,.app-shell.collapsed.hover-expanded .sidebar-login-note { display: initial; opacity: 1; width: auto; }
.chevron { width: 16px; height: 16px; color: var(--muted); display: inline-grid; }
.submenu-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 160ms ease; }
.submenu { overflow: hidden; padding-left: 14px; }
.menu-block.open .submenu-wrap { grid-template-rows: 1fr; }
.main-shell { grid-column: 2; min-width: 0; position: relative; overflow: hidden; transition: transform 190ms ease, opacity 190ms ease; }

.container { width: min(1500px, 100%); margin: 0 auto; padding: 6px; position: relative; z-index: 1; }
.container-full-bleed { width: 100%; max-width: none; margin: 0; padding: 0; }
.page-head { margin-bottom: 8px; padding: 8px; border: 1px solid var(--line); border-radius: 8px; background: linear-gradient(90deg, #ffffff 0%, #f8fbff 100%); }
.page-title { margin: 0; font-size: clamp(22px, 3vw, 30px); line-height: 1.15; font-weight: 700; color: #16264d; }
.page-subtitle { margin: 5px 0 0; color: var(--muted); font-size: 13px; }

.topbar { position: sticky; top: 0; z-index: 30; height: 54px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; border-bottom: 1px solid var(--line); background: #fffffff2; backdrop-filter: blur(6px); }
.topbar-left,.topbar-right { display: flex; align-items: center; gap: 10px; }
.topbar-center { display: none; }
.icon-btn { border: 1px solid var(--line); background: #fff; border-radius: 10px; width: 36px; height: 36px; cursor: pointer; display: inline-grid; place-items: center; }
.mobile-menu-btn { width: 24px; height: 24px; border: 0; padding: 0; background: transparent; box-shadow: none; }
.mobile-icon { width: 24px; height: 24px; color: var(--text); display: inline-grid; place-items: center; }
.mobile-icon-close { display: none; }
.app-shell.mobile-open .mobile-icon-menu { display: none; }
.app-shell.mobile-open .mobile-icon-close { display: inline-grid; }
.avatar { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #c5d6ff; background: #e9efff; color: var(--primary-strong); display: inline-grid; place-items: center; font-size: 12px; font-weight: 700; overflow: hidden; }
.avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 999px; }
.profile-menu { position: relative; }
.profile-trigger { border: 0; background: transparent; padding: 0; border-radius: 999px; cursor: pointer; }
.profile-popup { position: absolute; top: calc(100% + 8px); right: 0; z-index: 60; min-width: 220px; border: 1px solid var(--line); background: #fff; border-radius: 12px; padding: 10px; display: grid; gap: 8px; }
.profile-popup[hidden] { display: none; }
.profile-popup-login-btn { width: 100%; }
.sidebar-login-item { margin-top: auto; }

.grid { display: grid; gap: 8px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 8px; box-shadow: var(--shadow-soft); }
.card-title { margin: 0 0 6px; font-size: 15px; }
.section-stack { display: grid; gap: 8px; }
.inline-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.muted { margin: 0; font-size: 12px; color: var(--muted); line-height: 1.45; }
.table-empty { text-align: center; color: var(--muted); padding: 14px 10px; }

.btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid transparent; min-height: 32px; padding: 0 10px; font-weight: 600; font-size: 12px; text-decoration: none; cursor: pointer; }
.btn-primary { background: linear-gradient(90deg, var(--primary) 0%, #5e7bff 100%); color: #fff; border-color: #4e67ea; }
.btn-secondary { background: #eef6ff; color: #2f4f9d; border-color: #cbd9ff; }
.btn-danger { background: #fef2f2; color: var(--danger); border-color: #fecaca; }
.input,.select { height: 34px; border: 1px solid var(--line); background: #fff; border-radius: 6px; padding: 0 8px; font-size: 13px; width: 100%; }

.badge { display: inline-flex; border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
.badge-success { background: #e9fce8; color: #166534; }
.badge-info { background: #e8efff; color: #1e40af; }
.badge-warn { background: #fff8e6; color: #92400e; }

.table-wrap { border: 1px solid var(--line); border-radius: 8px; overflow: auto; background: #fff; }
.table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 860px; }
.table thead th { position: sticky; top: 0; z-index: 1; background: #f5f8ff; color: var(--muted); text-transform: uppercase; font-size: 10px; padding: 6px 8px; border-bottom: 1px solid var(--line); text-align: left; }
.table tbody td { padding: 6px 8px; border-bottom: 1px solid var(--line); font-size: 12px; }

.dropdown,.modal,.toast { border: 1px solid var(--line); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-soft); }
.modal { padding: 20px; max-width: 460px; }
.mobile-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.38); opacity: 0; pointer-events: none; transition: opacity 150ms ease; z-index: 30; }
.mobile-overlay.show,.app-shell.mobile-open .mobile-overlay { opacity: 1; pointer-events: auto; }
.mobile-only { display: none; }
.public-main-shell { display: flex; flex-direction: column; min-height: 100vh; }
.public-content-shell { flex: 1; }
.public-footer { border-top: 1px solid var(--line); padding: 5px 8px; color: var(--muted); font-size: 11px; background: #fff; }

:focus-visible { outline: 2px solid var(--primary); outline-offset: 1px; }
@keyframes pageLoaderSpin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .grid-4,.grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 840px) {
  .app-shell,.app-shell.collapsed,.app-shell.collapsed.hover-expanded { grid-template-columns: 1fr; }
  .sidebar { transform: translateX(-100%); transition: transform 170ms ease; width: min(84vw, 310px); }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; }
  .admin-page-head { text-align: center; }
  .admin-page-head .page-subtitle { margin-top: 4px; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-center { display: flex; position: absolute; left: 50%; transform: translateX(-50%); }
  .topbar-brand { display: inline-flex; align-items: center; gap: 8px; }
  .grid-4,.grid-3,.grid-2 { grid-template-columns: 1fr; }
  .container { padding: 4px; }
}

@media (prefers-reduced-motion: reduce) {
  body::before, body::after, .main-shell, .sidebar, .mobile-overlay, .submenu-wrap {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
  body.page-entering .main-shell { opacity: 1; transform: none; }
}
`;
