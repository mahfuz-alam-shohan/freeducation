// CSS Variables - "Inset Grouped" Aesthetic (Beautiful & Compact)
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

:root {
  --primary: #118C4F;
  --primary-bg: #EAF6EF;
  --bg-body: #F6F7FB;
  --bg-card: #FFFFFF;
  --text-main: #121417;
  --text-secondary: #6C7480;
  --separator: #D0D4DA;
  --separator-light: #E7E9EF;
  --danger: #D6453A;
  --success: #2E9B57;
  --radius: 12px;
  --nav-h: 64px;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  font-family: "Hind Siliguri", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: var(--bg-body);
  color: var(--text-main);
  font-size: 16px;
  line-height: 1.55;
  padding-bottom: calc(var(--nav-h) + 20px);
}

a { text-decoration: none; color: inherit; }
button { font-family: inherit; border: none; background: none; padding: 0; cursor: pointer; }

/* --- Layout --- */
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.2rem 1rem 2rem;
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
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.06);
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
  background: #E5E5EA;
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
  color: var(--primary);
  font-size: 15px;
  font-weight: 600;
}

.btn-icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.btn-icon-circle:active { background: #D1D1D6; }

.btn-icon {
  color: var(--primary);
  font-size: 18px;
  font-weight: 600;
}

.btn-muted {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
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
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.06);
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
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-top: 0.5px solid var(--separator);
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
`;

export const SCRIPTS = `
<script>
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
</script>
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string }, breadcrumbs?: string): Response {
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
  <div class="container">
    ${breadcrumbs ? `<div style="font-size:13px; color:var(--text-secondary); margin-bottom:0.5rem; display:flex; align-items:center; gap:6px;">${breadcrumbs}</div>` : ''}
    ${content}
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
  
  ${SCRIPTS}
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}

export function escapeHtml(str: string | null | undefined) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
