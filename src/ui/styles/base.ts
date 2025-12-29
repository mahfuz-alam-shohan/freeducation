export const baseStyles = `

@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

:root {
  --primary: #2d7ff9;
  --primary-dark: #1f5ec7;
  --primary-bg: #e7f0ff;
  --bg-body: #eef2f8;
  --bg-card: #ffffff;
  --bg-surface: #f7f9fc;
  --text-main: #0b1421;
  --text-secondary: #4a5563;
  --text-muted: #7a8596;
  --separator: #d9e2ef;
  --separator-light: #e7edf6;
  --danger: #d6453a;
  --success: #2e9b57;
  --radius: 18px;
  --nav-h: 68px;
  --shadow-soft: 0 18px 40px rgba(7, 18, 43, 0.08);
  --shadow-card: 0 12px 28px rgba(7, 18, 43, 0.06);
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-family: "Hind Siliguri", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: var(--bg-body);
  color: var(--text-main);
  font-size: 16px;
  line-height: 1.55;
  overflow: hidden;
}

a { text-decoration: none; color: inherit; }
button { font-family: inherit; border: none; background: none; padding: 0; cursor: pointer; }
img,
video,
canvas,
svg {
  max-width: 100%;
  height: auto;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid rgba(45, 127, 249, 0.35);
  outline-offset: 2px;
}

/* --- Layout --- */
.app-shell {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding: 0;
}

.app-frame {
  width: 100%;
  background: var(--bg-surface);
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  border: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--separator-light);
}

.app-body {
  flex: 1;
  background: var(--bg-surface);
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top left, #6fd6ff 0%, var(--primary) 55%, var(--primary-dark) 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(45, 127, 249, 0.35);
}

.brand-title {
  font-size: 16px;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
  font-weight: 500;
  display: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--primary-bg);
  color: var(--primary-dark);
  font-weight: 600;
  font-size: 12px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0.9rem 1.8rem;
  flex: 1;
  overflow: auto;
  min-height: 0;
  width: 100%;
}

.header {
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}
.header-split {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.2px;
  margin: 0;
  color: var(--text-main);
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumbs {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 0.5rem;
}

/* --- Inset Grouped Lists (The Core Design) --- */
.list-header {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin: 1.5rem 0 0.5rem 1rem;
  font-weight: 600;
  letter-spacing: 0.6px;
  display: flex;
  align-items: center;
}
.list-header-split {
  justify-content: space-between;
}

.inset-list {
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-card);
}

.list-row {
  display: flex;
  align-items: center;
  padding: 11px 16px;
  background: var(--bg-card);
  position: relative;
  transition: background 0.2s;
  min-height: 44px;
}

.list-row:active {
  background: #f1f4f2;
}
.list-row:hover {
  background: #f5f7fb;
}

/* Separator lines that don't touch the left edge (like iOS) */
.list-row:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px; /* Inset separator */
  right: 0;
  height: 0.5px;
  background: var(--separator-light);
}

.row-icon {
  margin-right: 12px;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* Text truncation fix */
}

.row-title {
  font-size: 16px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-action {
  color: var(--text-secondary); /* Chevron color */
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.row-action:hover {
  background: #f2f6ff;
  border-color: var(--separator-light);
  color: var(--primary-dark);
}

/* --- Buttons & Badges --- */
.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--separator-light);
  background: var(--bg-card);
  color: var(--primary-dark);
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 8px 18px rgba(7, 18, 43, 0.08);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-text:focus-visible {
  border-radius: 999px;
}
.btn-text:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(7, 18, 43, 0.12);
}
.btn-text:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(19, 107, 69, 0.24);
}

.btn-secondary {
  background: white;
  border: 1px solid var(--separator-light);
  color: var(--text-main);
}

.btn:active {
  transform: translateY(1px);
  box-shadow: none;
}

.btn-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: white;
  color: var(--primary-dark);
  border: 1px solid var(--separator-light);
  box-shadow: 0 8px 18px rgba(7, 18, 43, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.btn-icon-circle:active {
  background: #E8EDF6;
  box-shadow: none;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  border-radius: 10px;
  border: 1px solid var(--separator-light);
  background: #ffffff;
  color: var(--primary-dark);
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 6px 12px rgba(7, 18, 43, 0.08);
}

.btn-muted {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--separator-light);
  background: white;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(7, 18, 43, 0.06);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: var(--primary-bg);
  color: var(--text-secondary);
}
.badge.blue { color: var(--primary); background: #E0EBFF; }
.badge.purple { color: #AF52DE; background: #F2E6FF; }

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: none;
  background: var(--primary-bg);
  color: var(--primary);
}
.tag-linked::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
}

/* --- Modals (Clean & Centered) --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
.modal-overlay.open { display: flex; opacity: 1; }

.modal-card {
  background: #F9F9F9; /* Slightly off-white for depth */
  width: 85%;
  max-width: 360px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  transform: scale(0.95);
  transition: transform 0.2s;
}
.modal-overlay.open .modal-card { transform: scale(1); }

.modal-header {
  padding: 16px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 0.5px solid var(--separator-light);
  background: white;
}

.modal-body {
  padding: 16px;
}

.input-group {
  background: white;
  border-radius: 8px;
  padding: 0 12px;
  border: 0.5px solid var(--separator-light);
  margin-bottom: 12px;
}

.input {
  width: 100%;
  padding: 12px 0;
  font-size: 15px;
  border: none;
  outline: none;
  background: transparent;
}
.input::placeholder {
  color: var(--text-muted);
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-row-label {
  font-size: 14px;
  color: var(--text-main);
}

.toggle {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.modal-actions {
  display: flex;
  border-top: 0.5px solid var(--separator);
}

.modal-btn {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 15px;
  color: var(--primary);
  background: rgba(255,255,255,0.8);
  font-weight: 400;
  border-right: 0.5px solid var(--separator);
}
.modal-btn:last-child { border-right: none; font-weight: 600; }
.modal-btn.danger { color: var(--danger); font-weight: 600; }
.modal-btn:active { background: #E5E5EA; }
.modal-btn:disabled { color: var(--text-secondary); cursor: not-allowed; }

.helper-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 14px 16px;
  box-shadow: var(--shadow-card);
  margin-bottom: 1.25rem;
}

.helper-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.helper-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.helper-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.45;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--separator-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-secondary);
  font-weight: 600;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  margin-top: 6px;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--primary-bg);
  color: var(--primary-dark);
  display: grid;
  place-items: center;
}

.search-row {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 12px 16px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--separator-light);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  border: none;
  outline: none;
  font-size: 15px;
  flex: 1;
  background: transparent;
}

.order-chip {
  min-width: 54px;
  padding: 6px 10px;
  margin-right: 12px;
  border-radius: 999px;
  background: var(--primary-bg);
  color: var(--primary-dark);
  font-weight: 700;
  font-size: 12px;
  text-align: center;
}

.order-chip span {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
  font-weight: 600;
}

.empty-state {
  padding: 16px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.action-row {
  padding: 0 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.inline-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.linked-text {
  color: var(--primary);
  font-weight: 600;
  margin-left: 4px;
}

/* --- Bottom Nav --- */
.bottom-nav {
  position: sticky;
  bottom: 0;
  background: var(--bg-card);
  border-top: 1px solid var(--separator-light);
  display: flex;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(var(--nav-h) + env(safe-area-inset-bottom));
  z-index: 500;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
}
.nav-item.active { color: var(--primary); }
.nav-item svg { width: 24px; height: 24px; }

@media (min-width: 640px) {
  .app-header { padding: 18px 20px; }
  .container { padding: 1.1rem 1rem 2rem; }
  .header-split { align-items: flex-start; }
  .page-title { font-size: 26px; }
  .action-row { padding: 0; }
  .search-row { padding: 10px 12px; }
  .list-row { padding: 12px 12px; }
  .btn-text { padding: 8px 12px; }
}

@media (min-width: 900px) {
  .app-shell { padding: 24px; }
  .app-frame {
    border-radius: 26px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--separator-light);
  }
  .app-header { padding: 18px 22px; }
  .brand-logo { width: 40px; height: 40px; }
  .brand-title { font-size: 18px; }
  .brand-subtitle { display: block; }
  .container { padding: 1.4rem 1.5rem 2.5rem; }
  .page-title { font-size: 30px; }
  .stat-card { flex-direction: row; align-items: center; }
}
`;
