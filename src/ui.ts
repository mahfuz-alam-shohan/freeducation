// CSS Variables - Polished Mobile Aesthetic
export const CSS = `
:root {
  --primary: #4f46e5; --primary-active: #4338ca; --primary-bg: #eef2ff;
  --bg-body: #f2f2f7; /* iOS Light Gray */
  --bg-card: #ffffff;
  --text-main: #000000; --text-muted: #8e8e93; --text-light: #c7c7cc;
  --border: #c6c6c8; --border-light: #e5e5ea;
  --danger: #ff3b30; --success: #34c759;
  --radius: 10px;
  --nav-h: 60px;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif; background: var(--bg-body); color: var(--text-main); font-size: 17px; line-height: 1.4; padding-bottom: calc(var(--nav-h) + 20px); }
a { text-decoration: none; color: inherit; }
button { font-family: inherit; }

/* --- Layout --- */
.container { max-width: 600px; margin: 0 auto; padding: 1rem; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.page-title { font-size: 34px; font-weight: 700; letter-spacing: -0.5px; margin: 0; color: var(--text-main); }
.section-title { font-size: 13px; text-transform: uppercase; letter-spacing: -0.1px; color: var(--text-muted); margin: 1.5rem 0 0.5rem 1rem; font-weight: 400; }

/* --- Components --- */
.ios-list { background: var(--bg-card); border-radius: var(--radius); overflow: hidden; margin-bottom: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.ios-row { display: flex; align-items: center; padding: 11px 16px; background: var(--bg-card); border-bottom: 0.5px solid var(--border-light); min-height: 44px; transition: background 0.2s; cursor: pointer; }
.ios-row:last-child { border-bottom: none; }
.ios-row:active { background: #e5e5ea; }
.row-icon { margin-right: 12px; color: var(--primary); display: flex; align-items: center; }
.row-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.row-title { font-weight: 400; font-size: 17px; color: var(--text-main); }
.row-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.row-action { color: var(--text-light); display: flex; align-items: center; margin-left: 8px; }

/* --- Buttons --- */
.btn { border: none; background: none; font-size: 17px; color: var(--primary); font-weight: 400; padding: 8px 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s; }
.btn:active { opacity: 0.6; background: rgba(0,0,0,0.05); }
.btn-filled { background: var(--primary); color: white; font-weight: 600; padding: 10px 20px; border-radius: 99px; width: 100%; display: flex; justify-content: center; }
.btn-filled:active { background: var(--primary-active); }
.btn-sm { font-size: 15px; padding: 4px 10px; background: var(--primary-bg); border-radius: 6px; font-weight: 500; }
.btn-icon { padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
.btn-icon.danger { color: var(--danger); }

/* --- Accordion (Hierarchy) --- */
details { background: var(--bg-card); border-radius: var(--radius); overflow: hidden; margin-bottom: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
summary { padding: 12px 16px; font-weight: 600; cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
summary::-webkit-details-marker { display: none; }
summary:active { background: #f2f2f7; }
summary::after { content: '›'; font-size: 20px; color: var(--text-muted); transition: transform 0.2s; font-weight: 300; }
details[open] summary { border-bottom: 0.5px solid var(--border-light); }
details[open] summary::after { transform: rotate(90deg); }
.group-content { background: #fff; }
.nested-row { padding-left: 16px; border-bottom: 0.5px solid var(--border-light); } 

/* --- Inputs & Modals --- */
.input { width: 100%; padding: 12px; font-size: 17px; border: 1px solid var(--border-light); border-radius: 8px; background: #f2f2f7; margin-bottom: 1rem; outline: none; }
.input:focus { background: #fff; border-color: var(--primary); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); z-index: 200; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.modal-overlay.open { display: flex; opacity: 1; }
.modal-box { background: white; width: 90%; max-width: 400px; padding: 1.5rem; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); transform: scale(0.95); transition: transform 0.2s; }
.modal-overlay.open .modal-box { transform: scale(1); }

/* --- Navigation --- */
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-top: 0.5px solid var(--border); display: flex; justify-content: space-around; padding-bottom: env(safe-area-inset-bottom); z-index: 100; }
.nav-link { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 8px 0; color: var(--text-muted); font-size: 10px; font-weight: 500; }
.nav-link svg { width: 24px; height: 24px; margin-bottom: 2px; }
.nav-link.active { color: var(--primary); }

@media (min-width: 768px) {
  .container { max-width: 800px; margin-top: 2rem; }
  .bottom-nav { display: none; }
}
`;

export const SCRIPTS = `
<script>
  function openModal(id) {
    const el = document.getElementById(id);
    if(el) { el.style.display = 'flex'; setTimeout(() => el.style.opacity = '1', 10); }
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if(el) { el.style.opacity = '0'; setTimeout(() => el.style.display = 'none', 200); }
  }
  function openEditModal(modalId, action, data) {
    const modal = document.getElementById(modalId);
    if(!modal) return;
    const form = modal.querySelector('form');
    if(form) form.action = action;
    for (const [k, v] of Object.entries(data)) {
      const el = form.elements[k];
      if(el) el.type === 'checkbox' ? el.checked = !!v : el.value = v;
    }
    openModal(modalId);
  }
</script>
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string }, breadcrumbs?: string): Response {
  const navItems = [
    { id: 'dashboard', href: '/admin', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', label: 'Home' },
    { id: 'classes', href: '/admin/classes', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>', label: 'Classes' },
    { id: 'settings', href: '/admin/settings', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>', label: 'Settings' }
  ];

  const navHtml = user ? `
    <nav class="bottom-nav">
      ${navItems.map(i => `
        <a href="${i.href}" class="nav-link ${activeTab === i.id ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i.icon}</svg>
          <span>${i.label}</span>
        </a>
      `).join('')}
    </nav>
  ` : '';

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
    ${breadcrumbs ? `<div style="font-size:13px; color:var(--text-muted); margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">${breadcrumbs}</div>` : ''}
    ${content}
  </div>
  ${navHtml}
  ${SCRIPTS}
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}

export function escapeHtml(str: string | null | undefined) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


