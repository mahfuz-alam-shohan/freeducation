export const styles = `
:root {
  color-scheme: light;
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-soft: #f8fafc;
  --surface-muted: #f1f5f9;
  --line: #dbe2ea;
  --line-strong: #c2ccd8;
  --text: #0f172a;
  --muted: #64748b;
  --primary: #334155;
  --primary-strong: #1e293b;
  --danger: #dc2626;
  --shadow-soft: 0 2px 6px rgba(15, 23, 42, 0.06);
  --radius-lg: 12px;
  --radius-md: 10px;
  --radius-sm: 8px;
  --sidebar-open: 272px;
  --sidebar-collapse: 80px;
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.45;
}
a { color: inherit; }

.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-open) 1fr;
  min-height: 100vh;
}
.app-shell.collapsed { grid-template-columns: var(--sidebar-collapse) 1fr; }

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-open);
  background: #f8fafc;
  border-right: 1px solid #d9e3f3;
  display: flex;
  flex-direction: column;
  scrollbar-gutter: stable;
  transition: width 160ms ease;
  z-index: 35;
  overflow: hidden;
}
.app-shell.collapsed .sidebar { width: var(--sidebar-collapse); }

.sidebar-head {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  border-bottom: 1px solid var(--line);
  position: relative;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
.brand-logo {
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
}
.brand-logo svg { width: 100%; height: 100%; }
.brand-name {
  font-size: 19px;
  font-weight: 700;
  font-family: "Georgia", "Times New Roman", serif;
  letter-spacing: 0.01em;
  color: #0f172a;
  text-transform: lowercase;
}
.sidebar-toggle {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
}
.sidebar-toggle .toggle-icon { width: 16px; height: 16px; color: #0f172a; display: inline-grid; }
.sidebar-toggle .toggle-icon svg { width: 100%; height: 100%; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.app-shell.collapsed .sidebar-toggle { display: none; }

.sidebar-scroll {
  overflow: auto;
  padding: 10px 8px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}
.nav-group-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 10px 10px 8px;
}
.menu-item,
.submenu-item,
.menu-expand {
  border-radius: 10px;
  min-height: 36px;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;
  padding: 6px 10px;
  color: #334155;
  font-size: 14px;
  margin-bottom: 4px;
}
.menu-expand {
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
  justify-content: space-between;
}
.menu-expand > span:first-child { display: inline-flex; align-items: center; gap: 10px; }
.menu-item:hover,
.menu-expand:hover,
.submenu-item:hover { background: #f1f5f9; }
.menu-item.active,
.submenu-item.active { background: #e6eeff; color: #1e3a8a; font-weight: 600; }
.logout-item {
  margin-top: auto;
  border: 1px solid #fecaca;
  color: #991b1b;
  background: #fff5f5;
}
.logout-item .icon { color: #b91c1c; }
.logout-item:hover { background: #fee2e2; }
.icon {
  width: 18px;
  height: 18px;
  flex: none;
  display: inline-grid;
  place-items: center;
  color: #64748b;
}
.icon svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.icon svg rect, .icon svg circle { fill: none; }
.menu-item.active .icon,
.submenu-item.active .icon { color: #4f46e5; }
.label { overflow: hidden; white-space: nowrap; }
.app-shell.collapsed .brand-name,
.app-shell.collapsed .label,
.app-shell.collapsed .nav-group-title,
.app-shell.collapsed .chevron { opacity: 0; width: 0; display: none; }
.app-shell.collapsed .brand { justify-content: center; width: 100%; }
.app-shell.collapsed .brand-logo { width: 28px; height: 28px; }
.app-shell.collapsed .menu-item,
.app-shell.collapsed .submenu-item,
.app-shell.collapsed .menu-expand { justify-content: center; padding: 8px; }
.app-shell.collapsed .submenu { padding-left: 0; }
.app-shell.collapsed.hover-expanded { grid-template-columns: var(--sidebar-open) 1fr; }
.app-shell.collapsed.hover-expanded .sidebar { width: var(--sidebar-open); }
.app-shell.collapsed.hover-expanded .sidebar-toggle { display: inline-grid; }
.app-shell.collapsed.hover-expanded .brand-name,
.app-shell.collapsed.hover-expanded .label,
.app-shell.collapsed.hover-expanded .nav-group-title,
.app-shell.collapsed.hover-expanded .chevron { display: initial; opacity: 1; width: auto; }
.app-shell.collapsed.hover-expanded .brand { justify-content: initial; width: auto; }
.app-shell.collapsed.hover-expanded .menu-item,
.app-shell.collapsed.hover-expanded .submenu-item,
.app-shell.collapsed.hover-expanded .menu-expand { justify-content: flex-start; padding: 8px 12px; }
.app-shell.collapsed.hover-expanded .submenu { padding-left: 14px; }
.chevron { width: 16px; height: 16px; color: var(--muted); display: inline-grid; transition: transform 150ms ease; }
.chevron svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.submenu-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 160ms ease; }
.submenu { overflow: hidden; padding-left: 14px; }
.menu-block.open .submenu-wrap { grid-template-rows: 1fr; }
.menu-block.open .chevron { transform: rotate(180deg); }

.main-shell {
  grid-column: 2;
  margin-left: 0;
  min-width: 0;
  scrollbar-gutter: stable;
}

.main-shell { position: relative; overflow: hidden; }
.container { position: relative; z-index: 1; }
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
  background: #ffffff;
}
.topbar-left,
.topbar-right { display: flex; align-items: center; gap: 12px; }
.login-note { color: #475569; }
.login-name { color: #0f172a; font-weight: 700; }
.icon-btn {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 12px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
}
.mobile-menu-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border-color: #94a3b8;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.8);
}
.mobile-icon {
  width: 22px;
  height: 22px;
  color: #0f172a;
  display: inline-grid;
  place-items: center;
}
.mobile-icon svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.mobile-icon-close { display: none; }
.app-shell.mobile-open .mobile-icon-menu { display: none; }
.app-shell.mobile-open .mobile-icon-close { display: inline-grid; }
.avatar {
  width: 36px;
  height: 36px;
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #dbeafe;
  color: #1e3a8a;
  display: inline-grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  flex: 0 0 36px;
  overflow: hidden;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 999px; }

.container {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 10px 12px;
}
.page-head { margin-bottom: 10px; }
.page-title { margin: 0; font-size: 28px; line-height: 1.2; letter-spacing: -0.03em; }
.page-subtitle { margin: 8px 0 0; color: var(--muted); font-size: 14px; }

.grid { display: grid; gap: 12px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.card {
  background: var(--surface);
  border: 1px solid #d8e3f2;
  border-radius: 8px;
  box-shadow: none;
  padding: 8px;
}
.card-title { margin: 0 0 6px; font-size: 16px; }
.kpi-grid .kpi-card:nth-child(1) { background: #f4f8ff; }
.kpi-grid .kpi-card:nth-child(2) { background: #f2fdf7; }
.kpi-grid .kpi-card:nth-child(3) { background: #fff8f0; }
.muted { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5; }
.kpi { margin-top: 8px; font-size: 42px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; }

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.toolbar-group { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.table .toolbar-group { flex-wrap: nowrap; }
.table .toolbar-group > * { flex-shrink: 0; }

.btn {
  border-radius: 8px;
  border: 1px solid transparent;
  min-height: 34px;
  padding: 0 12px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 120ms ease;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-strong); }
.btn-secondary { background: #eef2ff; color: #312e81; border-color: #c7d2fe; }
.btn-danger { background: #fef2f2; color: var(--danger); border-color: #fecaca; }
.btn-ghost { background: var(--surface); color: #334155; border-color: var(--line); }

.input,
.select {
  height: 34px;
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
}
.rich-editor { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--surface); }
.editor-tools { display: flex; gap: 6px; padding: 6px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.editor-tools .btn { min-height: 28px; padding: 0 8px; }
.rich-editor-input { min-height: 150px; padding: 10px; outline: none; line-height: 1.6; }
.rich-editor-input:empty::before { content: 'Write your note here...'; color: var(--muted); }
.badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
}
.badge-success { background: #ecfdf5; color: #047857; }
.badge-info { background: #eff6ff; color: #1d4ed8; }
.badge-warn { background: #fffbeb; color: #b45309; }

.tabs {
  display: inline-flex;
  border-radius: 11px;
  border: 1px solid var(--line);
  padding: 4px;
  background: #f8fafc;
}
.tab-btn {
  border: 0;
  background: transparent;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}
.tab-btn.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-soft); }

.table-wrap {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: auto;
}
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 860px;
}
.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f1f5f9;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 9px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}
.table tbody td {
  padding: 7px 9px;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
.table tbody tr:hover { background: #f8fafc; }

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--muted);
  font-size: 13px;
}

.dropdown,
.modal,
.toast {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}
.dropdown { padding: 8px; min-width: 200px; }
.modal { padding: 20px; max-width: 460px; }
.toast { padding: 12px 14px; position: fixed; right: 24px; bottom: 24px; display: none; }
.toast.show { display: block; animation: toast-in 180ms ease; }
@keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.center-wrap { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
.auth-card {
  width: min(500px, 100%);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: none;
  padding: 16px;
}
.form-grid { display: grid; gap: 6px; margin-top: 10px; }
label { font-size: 13px; color: #334155; font-weight: 600; }
.error { color: #b91c1c; min-height: 19px; font-size: 13px; margin: 0 0 8px; }

:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 1px;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.38);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
  z-index: 30;
}
.mobile-overlay.show,
.app-shell.mobile-open .mobile-overlay { opacity: 1; pointer-events: auto; }
.mobile-only { display: none; }



.template-tree-row {
  display: flex;
  align-items: center;
  min-height: 28px;
  gap: 6px;
}
.template-tree-guides {
  display: inline-flex;
  align-items: stretch;
  height: 20px;
}
.template-guide {
  width: 16px;
  border-left: 1px solid #cbd5e1;
  display: inline-block;
}
.template-guide.blank { border-left-color: transparent; }
.template-branch {
  position: relative;
  border-left: 1px solid #cbd5e1;
}
.template-branch::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 10px;
  border-top: 1px solid #cbd5e1;
}
.template-branch.end::before,
.template-branch.mid::before {
  content: "";
  position: absolute;
  left: 0;
  border-left: 1px solid #cbd5e1;
}
.template-branch.end::before { top: 0; height: 50%; }
.template-branch.mid::before { top: 0; height: 100%; }
.template-tree-label {
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}

.truncate-one-line {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subject-node-name-cell { max-width: 280px; }
.subject-node-actions-cell { width: 1%; white-space: nowrap; }
.subject-node-actions-row {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(180px, 220px) auto auto;
  gap: 6px;
  align-items: center;
}
.subject-node-checkbox { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }

.profile-hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}
.profile-avatar-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.profile-avatar {
  width: 86px;
  height: 86px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #f1f5f9;
  display: grid;
  place-items: center;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-avatar-form { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.profile-upload-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 136px; text-align: center; }
.profile-upload-btn .icon { width: 14px; height: 14px; }
.profile-file-input { width: 0.1px; height: 0.1px; opacity: 0; position: absolute; pointer-events: none; }
.profile-tabs-card { display: grid; gap: 12px; }
.profile-tabs { width: fit-content; }
.profile-tab-panel { display: grid; gap: 10px; }
.profile-readonly-row { display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid var(--line); border-radius: 10px; background: #f8fafc; }
.profile-fixed-value { margin: 2px 0 0; font-weight: 600; color: #0f172a; }
.profile-form-grid { display: grid; gap: 8px; max-width: 560px; }
.profile-form-grid label { display: flex; align-items: center; gap: 8px; }
.profile-form-grid label .icon { width: 15px; height: 15px; }
.profile-form-actions { display: flex; justify-content: flex-end; margin-top: 4px; }

@media (max-width: 1024px) {
  .grid-4,
  .grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 840px) {
  .app-shell,
  .app-shell.collapsed,
  .app-shell.collapsed.hover-expanded { grid-template-columns: 1fr; }
  .sidebar {
    transform: translateX(-100%);
    transition: transform 170ms ease;
    width: min(84vw, 310px);
  }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; }
  .main-shell::before,
  .main-shell::after { display: none; }
  .container { padding: 10px; }
  .topbar { padding: 0 16px; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-left { flex: 1; min-width: 0; }
  .login-note { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .grid-4,
  .grid-3,
  .grid-2 { grid-template-columns: 1fr; }
  .profile-hero { grid-template-columns: 1fr; }
  .profile-form-actions { justify-content: flex-start; }
  .card { padding: 10px; border-radius: 10px; }
  .kpi { font-size: 36px; }
  .page-title { font-size: 24px; }
  .auth-card { padding: 16px; }
}
`;
