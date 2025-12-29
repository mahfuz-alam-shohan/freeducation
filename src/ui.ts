// CSS Variables - "Inset Grouped" Aesthetic (Beautiful & Compact)
export const CSS = `
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
  padding: 18px 22px;
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
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top left, #6fd6ff 0%, var(--primary) 55%, var(--primary-dark) 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(45, 127, 249, 0.35);
}

.brand-title {
  font-size: 18px;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
  font-weight: 500;
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
  max-width: 100%;
  margin: 0;
  padding: 1.4rem 1.5rem 2.5rem;
  flex: 1;
  overflow: auto;
  min-height: 0;
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
}

.page-title {
  font-size: 30px;
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
  width: 32px;
  height: 32px;
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
  color: var(--primary);
  font-size: 18px;
  font-weight: 600;
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
  height: var(--nav-h);
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

@media (max-width: 900px) {
  .app-shell { padding: 0; }
  .app-frame { border-radius: 0; }
  .app-header { padding: 16px 16px; }
  .container { padding: 1.1rem 1rem 2rem; }
  .page-title { font-size: 26px; }
}

@media (max-width: 640px) {
  .app-shell { padding: 0; }
  .app-frame {
    border-radius: 0;
    box-shadow: none;
  }
  .brand-logo { width: 36px; height: 36px; }
  .brand-title { font-size: 16px; }
  .brand-subtitle { display: none; }
  .container { padding: 1rem 0.9rem 1.8rem; }
}
`;

export const SCRIPTS = `
<script>
  function updateQuestionForm(target) {
    const form = target?.closest('[data-question-form]') || target;
    if (!form) return;
    const typeSelect = form.querySelector('select[name="type"]');
    const typeInput = form.querySelector('input[name="type"]');
    const type = (typeSelect && typeSelect.value) || (typeInput && typeInput.value) || form.getAttribute('data-question-type') || '';
    const sourceField = form.querySelector('[data-question-source]');
    const sourceInput = form.querySelector('input[name="source_label"]');
    const needsSource = ["board", "versity", "college"].includes(type);
    if (sourceField) sourceField.style.display = needsSource ? '' : 'none';
    if (sourceInput) sourceInput.required = needsSource;

    const mcqBlock = form.querySelector('[data-question-mcq]');
    const answerBlock = form.querySelector('[data-question-answer]');
    const isMcq = type === 'mcq';
    if (mcqBlock) mcqBlock.style.display = isMcq ? '' : 'none';
    if (answerBlock) answerBlock.style.display = isMcq ? 'none' : '';

    const answerTypeSelect = form.querySelector('select[name="answer_type"]');
    const answerMediaField = form.querySelectorAll('[data-question-attachment]');
    if (answerTypeSelect) {
      const showMedia = answerTypeSelect.value !== 'text';
      answerMediaField.forEach((field, idx) => {
        if (idx === 1 && field instanceof HTMLElement) {
          field.style.display = showMedia ? '' : 'none';
        }
      });
    }
  }

  function toggleModal(id, show) {
    const el = document.getElementById(id);
    if(show) {
      el.classList.add('open');
    } else {
      el.classList.remove('open');
    }
  }

  function openEdit(modalId, action, data) {
    const modal = document.getElementById(modalId);
    if(!modal) return;
    const form = modal.querySelector('form');
    if(form) form.action = action;
    
    // Auto-fill
    for (const [key, val] of Object.entries(data)) {
      const input = form.elements[key];
      if(input) {
        if(input.type === 'checkbox') input.checked = !!val;
        else input.value = val;
      }
    }
    toggleModal(modalId, true);
  }

  function filterList(inputId, rowSelector) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll(rowSelector).forEach((row) => {
      const label = (row.getAttribute('data-filter') || row.textContent || '').toLowerCase();
      row.style.display = label.includes(query) ? '' : 'none';
    });
  }

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('select[name="type"], select[name="answer_type"]')) {
      updateQuestionForm(target);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-question-form]').forEach((form) => updateQuestionForm(form));
  });
</script>
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string }, breadcrumbs?: string): Response {
  const logoMark = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 8l8-4 8 4-8 4-8-4z"></path>
      <path d="M8 12v4.5c0 .9 3.2 2.5 4 2.5s4-1.6 4-2.5V12"></path>
      <path d="M4 8v5c0 2.5 4 4.5 8 4.5"></path>
    </svg>
  `;
  const navItems = [
    { id: 'dashboard', href: '/admin', icon: '<path d="M3 11l9-7 9 7"></path><path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"></path><path d="M9 21v-6h6v6"></path>', label: 'Home' },
    { id: 'classes', href: '/admin/classes', icon: '<path d="M4 4h10a2 2 0 0 1 2 2v14"></path><path d="M4 4v14a2 2 0 0 0 2 2h12"></path><path d="M8 8h8"></path><path d="M8 12h8"></path><path d="M8 16h6"></path>', label: 'Classes' },
    { id: 'settings', href: '/admin/settings', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0 2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>', label: 'Settings' }
  ];

  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <title>${title} | Admin</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="app-shell">
    <div class="app-frame">
      <header class="app-header">
        <div class="brand">
          <div class="brand-logo">${logoMark}</div>
          <div>
            <div class="brand-title">Freeducation</div>
            <div class="brand-subtitle">Admin Workspace</div>
          </div>
        </div>
        <div class="header-actions">
          ${user ? `<span class="user-chip">${user.name}</span>` : `<span class="user-chip">Admin Console</span>`}
        </div>
      </header>
      <div class="app-body">
        <div class="container">
          ${breadcrumbs ? `<div class="breadcrumbs">${breadcrumbs}</div>` : ''}
          ${content}
        </div>
      </div>
      ${user ? `
        <nav class="bottom-nav">
          ${navItems.map(i => `
            <a href="${i.href}" class="nav-item ${activeTab === i.id ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i.icon}</svg>
              <span>${i.label}</span>
            </a>
          `).join('')}
        </nav>
      ` : ''}
    </div>
  </div>

  ${SCRIPTS}
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}

export function escapeHtml(str: string | null | undefined) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
