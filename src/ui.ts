// CSS Variables - Compact & Mobile Optimized
export const CSS = `
:root {
  --primary: #4f46e5; --primary-soft: #eef2ff;
  --bg-body: #f3f4f6; --bg-surface: #ffffff;
  --text-main: #111827; --text-muted: #6b7280;
  --border: #e5e7eb; --danger: #ef4444; --success: #10b981;
  --nav-h: 60px; --header-h: 56px;
  --radius: 8px;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Inter", Roboto, sans-serif; background: var(--bg-body); color: var(--text-main); font-size: 15px; line-height: 1.4; padding-bottom: calc(var(--nav-h) + 1rem); }
a { text-decoration: none; color: inherit; }

/* --- Atomic Utilities --- */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 0.25rem; } .gap-2 { gap: 0.5rem; } .gap-3 { gap: 0.75rem; }
.text-sm { font-size: 0.85rem; } .text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 600; } .text-muted { color: var(--text-muted); }
.p-2 { padding: 0.5rem; } .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }

/* --- Components --- */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 0.9rem; border-radius: var(--radius); font-weight: 500; border: 1px solid transparent; cursor: pointer; font-size: 0.9rem; gap: 0.4rem; min-height: 38px; }
.btn-sm { padding: 0.3rem 0.6rem; font-size: 0.8rem; min-height: 32px; }
.btn-icon { padding: 0.4rem; border-radius: 50%; background: transparent; color: var(--text-muted); }
.btn-icon:hover { background: var(--bg-body); color: var(--text-main); }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:active { opacity: 0.9; }
.btn-white { background: white; border-color: var(--border); color: var(--text-main); }
.btn-danger { background: #fee2e2; color: #b91c1c; }

.input { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: var(--radius); font-size: 16px; outline: none; background: #fff; appearance: none; }
.input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-soft); }

/* --- Compact List Groups --- */
.list-group { background: var(--bg-surface); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.list-item { display: flex; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); background: var(--bg-surface); transition: background 0.1s; }
.list-item:last-child { border-bottom: none; }
.list-item:active { background: #f9fafb; }
.list-content { flex: 1; min-width: 0; }
.list-title { font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-meta { font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 0.5rem; align-items: center; margin-top: 0.15rem; }

/* --- Layout --- */
.mobile-header { position: sticky; top: 0; z-index: 40; height: var(--header-h); background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; }
.main-container { max-width: 600px; margin: 0 auto; padding: 1rem; }
.page-title { font-size: 1.25rem; font-weight: 700; margin: 0; }

/* --- Bottom Nav --- */
.mobile-nav { position: fixed; bottom: 0; left: 0; right: 0; height: var(--nav-h); background: white; border-top: 1px solid var(--border); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #9ca3af; font-size: 0.7rem; font-weight: 500; width: 100%; padding: 0.5rem 0; }
.nav-item svg { width: 22px; height: 22px; stroke-width: 2; }
.nav-item.active { color: var(--primary); }

/* --- Badges --- */
.badge { padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
.badge.blue { background: #eff6ff; color: #3b82f6; border-color: #dbeafe; }
.badge.purple { background: #faf5ff; color: #a855f7; border-color: #f3e8ff; }

/* --- Modals --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center; padding: 1rem; opacity: 0; transition: opacity 0.2s; }
.modal-overlay.open { display: flex; opacity: 1; }
.modal-box { background: white; width: 100%; max-width: 400px; padding: 1.25rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transform: scale(0.95); transition: transform 0.2s; }
.modal-overlay.open .modal-box { transform: scale(1); }

/* Desktop */
@media (min-width: 768px) {
  .main-container { max-width: 800px; padding: 2rem; }
  .mobile-nav { display: none; }
  .mobile-header { display: none; } /* Could add desktop sidebar back if needed, but keeping simple for now */
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
  
  // Generic Edit Filler
  function openEditModal(modalId, formAction, data) {
    const modal = document.getElementById(modalId);
    if(!modal) return;
    
    // Update Form Action
    const form = modal.querySelector('form');
    if(form) form.action = formAction;

    // Fill Inputs
    for (const [key, value] of Object.entries(data)) {
      const input = form.elements[key];
      if (input) {
         if(input.type === 'checkbox') input.checked = !!value;
         else input.value = value;
      }
    }
    openModal(modalId);
  }
</script>
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string, email: string }, breadcrumbs?: string): Response {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <title>${title} | Admin</title>
  <style>${CSS}</style>
</head>
<body>
  ${user ? renderAuthenticatedLayout(content, activeTab, user, breadcrumbs) : content}
  ${SCRIPTS}
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}

function renderAuthenticatedLayout(content: string, activeTab: string, user: { name: string }, breadcrumbsHtml: string = "") {
  const navItems = [
    { id: 'dashboard', label: 'Home', href: '/admin', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
    { id: 'classes', label: 'Classes', href: '/admin/classes', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>' },
    { id: 'settings', label: 'Settings', href: '/admin/settings', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' },
  ];

  const mobileNavHtml = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${activeTab === item.id ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      <span>${item.label}</span>
    </a>
  `).join('');

  return `
      <!-- Header -->
      <header class="mobile-header">
         <div class="font-bold text-lg" style="color:var(--primary);">Freeducation</div>
         <div class="flex items-center gap-2">
            <span class="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-muted">${user.name}</span>
         </div>
      </header>

      <!-- Main Content -->
      <main class="main-container">
        ${breadcrumbsHtml ? `<div class="flex items-center gap-2 text-sm text-muted mb-3 overflow-x-auto whitespace-nowrap">${breadcrumbsHtml}</div>` : ''}
        ${content}
      </main>

      <!-- Bottom Nav -->
      <nav class="mobile-nav">
        ${mobileNavHtml}
      </nav>
  `;
}

export function escapeHtml(str: string | null | undefined) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


