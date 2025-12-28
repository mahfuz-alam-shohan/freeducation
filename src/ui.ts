// CSS Variables
export const CSS = `
:root {
  --primary: #6366f1; --primary-dark: #4f46e5;
  --bg-body: #f8fafc; --bg-card: #ffffff;
  --text-main: #0f172a; --text-muted: #64748b;
  --border: #e2e8f0; --danger: #ef4444; --success: #22c55e;
  --sidebar-w: 260px; --nav-h: 64px;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg-body); color: var(--text-main); font-size: 16px; line-height: 1.5; }

/* --- Components --- */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 1.2rem; border-radius: 0.75rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; gap: 0.5rem; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2); }
.btn-primary:active { transform: scale(0.98); }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-danger { background: #fee2e2; color: var(--danger); }
.input { width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.75rem; font-size: 1rem; outline: none; transition: border-color 0.2s; background: #fff; }
.input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.card { background: var(--bg-card); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05); border: 1px solid var(--border); margin-bottom: 1rem; }
.badge { padding: 0.25rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.badge-blue { background: #e0e7ff; color: var(--primary-dark); }
.badge-gray { background: #f1f5f9; color: var(--text-muted); }

/* --- Layout System (Refixed) --- */

.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column; /* Mobile Default */
}

.sidebar {
  display: none; /* Hidden on Mobile */
  width: var(--sidebar-w);
  background: white;
  border-right: 1px solid var(--border);
  padding: 1.5rem;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: calc(var(--nav-h) + 2rem); /* Space for bottom nav */
}

.mobile-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: white; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 40; }
.desktop-header { display: none; margin-bottom: 2rem; justify-content: space-between; align-items: center; }

.mobile-nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid var(--border); height: var(--nav-h); display: flex; align-items: center; justify-content: space-around; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.nav-item { display: flex; flex-direction: column; align-items: center; font-size: 0.7rem; color: var(--text-muted); text-decoration: none; gap: 4px; padding: 0.5rem; flex: 1; }
.nav-item svg { width: 24px; height: 24px; stroke-width: 2; }
.nav-item.active { color: var(--primary); }

/* Desktop Switch */
@media (min-width: 800px) {
  .app-shell { flex-direction: row; }
  .sidebar { display: flex; }
  .mobile-nav, .mobile-header { display: none; }
  .desktop-header { display: flex; }
  .main-content { padding: 2.5rem; padding-bottom: 2.5rem; }
}

/* --- Utilities --- */
.logo { font-weight: 800; font-size: 1.25rem; color: var(--primary-dark); display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.alert { padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem; font-weight: 500; font-size: 0.9rem; }
.alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 200; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
.modal-target:target { opacity: 1; pointer-events: auto; }
.modal-box { background: white; width: 90%; max-width: 500px; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); transform: scale(0.95); transition: transform 0.2s; }
.modal-target:target .modal-box { transform: scale(1); }
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string, email: string }): Response {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <title>${title} | Freeducation Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  ${user ? renderAuthenticatedLayout(content, activeTab, user) : content}
</body>
</html>`, {
    headers: { "Content-Type": "text/html" }
  });
}

function renderAuthenticatedLayout(content: string, activeTab: string, user: { name: string }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', href: '/admin' },
    { id: 'classes', label: 'Classes', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>', href: '/admin/classes' },
    { id: 'subjects', label: 'Subjects', icon: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 016.5 7H20"></path><path d="M6.5 7v10"></path><path d="M20 7v10"></path><path d="M10 9h6"></path><path d="M10 13h6"></path>', href: '/admin/subjects' },
    { id: 'settings', label: 'Settings', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>', href: '/admin/settings' },
  ];

  const renderNavLinks = (isMobile: boolean) => navItems.map(item => `
    <a href="${item.href}" class="nav-item ${activeTab === item.id ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      <span>${item.label}</span>
    </a>
  `).join('');

  return `
    <div class="app-shell">
      <header class="mobile-header">
        <a href="/admin" class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Freeducation
        </a>
        <div class="user-avatar" style="width:32px;height:32px;background:#e0e7ff;color:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;">
          ${user.name.charAt(0).toUpperCase()}
        </div>
      </header>

      <aside class="sidebar">
        <a href="/admin" class="logo" style="margin-bottom: 2rem;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Freeducation
        </a>
        <nav style="display:flex; flex-direction:column; gap:0.5rem; flex:1;">
          ${navItems.map(item => `
            <a href="${item.href}" style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; border-radius:0.5rem; color:${activeTab === item.id ? 'var(--primary-dark)' : 'var(--text-muted)'}; background:${activeTab === item.id ? '#e0e7ff' : 'transparent'}; text-decoration:none; font-weight:500;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
              ${item.label}
            </a>
          `).join('')}
        </nav>
        <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border);">
           <div style="font-size:0.85rem; font-weight:600;">${user.name}</div>
           <form action="/admin/logout" method="POST" style="margin-top:0.5rem;">
             <button class="btn-ghost" style="padding:0; font-size:0.8rem; color:var(--danger);">Sign Out</button>
           </form>
        </div>
      </aside>

      <main class="main-content">
        <header class="desktop-header">
          <h1 style="font-size:1.5rem; font-weight:700; margin:0;">Admin Console</h1>
          <span class="badge badge-gray">v1.1.0</span>
        </header>
        ${content}
      </main>

      <nav class="mobile-nav">
        ${renderNavLinks(true)}
      </nav>
    </div>
  `;
}

export function escapeHtml(str: string) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

