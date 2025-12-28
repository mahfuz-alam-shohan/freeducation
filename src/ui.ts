// CSS Variables - Optimized for Mobile
export const CSS = `
:root {
  --primary: #6366f1; --primary-dark: #4f46e5; --primary-light: #e0e7ff;
  --bg-body: #f1f5f9; --bg-card: #ffffff;
  --text-main: #0f172a; --text-muted: #64748b;
  --border: #e2e8f0; --danger: #ef4444; --success: #22c55e;
  --sidebar-w: 260px; --nav-h: 64px; --header-h: 60px;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif; background: var(--bg-body); color: var(--text-main); font-size: 16px; line-height: 1.5; padding-bottom: calc(var(--nav-h) + 20px); }

/* --- Components --- */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 1rem; border-radius: 0.75rem; font-weight: 600; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; gap: 0.5rem; min-height: 44px; /* Touch target */ }
.btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; min-height: 36px; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.25); border-color: transparent; }
.btn-primary:active { transform: scale(0.98); }
.btn-white { background: white; color: var(--text-main); border-color: var(--border); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-ghost:active { background: var(--bg-body); color: var(--text-main); }
.btn-danger { background: #fee2e2; color: var(--danger); border-color: transparent; }

/* Mobile Input Optimization (16px prevents iOS zoom) */
.input { width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.75rem; font-size: 16px; outline: none; transition: border-color 0.2s; background: #fff; appearance: none; }
.input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.select { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.2em; padding-right: 2.5rem; }

.card { background: var(--bg-card); border-radius: 1rem; border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 1rem; }
.card-body { padding: 1.25rem; }
.card-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fff; }
.card-header h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-main); }

/* --- Mobile-First "Table" (Cards) --- */
.table-container { width: 100%; }
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.data-table thead { display: none; } /* Hide headers on mobile */
.data-table tr { display: flex; flex-direction: column; background: white; margin-bottom: 1rem; border: 1px solid var(--border); border-radius: 1rem; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.data-table td { display: flex; justify-content: space-between; align-items: center; padding: 0.25rem 0; border: none; font-size: 0.95rem; }
.data-table td::before { content: attr(data-label); font-weight: 600; color: var(--text-muted); font-size: 0.85rem; margin-right: 1rem; }
.data-table td:first-child { font-weight: 700; font-size: 1.1rem; color: var(--primary); padding-bottom: 0.5rem; display: block; } /* Main Title Row */
.data-table td:first-child::before { display: none; }
.data-table td:last-child { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border); justify-content: flex-end; gap: 0.5rem; width: 100%; }
.data-table td:last-child::before { display: none; }

/* Desktop Overrides */
@media (min-width: 768px) {
  .data-table { display: table; border-collapse: collapse; }
  .data-table thead { display: table-header-group; }
  .data-table tr { display: table-row; background: transparent; box-shadow: none; border: none; margin: 0; border-radius: 0; }
  .data-table th { text-align: left; padding: 0.75rem 1.5rem; background: #f8fafc; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
  .data-table td { display: table-cell; padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--border); text-align: left; }
  .data-table td::before { display: none; }
  .data-table td:first-child { display: table-cell; font-weight: 400; font-size: 1rem; color: inherit; padding-bottom: 0.75rem; }
  .data-table td:last-child { margin: 0; padding: 0.75rem 1.5rem; border-top: none; justify-content: flex-end; width: auto; }
}

/* --- Layout --- */
.app-shell { display: flex; min-height: 100vh; flex-direction: column; }
.sidebar { display: none; } /* Hidden on Mobile */
.mobile-header { position: sticky; top: 0; z-index: 50; height: var(--header-h); background: white; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 1.25rem; }
.main-content { padding: 1.25rem; width: 100%; max-width: 800px; margin: 0 auto; }
.header-bar { margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.5rem 0; letter-spacing: -0.02em; }
.action-bar { display: flex; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap; }
.action-bar .btn { flex: 1; }

/* Bottom Nav (Mobile Only) */
.mobile-nav { position: fixed; bottom: 0; left: 0; right: 0; height: var(--nav-h); background: white; border-top: 1px solid var(--border); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -4px 20px rgba(0,0,0,0.05); }
.nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--text-muted); text-decoration: none; font-size: 0.7rem; font-weight: 600; width: 100%; height: 100%; }
.nav-item svg { width: 24px; height: 24px; stroke-width: 2px; }
.nav-item.active { color: var(--primary); }

/* --- Breadcrumbs --- */
.breadcrumbs { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; overflow-x: auto; white-space: nowrap; padding-bottom: 4px; }
.breadcrumbs a { color: var(--text-muted); text-decoration: none; }
.breadcrumbs span { color: var(--text-main); font-weight: 600; }
.breadcrumb-sep { color: #cbd5e1; }

/* --- Badges & Utility --- */
.badge { display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; line-height: 1; text-transform: uppercase; letter-spacing: 0.03em; }
.badge-blue { background: #eff6ff; color: var(--primary); border: 1px solid #dbeafe; }
.badge-gray { background: #f8fafc; color: var(--text-muted); border: 1px solid var(--border); }
.badge-purple { background: #faf5ff; color: #9333ea; border: 1px solid #f3e8ff; }

/* --- Modals --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: flex-end; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
.modal-target:target { opacity: 1; pointer-events: auto; }
.modal-box { background: white; width: 100%; max-width: 500px; padding: 1.5rem; border-radius: 1.5rem 1.5rem 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,0.1); transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); max-height: 90vh; overflow-y: auto; }
.modal-target:target .modal-box { transform: translateY(0); }

@media (min-width: 768px) {
  .app-shell { flex-direction: row; padding-bottom: 0; }
  .sidebar { display: flex; width: var(--sidebar-w); background: white; border-right: 1px solid var(--border); padding: 1.5rem; flex-direction: column; height: 100vh; position: sticky; top: 0; }
  .mobile-nav, .mobile-header { display: none; }
  .main-content { padding: 2rem 3rem; margin: 0; max-width: 1200px; }
  .modal-overlay { align-items: center; }
  .modal-box { border-radius: 1rem; transform: scale(0.95); width: 90%; }
  .modal-target:target .modal-box { transform: scale(1); }
  .action-bar .btn { flex: initial; }
}
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string, email: string }, breadcrumbs?: string): Response {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <title>${title} | Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  ${user ? renderAuthenticatedLayout(content, activeTab, user, breadcrumbs) : content}
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}

function renderAuthenticatedLayout(content: string, activeTab: string, user: { name: string }, breadcrumbsHtml: string = "") {
  const navItems = [
    { id: 'dashboard', label: 'Home', href: '/admin', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
    { id: 'classes', label: 'Classes', href: '/admin/classes', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>' },
    { id: 'settings', label: 'Settings', href: '/admin/settings', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' },
  ];

  const mobileLinks = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${activeTab === item.id ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      <span>${item.label}</span>
    </a>
  `).join('');

  const desktopLinks = navItems.map(item => `
    <a href="${item.href}" style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; border-radius:0.75rem; color:${activeTab === item.id ? 'var(--primary-dark)' : 'var(--text-muted)'}; background:${activeTab === item.id ? '#e0e7ff' : 'transparent'}; text-decoration:none; font-weight:600; font-size:0.95rem;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      ${item.label}
    </a>
  `).join('');

  return `
    <div class="app-shell">
      <!-- Mobile Top Bar -->
      <header class="mobile-header">
         <div style="font-weight:800; font-size:1.1rem; color:var(--primary);">Freeducation</div>
         <div style="width:32px; height:32px; background:#e0e7ff; color:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem;">
            ${user.name.charAt(0)}
         </div>
      </header>

      <!-- Desktop Sidebar -->
      <aside class="sidebar">
        <a href="/admin" style="font-weight:800; font-size:1.4rem; text-decoration:none; color:var(--primary); display:flex; align-items:center; gap:0.5rem; margin-bottom:2.5rem;">
          Freeducation
        </a>
        <nav style="display:flex; flex-direction:column; gap:0.5rem;">
          ${desktopLinks}
        </nav>
        <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border); font-size:0.85rem;">
           <div style="font-weight:600;">${user.name}</div>
           <form action="/admin/logout" method="POST" style="margin-top:0.25rem;">
             <button class="btn-ghost" style="padding:0; font-size:0.8rem; color:var(--danger);">Sign Out</button>
           </form>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        ${breadcrumbsHtml ? `<div class="breadcrumbs">${breadcrumbsHtml}</div>` : ''}
        ${content}
      </main>

      <!-- Mobile Bottom Nav -->
      <nav class="mobile-nav">
        ${mobileLinks}
      </nav>
    </div>
  `;
}

export function escapeHtml(str: string | null | undefined) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
