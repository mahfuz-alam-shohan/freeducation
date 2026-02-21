export const styles = `
:root {
  color-scheme: light;
  --bg: #f5f7fb;
  --surface: #ffffff;
  --surface-soft: #f8fafc;
  --surface-muted: #f1f5f9;
  --line: #d6dee8;
  --line-strong: #c2ccd8;
  --text: #0f172a;
  --muted: #64748b;
  --primary: #334155;
  --primary-strong: #1e293b;
  --danger: #dc2626;
  --shadow-soft: 0 1px 2px rgba(15, 23, 42, 0.06);
  --radius-lg: 10px;
  --radius-md: 8px;
  --radius-sm: 6px;
  --sidebar-open: 248px;
  --sidebar-collapse: 72px;
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
  flex: 0 0 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  overflow: visible;
  scrollbar-gutter: stable;
  border-bottom: 1px solid var(--line);
  position: relative;
  background: #f8fafc;
  z-index: 1;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
.brand-logo {
  width: 34px;
  height: 34px;
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
  height: calc(100vh - 64px - 56px);
}
.sidebar-foot {
  flex: 0 0 56px;
  padding: 8px;
  border-top: 1px solid var(--line);
  background: #f8fafc;
}
.sidebar-foot .menu-item { margin: 0; }
.sidebar-login-note {
  padding: 2px 10px 10px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 8px;
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
.app-shell.collapsed .chevron,
.app-shell.collapsed .sidebar-login-note { opacity: 0; width: 0; display: none; }
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
.app-shell.collapsed.hover-expanded .chevron,
.app-shell.collapsed.hover-expanded .sidebar-login-note { display: initial; opacity: 1; width: auto; }
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
  padding: 0 12px;
  border-bottom: 1px solid var(--line);
  background: #ffffff;
}
.topbar-left,
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-center { display: none; }
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
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}
.mobile-menu-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
.mobile-icon {
  width: 24px;
  height: 24px;
  color: #0f172a;
  display: inline-grid;
  place-items: center;
}
.mobile-icon svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.2;
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
.avatar svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.profile-menu { position: relative; }
.profile-trigger {
  border: 0;
  background: transparent;
  padding: 0;
  border-radius: 999px;
  cursor: pointer;
}
.profile-popup {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 60;
  min-width: 220px;
  border: 1px solid #dbe4f3;
  background: linear-gradient(160deg, #ffffff, #f8fbff);
  border-radius: 12px;
  padding: 10px;
  display: grid;
  gap: 8px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
}
.profile-popup[hidden] { display: none; }
.profile-popup .muted {
  color: #475569;
  text-align: center;
}

.profile-popup-login-btn {
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  border: 1px solid #1d4ed8;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #eff6ff;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.profile-popup-login-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
}

.sidebar-login-item {
  margin-top: auto;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  background: #eff6ff;
}
.sidebar-login-item .icon { color: #1d4ed8; }
.sidebar-login-item:hover { background: #dbeafe; }

.container {
  width: min(1760px, 100%);
  margin: 0 auto;
  padding: 6px 8px;
}
.container-full-bleed {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}
.page-head { margin-bottom: 8px; }
.page-title { margin: 0; font-size: 26px; line-height: 1.2; letter-spacing: -0.02em; }
.page-subtitle { margin: 6px 0 0; color: var(--muted); font-size: 14px; }

.grid { display: grid; gap: 8px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.card {
  background: var(--surface);
  border: 1px solid #d8e3f2;
  border-radius: 6px;
  box-shadow: none;
  padding: 8px;
}
.card-title { margin: 0 0 6px; font-size: 15px; }
.section-stack { display: grid; gap: 8px; }
.section-gap-sm { margin-top: 8px; }
.inline-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.back-link { text-decoration: none; font-weight: 600; color: #334155; }
.back-link:hover { color: #0f172a; }
.table-empty { text-align: center; color: var(--muted); padding: 14px 10px; }

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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  min-height: 34px;
  padding: 0 10px;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
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
  height: 36px;
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 6px;
  padding: 0 10px;
  font-size: 15px;
  width: 100%;
}
.input,
.select,
textarea,
[contenteditable="true"] {
  -webkit-text-size-adjust: 100%;
}
.rich-editor {
  border: 1px solid #d0d7de;
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface);
}
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d8dee4;
  background: #f6f8fa;
}
.editor-mode-tabs { display: inline-flex; }
.editor-mode-tab {
  border: 0;
  background: transparent;
  color: #57606a;
  font-size: 13px;
  font-weight: 600;
  min-height: 32px;
  padding: 0 12px;
  cursor: pointer;
  border-right: 1px solid #d8dee4;
}
.editor-mode-tab.active {
  color: #24292f;
  background: #ffffff;
}
.editor-tools {
  display: flex;
  gap: 6px;
  padding: 6px;
  border-bottom: 1px solid #d8dee4;
  background: #f6f8fa;
  flex-wrap: wrap;
}
.editor-tools .btn {
  min-height: 28px;
  padding: 0 8px;
  border-color: #d0d7de;
  background: #ffffff;
  color: #24292f;
}
.editor-tools .btn.active {
  background: #e0e7ff;
  color: #1e1b4b;
  border-color: #a5b4fc;
}
.rich-editor-input,
.rich-editor-preview {
  min-height: 140px;
  padding: 10px;
  outline: none;
  line-height: 1.6;
  font-size: 16px;
}
.rich-editor-preview { background: #ffffff; }
.grid > .rich-editor { grid-column: 1 / -1; }
.rich-editor-input:empty::before {
  content: attr(data-editor-placeholder);
  color: var(--muted);
}
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


.flat-card {
  border-radius: 0;
  border-color: #d5dde7;
  padding: 6px;
}

.flat-grid-table {
  border-collapse: collapse;
  min-width: 920px;
}

.flat-grid-table thead th {
  background: #ffffff;
  text-transform: none;
  letter-spacing: normal;
  color: #334155;
  font-size: 13px;
  border: 1px solid #d5dde7;
}

.flat-grid-table tbody td {
  border: 1px solid #d5dde7;
  padding: 6px 8px;
}

.flat-grid-table tbody tr:hover { background: transparent; }

.subject-row-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.subject-row-actions .input {
  min-width: 180px;
  height: 32px;
}


.content-form-shell {
  display: grid;
  gap: 8px;
}

.content-form-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.content-form-shell [data-add-form-toggle] {
  display: none;
}

.content-form-shell [data-add-form-panel] {
  display: grid;
  gap: 8px;
}


.content-list {
  display: grid;
  gap: 8px;
}

.plain-two-column {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.plain-two-column > div {
  display: grid;
  gap: 8px;
}

.content-list > .muted {
  padding: 4px 2px;
}


.plain-entry { display: grid; gap: 5px; }

.plain-line-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 6px;
}

.note-actions-inline,
.mcq-actions-inline {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.btn-icon {
  min-height: 22px;
  min-width: 22px;
  padding: 0;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid var(--line);
  background: transparent;
}

.btn-icon-danger { color: var(--danger); }

.note-actions {
  margin-left: auto;
}

.note-content {
  line-height: 1.5;
  font-size: 14px;
}

.entry-media {
  margin: 2px 0 2px 18px;
}

.plain-media img { max-height: 140px; width: auto; }

.entry-media img {
  display: block;
  width: 100%;
  max-height: 260px;
  object-fit: contain;
}

.mcq-media {
  margin-top: 2px;
}

.mcq-label {
  font-weight: 700;
  color: #0f172a;
  font-size: 13px;
}

.mcq-question {
  font-size: 14px;
  line-height: 1.55;
}

.mcq-options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px 10px;
  margin-left: 18px;
}

.mcq-option {
  margin: 0;
  padding: 0;
  display: flex;
  gap: 6px;
  align-items: baseline;
  font-size: 14px;
}

.mcq-option-correct {
  color: #166534;
}

.mcq-option-correct .mcq-option-label {
  color: #166534;
}

.mcq-option-label {
  font-weight: 700;
  color: #334155;
}

.mcq-answer {
  margin: 0;
  font-size: 14px;
  color: #0f172a;
}

.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.note-numbering {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.note-number-link {
  color: var(--text);
  text-decoration: none;
  font-size: 13px;
}

.content-modal {
  border: 0;
  padding: 0;
  background: transparent;
  max-width: 900px;
  width: min(900px, 96vw);
}

.content-modal::backdrop {
  background: rgba(15, 23, 42, 0.45);
}

.content-modal-inner {
  max-width: none;
  max-height: 88vh;
  overflow: auto;
  border-radius: 10px;
  padding: 12px;
}

.content-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}

.page-links {
  display: inline-flex;
  gap: 4px;
}

.page-link {
  display: inline-flex;
  min-width: 24px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  padding: 0 6px;
  text-decoration: none;
  color: inherit;
  font-size: 12px;
}

.page-link.current {
  background: #e2e8f0;
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

.public-main-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.public-content-shell {
  flex: 1;
}

.public-home-cover {
  width: 100%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: linear-gradient(120deg, #0f3ea8, #2563eb 52%, #3b82f6);
  color: #eff6ff;
  padding: 20px 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}
.public-home-cover::before,
.public-home-cover::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: -1;
}
.public-home-cover::before {
  width: 310px;
  height: 310px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(191, 219, 254, 0.38) 0%, rgba(191, 219, 254, 0) 72%);
  top: -120px;
  left: -40px;
}
.public-home-cover::after {
  width: 240px;
  height: 240px;
  border-radius: 48px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(219, 234, 254, 0.04));
  right: -72px;
  bottom: -90px;
  transform: rotate(26deg);
}

.public-cover-brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.public-cover-logo {
  width: 54px;
  height: 54px;
  display: inline-grid;
  place-items: center;
}

.public-cover-logo svg {
  width: 100%;
  height: 100%;
}

.public-cover-name {
  margin: 0;
  font-size: clamp(34px, 6.7vw, 72px);
  line-height: 1;
  text-transform: lowercase;
  letter-spacing: -0.02em;
}

.public-cover-quote-wrap {
  justify-self: end;
  width: min(560px, 100%);
  padding: 0;
  border: 0;
  background: transparent;
  backdrop-filter: none;
}

.public-cover-quote {
  margin: 0;
  font-size: clamp(15px, 1.7vw, 24px);
  color: #dbeafe;
  min-height: 42px;
  line-height: 1.35;
}

.public-login-shell {
  padding: 10px 8px;
}

.public-auth-card {
  width: min(420px, 100%);
  border-radius: 6px;
}

.public-footer {
  border-top: 1px solid var(--line);
  padding: 6px 10px;
  color: var(--muted);
  font-size: 12px;
}
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





.toolbar-group form { margin: 0; }

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
  grid-template-columns: minmax(140px, 1fr) minmax(180px, 1fr) auto auto;
  gap: 6px;
  align-items: center;
}
.subject-node-checkbox { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }

.profile-hero {
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;
}
.profile-avatar-wrap {
  display: grid;
  justify-items: center;
  gap: 8px;
}
.profile-avatar {
  width: 128px;
  height: 128px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #f1f5f9;
  display: grid;
  place-items: center;
  font-size: 34px;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-avatar-form { display: flex; justify-content: center; }
.profile-upload-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 152px; text-align: center; }
.profile-upload-btn .icon,
.profile-form-grid .icon,
.btn-icon-inline .icon,
.profile-security-row .icon { width: 14px; height: 14px; }
.profile-file-input { width: 0.1px; height: 0.1px; opacity: 0; position: absolute; pointer-events: none; }
.profile-hero-meta { text-align: center; }
.profile-tabs-card { display: grid; gap: 10px; }
.profile-readonly-row { display: grid; gap: 2px; padding: 8px; border: 1px solid var(--line); border-radius: 10px; background: #f8fafc; }
.profile-fixed-value { margin: 0; font-weight: 600; color: #0f172a; }
.profile-form-grid { display: grid; gap: 7px; }
.profile-form-grid > * { min-width: 0; }
.profile-form-grid label { display: flex; align-items: center; gap: 6px; }
.profile-form-grid input[type="date"] {
  display: block;
  width: min(100%, 20rem);
  min-width: 0;
  max-width: 100%;
}
.profile-form-actions { display: flex; justify-content: flex-start; margin-top: 2px; }
.profile-label-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.btn-icon-inline { min-width: auto; padding: 6px 9px; }
.profile-security-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #f8fafc;
}


@media (min-width: 1600px) {
  .container {
    width: min(1860px, 100%);
  }
}

@media (max-width: 1024px) {
  .grid-4,
  .grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 840px) {
  .app-shell,
  .app-shell.collapsed,
  .app-shell.collapsed.hover-expanded { grid-template-columns: 1fr; }
  .app-shell.collapsed .brand-name,
  .app-shell.collapsed .label,
  .app-shell.collapsed .nav-group-title,
  .app-shell.collapsed .chevron,
  .app-shell.collapsed .sidebar-login-note {
    display: initial;
    opacity: 1;
    width: auto;
  }
  .app-shell.collapsed .brand {
    justify-content: initial;
    width: auto;
  }
  .app-shell.collapsed .menu-item,
  .app-shell.collapsed .submenu-item,
  .app-shell.collapsed .menu-expand {
    justify-content: flex-start;
    padding: 6px 10px;
  }
  .app-shell.collapsed .submenu {
    padding-left: 14px;
  }
  .sidebar {
    transform: translateX(-100%);
    transition: transform 170ms ease;
    width: min(84vw, 310px);
  }
  .sidebar-head {
    position: sticky;
    top: 0;
  }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; }
  .main-shell::before,
  .main-shell::after { display: none; }
  .container { padding: 6px 7px; }
  .topbar { padding: 0 10px; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-left,
  .topbar-right {
    flex: 0 0 36px;
    min-width: 36px;
    z-index: 1;
  }
  .topbar-right { justify-content: flex-end; }
  .topbar-center {
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    width: calc(100% - 100px);
    pointer-events: none;
  }
  .topbar-brand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .topbar-brand .brand-logo {
    width: 34px;
    height: 34px;
  }
  .topbar-brand .brand-name {
    font-size: 21px;
    line-height: 1;
  }
  .grid-4,
  .grid-3,
  .grid-2 { grid-template-columns: 1fr; }
  .plain-two-column { grid-template-columns: 1fr; }
  .profile-security-row { flex-direction: column; align-items: flex-start; }
  .profile-form-grid input[type="date"] {
    width: 100%;
  }
  .subject-node-actions-row {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
  .subject-node-actions-row .btn {
    width: fit-content;
  }
  .card { padding: 7px; border-radius: 8px; }
  .content-form-shell [data-add-form-toggle] {
    display: inline-flex;
    justify-content: center;
    min-width: 116px;
  }
  .content-form-shell [data-add-form-panel] {
    display: none;
  }
  .content-form-shell.form-expanded [data-add-form-panel] {
    display: grid;
  }
  .entry-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .note-line-wrap {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .mcq-entry-head {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .note-actions {
    width: auto;
    margin-left: 0;
    justify-content: flex-start;
  }
  .note-actions form {
    margin: 0;
  }
  .mcq-actions {
    width: auto;
    margin-left: 0;
  }
  .mcq-actions form {
    margin: 0;
  }
  .mcq-options-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 5px;
  }
  .mcq-option {
    padding: 6px;
    font-size: 13px;
  }
  .entry-media img {
    max-height: 210px;
  }
  .kpi { font-size: 36px; }
  .page-title { font-size: 24px; }
  .auth-card { padding: 16px; }
  .public-home-cover {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 14px 10px;
    text-align: center;
  }
  .public-cover-brand-row {
    justify-content: center;
    gap: 8px;
  }
  .public-cover-logo {
    width: 40px;
    height: 40px;
  }
  .public-cover-name {
    font-size: clamp(28px, 11vw, 40px);
  }
  .public-cover-quote-wrap {
    justify-self: center;
    width: min(100%, 620px);
    padding: 0;
  }
  .public-cover-quote {
    font-size: clamp(12px, 3.4vw, 15px);
    min-height: 34px;
  }
}
`;
