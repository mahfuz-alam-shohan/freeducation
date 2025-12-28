// CSS Variables
export const CSS = `
:root {
  --primary: #6366f1; --primary-dark: #4f46e5; --primary-light: #e0e7ff;
  --bg-body: #f8fafc; --bg-card: #ffffff;
  --text-main: #0f172a; --text-muted: #64748b;
  --border: #e2e8f0; --danger: #ef4444; --success: #22c55e;
  --sidebar-w: 260px; --nav-h: 64px;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif; background: var(--bg-body); color: var(--text-main); font-size: 15px; line-height: 1.5; }

/* --- Components --- */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; gap: 0.5rem; }
.btn-sm { padding: 0.25rem 0.75rem; font-size: 0.8rem; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2); border-color: transparent; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-white { background: white; color: var(--text-main); border-color: var(--border); }
.btn-white:hover { background: #f1f5f9; }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-ghost:hover { color: var(--primary); background: var(--primary-light); }
.btn-danger { background: #fee2e2; color: var(--danger); border-color: transparent; }

.input { width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem; font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: #fff; }
.input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.select { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 0.7rem center; background-size: 1em; padding-right: 2.5rem; }

.card { background: var(--bg-card); border-radius: 0.75rem; border: 1px solid var(--border); box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 1.5rem; }
.card-body { padding: 1.5rem; }
.card-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fdfdfd; }
.card-header h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-main); }

/* --- Data Tables --- */
.table-container { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.data-table th { text-align: left; padding: 0.75rem 1.5rem; background: #f8fafc; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
.data-table td { padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--border); color: var(--text-main); vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }
.col-action { text-align: right; width: 1%; white-space: nowrap; }

/* --- Layout --- */
.app-shell { display: flex; min-height: 100vh; flex-direction: column; }
.sidebar { display: none; width: var(--sidebar-w); background: white; border-right: 1px solid var(--border); padding: 1.5rem; flex-direction: column; height: 100vh; position: sticky; top: 0; flex-shrink: 0; }
.main-content { flex: 1; padding: 1.5rem; width: 100%; max-width: 1200px; margin: 0 auto; padding-bottom: calc(var(--nav-h) + 2rem); }
.header-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 0.75rem; }

/* --- Breadcrumbs --- */
.breadcrumbs { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.breadcrumbs a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.breadcrumbs a:hover { color: var(--primary); }
.breadcrumbs span { color: var(--text-main); font-weight: 500; }
.breadcrumb-sep { color: #cbd5e1; }

/* --- Badges --- */
.badge { display: inline-flex; align-items: center; padding: 0.15rem 0.5rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; line-height: 1; }
.badge-blue { background: #e0e7ff; color: var(--primary-dark); }
.badge-gray { background: #f1f5f9; color: var(--text-muted); }

/* --- Modals --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 200; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
.modal-target:target { opacity: 1; pointer-events: auto; }
.modal-box { background: white; width: 90%; max-width: 480px; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); transform: scale(0.95); transition: transform 0.2s; }
.modal-target:target .modal-box { transform: scale(1); }

@media (min-width: 800px) {
  .app-shell { flex-direction: row; }
  .sidebar { display: flex; }
  .main-content { padding: 2rem 3rem; }
}
`;

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string, email: string }, breadcrumbs?: string): Response {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>${title} | Freeducation Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  ${user ? renderAuthenticatedLayout(content, activeTab, user, breadcrumbs) : content}
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}

function renderAuthenticatedLayout(content: string, activeTab: string, user: { name: string }, breadcrumbsHtml: string = "") {
  // Navigation Menu
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' },
    { id: 'classes', label: 'Classes', href: '/admin/classes', icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>' },
    { id: 'settings', label: 'Settings', href: '/admin/settings', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' },
  ];

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <a href="/admin" class="logo" style="font-weight:700; font-size:1.25rem; text-decoration:none; color:var(--primary); display:flex; align-items:center; gap:0.5rem; margin-bottom:2rem;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Freeducation
        </a>
        <nav style="display:flex; flex-direction:column; gap:0.25rem;">
          ${navItems.map(item => `
            <a href="${item.href}" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 1rem; border-radius:0.5rem; color:${activeTab === item.id ? 'var(--primary-dark)' : 'var(--text-muted)'}; background:${activeTab === item.id ? '#e0e7ff' : 'transparent'}; text-decoration:none; font-weight:500; font-size:0.95rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
              ${item.label}
            </a>
          `).join('')}
        </nav>
        <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border); font-size:0.85rem;">
           <div style="font-weight:600;">${user.name}</div>
           <form action="/admin/logout" method="POST" style="margin-top:0.25rem;">
             <button class="btn-ghost" style="padding:0; font-size:0.8rem; color:var(--danger);">Sign Out</button>
           </form>
        </div>
      </aside>
      <main class="main-content">
        ${breadcrumbsHtml ? `<div class="breadcrumbs">${breadcrumbsHtml}</div>` : ''}
        ${content}
      </main>
    </div>
  `;
}

export function escapeHtml(str: string | null | undefined) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
