export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@500;600;700&family=Playfair+Display:wght@600;700&display=swap');

:root {
  color-scheme: light;
  --bg: #f2f6ff;
  --surface: #ffffff;
  --line: #ccd8ee;
  --text: #0f172a;
  --muted: #64748b;
  --primary: #334155;
  --primary-strong: #1e293b;
  --danger: #dc2626;
  --shadow-soft: 0 1px 2px rgba(15, 23, 42, 0.06);
  --sidebar-open: 248px;
  --sidebar-collapse: 72px;
  --font-body: Inter, 'Noto Sans Bengali', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  --font-public-heading: 'Playfair Display', 'Noto Serif Bengali', Georgia, 'Times New Roman', serif;
  --font-public-brand: 'Cinzel', 'Noto Serif Bengali', Georgia, 'Times New Roman', serif;
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.45;
}
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  transform: scaleX(0);
  transform-origin: left;
  opacity: 0;
  transition: transform 220ms ease, opacity 120ms ease;
  z-index: 120;
  pointer-events: none;
}
body.page-nav-pending::before {
  transform: scaleX(0.88);
  opacity: 1;
}
body.page-entering .main-shell {
  opacity: 0.72;
  transform: translateY(6px);
}
a { color: inherit; }

.app-shell { display: grid; grid-template-columns: var(--sidebar-open) 1fr; min-height: 100vh; }
.app-shell.collapsed { grid-template-columns: var(--sidebar-collapse) 1fr; }
.sidebar { position: fixed; inset: 0 auto 0 0; width: var(--sidebar-open); background: #ecf3ff; border-right: 1px solid #c5d3ee; display: flex; flex-direction: column; transition: width 160ms ease; z-index: 35; overflow: hidden; }
.app-shell.collapsed .sidebar { width: var(--sidebar-collapse); }
.sidebar-head { height: 64px; flex: 0 0 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-bottom: 1px solid var(--line); background: #e7f0ff; }
.brand { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
.brand-logo { width: 34px; height: 34px; display: inline-grid; place-items: center; }
.brand-logo svg { width: 100%; height: 100%; }
.brand-name { font-size: 19px; font-weight: 700; font-family: Georgia, 'Times New Roman', serif; color: #0f172a; text-transform: lowercase; }
.sidebar-toggle { border: 1px solid #b7c8e6; background: #f8fbff; width: 34px; height: 34px; border-radius: 10px; cursor: pointer; display: inline-grid; place-items: center; }
.sidebar-toggle .toggle-icon { width: 16px; height: 16px; color: #0f172a; display: inline-grid; }
.sidebar-scroll { overflow: auto; padding: 10px 8px; height: calc(100vh - 64px - 56px); background: #ecf3ff; }
.sidebar-foot { flex: 0 0 56px; padding: 8px; border-top: 1px solid var(--line); background: #e7f0ff; }
.sidebar-foot .menu-item { margin: 0; }
.sidebar-login-note { padding: 2px 10px 10px; border-bottom: 1px solid var(--line); margin-bottom: 8px; }
.nav-group-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 10px 10px 8px; }
.menu-item,.submenu-item,.menu-expand { border-radius: 10px; min-height: 36px; display: flex; align-items: center; text-decoration: none; gap: 10px; padding: 6px 10px; color: #334155; font-size: 14px; margin-bottom: 4px; }
.menu-expand { width: 100%; border: 0; background: transparent; cursor: pointer; justify-content: space-between; }
.menu-leading { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
.menu-item:hover,.menu-expand:hover,.submenu-item:hover { background: #dfebff; }
.menu-item.active,.submenu-item.active { background: #d7e6ff; color: #1e3a8a; font-weight: 600; }
.logout-item,.sidebar-login-item { border-width: 1px; border-style: solid; min-height: 38px; font-weight: 600; }
.logout-item { border-color: #fca5a5; color: #991b1b; background: #fff1f2; }
.sidebar-login-item { border-color: #93c5fd; color: #1d4ed8; background: #eff6ff; }
.icon { width: 18px; height: 18px; flex: none; display: inline-grid; place-items: center; color: #64748b; }
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

.container { width: min(1760px, 100%); margin: 0 auto; padding: 6px 8px; position: relative; z-index: 1; }
.container-full-bleed { width: 100%; max-width: none; margin: 0; padding: 0; }
.page-head { margin-bottom: 8px; }
.page-title { margin: 0; font-size: 26px; line-height: 1.2; }
.page-subtitle { margin: 6px 0 0; color: var(--muted); font-size: 14px; }

.topbar { position: sticky; top: 0; z-index: 30; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-bottom: 1px solid var(--line); background: #edf4ff; }
.topbar-left,.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-center { display: none; }
.icon-btn { border: 1px solid #cbd5e1; background: #fff; border-radius: 12px; width: 36px; height: 36px; cursor: pointer; display: inline-grid; place-items: center; }
.mobile-menu-btn { width: 24px; height: 24px; border: 0; padding: 0; background: transparent; box-shadow: none; }
.mobile-icon { width: 24px; height: 24px; color: #0f172a; display: inline-grid; place-items: center; }
.mobile-icon-close { display: none; }
.app-shell.mobile-open .mobile-icon-menu { display: none; }
.app-shell.mobile-open .mobile-icon-close { display: inline-grid; }
.avatar { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #bfdbfe; background: #dbeafe; color: #1e3a8a; display: inline-grid; place-items: center; font-size: 12px; font-weight: 700; overflow: hidden; }
.avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 999px; }
.profile-menu { position: relative; }
.profile-trigger { border: 0; background: transparent; padding: 0; border-radius: 999px; cursor: pointer; }
.profile-popup { position: absolute; top: calc(100% + 8px); right: 0; z-index: 60; min-width: 220px; border: 1px solid #dbe4f3; background: #fff; border-radius: 12px; padding: 10px; display: grid; gap: 8px; }
.profile-popup[hidden] { display: none; }
.profile-popup-login-btn { width: 100%; }
.sidebar-login-item { margin-top: auto; }

.grid { display: grid; gap: 8px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.card { background: var(--surface); border: 1px solid #d8e3f2; border-radius: 6px; padding: 8px; }
.card-title { margin: 0 0 6px; font-size: 15px; }
.section-stack { display: grid; gap: 8px; }
.inline-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.muted { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5; }
.table-empty { text-align: center; color: var(--muted); padding: 14px 10px; }

.btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid transparent; min-height: 34px; padding: 0 10px; font-weight: 600; font-size: 13px; text-decoration: none; cursor: pointer; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-secondary { background: #eef2ff; color: #312e81; border-color: #c7d2fe; }
.btn-danger { background: #fef2f2; color: var(--danger); border-color: #fecaca; }
.input,.select { height: 36px; border: 1px solid var(--line); background: var(--surface); border-radius: 6px; padding: 0 10px; font-size: 15px; width: 100%; }

.badge { display: inline-flex; border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
.badge-success { background: #ecfdf5; color: #047857; }
.badge-info { background: #eff6ff; color: #1d4ed8; }
.badge-warn { background: #fffbeb; color: #b45309; }

.table-wrap { border: 1px solid var(--line); border-radius: 8px; overflow: auto; }
.table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 860px; }
.table thead th { position: sticky; top: 0; z-index: 1; background: #f1f5f9; color: var(--muted); text-transform: uppercase; font-size: 11px; padding: 7px 9px; border-bottom: 1px solid var(--line); text-align: left; }
.table tbody td { padding: 7px 9px; border-bottom: 1px solid var(--line); font-size: 14px; }

.dropdown,.modal,.toast { border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-soft); }
.modal { padding: 20px; max-width: 460px; }
.mobile-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.38); opacity: 0; pointer-events: none; transition: opacity 150ms ease; z-index: 30; }
.mobile-overlay.show,.app-shell.mobile-open .mobile-overlay { opacity: 1; pointer-events: auto; }
.mobile-only { display: none; }
.public-main-shell { display: flex; flex-direction: column; min-height: 100vh; }
.public-content-shell { flex: 1; }
.public-footer { border-top: 1px solid var(--line); padding: 6px 10px; color: var(--muted); font-size: 12px; }

:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 1px; }

@media (max-width: 1024px) {
  .grid-4,.grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 840px) {
  .app-shell,.app-shell.collapsed,.app-shell.collapsed.hover-expanded { grid-template-columns: 1fr; }
  .sidebar { transform: translateX(-100%); transition: transform 170ms ease; width: min(84vw, 310px); }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-center { display: flex; position: absolute; left: 50%; transform: translateX(-50%); }
  .topbar-brand { display: inline-flex; align-items: center; gap: 8px; }
  .grid-4,.grid-3,.grid-2 { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  body::before,
  .main-shell,
  .sidebar,
  .mobile-overlay,
  .submenu-wrap {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
  body.page-entering .main-shell {
    opacity: 1;
    transform: none;
  }
}
`;
