import { createHtmlResponse, escapeHtml, renderLogo } from "../ui";

export function renderErrorPage(request: Request, error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unexpected error.";
  const stack = error instanceof Error && error.stack ? error.stack : "";

  const content = `
    <div class="card p-6 border-l-4 border-red-500">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Internal Server Error</h3>
      <div class="space-y-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Request</p>
          <p class="font-mono text-sm bg-gray-50 p-2 rounded mt-1">${escapeHtml(request.method)} ${escapeHtml(
    new URL(request.url).pathname
  )}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Message</p>
          <p class="text-red-700 mt-1">${escapeHtml(message)}</p>
        </div>
        ${stack ? `
        <div>
           <p class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Stack Trace</p>
           <pre class="overflow-x-auto text-xs bg-gray-900 text-gray-200 p-3 rounded mt-1">${escapeHtml(
             stack
           )}</pre>
        </div>` : ""}
      </div>
    </div>
  `;

  return renderAdminShell({
    title: "Error",
    currentTab: "",
    content: content,
  });
}

export function renderSetupForm(error?: string): Response {
  const formHtml = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
            ${renderLogo(48)}
            <h2>Setup Admin</h2>
            <p>Create your first administrator account to secure the platform.</p>
        </div>

        ${error ? `<div class="alert alert-error">${escapeHtml(error)}</div>` : ""}

        <form method="post" action="/admin/setup" class="space-y-4">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input id="name" name="name" type="text" placeholder="e.g. John Doe" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="name@example.com" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" minlength="8" placeholder="••••••••" required class="form-input" />
            <p class="text-xs text-muted mt-1">Must be at least 8 characters</p>
          </div>
          <button type="submit" class="btn btn-primary w-full">Create Account</button>
        </form>
      </div>
    </div>
  `;

  return renderAdminShell({
    title: "Setup",
    currentTab: "",
    content: formHtml,
    fullPage: true,
  });
}

export function renderLoginForm(error?: string): Response {
  const formHtml = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
            ${renderLogo(48)}
            <h2>Admin Login</h2>
            <p>Welcome back! Please sign in to continue.</p>
        </div>

        ${error ? `<div class="alert alert-error">${escapeHtml(error)}</div>` : ""}

        <form method="post" action="/admin/login" class="space-y-4">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="name@example.com" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required class="form-input" />
          </div>
          <button type="submit" class="btn btn-primary w-full">Sign In</button>
        </form>
      </div>
    </div>
  `;

  return renderAdminShell({
    title: "Login",
    currentTab: "",
    content: formHtml,
    fullPage: true,
  });
}

export function renderDashboard(options: {
  admin: { id: number; name: string; email: string };
  tab: "settings" | "users";
  admins: { id: number; name: string; email: string; created_at: string }[];
  error?: string;
}): Response {
  const { admin, tab, admins, error } = options;

  let contentHtml = "";

  if (tab === "users") {
    contentHtml = `
      <div class="page-header">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">Manage administrator access and permissions</p>
        </div>
        <label for="modal-toggle" class="btn btn-primary">
          <span class="icon-plus">+</span> Add Admin
        </label>
      </div>

      ${error ? `<div class="alert alert-error mb-6">${escapeHtml(error)}</div>` : ""}

      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th class="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              ${admins.length > 0 ?
    admins
      .map(
        (entry) => `
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="avatar">${entry.name.charAt(0).toUpperCase()}</div>
                      <div class="font-medium text-gray-900">${escapeHtml(entry.name)}</div>
                    </div>
                  </td>
                  <td class="text-gray-500">${escapeHtml(entry.email)}</td>
                  <td class="text-gray-500">${new Date(entry.created_at).toLocaleDateString()}</td>
                  <td class="text-right"><span class="badge badge-success">Active</span></td>
                </tr>
              `
      )
      .join("") :
    `
                <tr>
                  <td colspan="4" class="text-center py-8 text-muted">No administrators found.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <input type="checkbox" id="modal-toggle" class="modal-toggle" />
      <div class="modal">
        <label for="modal-toggle" class="modal-backdrop"></label>
        <div class="modal-box">
          <div class="modal-header">
            <h3>Add New Admin</h3>
            <label for="modal-toggle" class="btn-close">&times;</label>
          </div>
          <form method="post" action="/admin/admins" class="modal-body space-y-4">
            <div class="form-group">
              <label>Full Name</label>
              <input name="name" type="text" placeholder="John Doe" required class="form-input" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="admin@freeducation.com" required class="form-input" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input name="password" type="password" minlength="8" placeholder="Create a strong password" required class="form-input" />
            </div>
            <div class="modal-actions">
              <label for="modal-toggle" class="btn btn-ghost">Cancel</label>
              <button type="submit" class="btn btn-primary">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">System configuration and maintenance</p>
        </div>
      </div>

      <div class="grid-layout">
        <div class="card p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="card-title text-red-600">Factory Reset</h3>
              <p class="text-sm text-muted mt-1">
                This action will delete <strong>all data</strong>, including all admins and sessions.
                This action cannot be undone.
              </p>
            </div>
            <div class="icon-box bg-red-100 text-red-600">!</div>
          </div>
          <div class="mt-6 border-t border-gray-100 pt-4">
            <form method="post" action="/admin/reset" onsubmit="return confirm('Are you absolutely sure? This will wipe the database.');">
              <button class="btn btn-danger">Reset Database</button>
            </form>
          </div>
        </div>

        <div class="card p-6">
           <h3 class="card-title">System Info</h3>
           <div class="mt-4 space-y-2 text-sm">
             <div class="flex justify-between py-2 border-b border-gray-50">
               <span class="text-muted">Environment</span>
               <span class="font-medium">Cloudflare Workers + D1</span>
             </div>
             <div class="flex justify-between py-2 border-b border-gray-50">
               <span class="text-muted">Current User</span>
               <span class="font-medium">${escapeHtml(admin.email)}</span>
             </div>
             <div class="flex justify-between py-2">
               <span class="text-muted">Version</span>
               <span class="font-medium">1.0.0</span>
             </div>
           </div>
        </div>
      </div>
    `;
  }

  return renderAdminShell({
    title: tab === "users" ? "Users" : "Settings",
    currentTab: tab,
    adminName: admin.name,
    adminEmail: admin.email,
    content: contentHtml,
  });
}

export function renderAdminShell(options: {
  title: string;
  content: string;
  currentTab: string;
  adminName?: string;
  adminEmail?: string;
  fullPage?: boolean;
}): Response {
  const { title, content, currentTab, adminName, adminEmail, fullPage } = options;

  const sidebar = fullPage
    ? ""
    : `
    <aside class="sidebar">
      <div class="sidebar-header">
        ${renderLogo(32)}
        <span class="brand-name">Freeducation</span>
      </div>

      <nav class="nav-menu">
        <div class="nav-label">MAIN MENU</div>
        <a href="/admin?tab=settings" class="nav-item ${currentTab === "settings" ? "active" : ""}">
          <span class="icon">⚙️</span> Settings
        </a>
        <a href="/admin?tab=users" class="nav-item ${currentTab === "users" ? "active" : ""}">
          <span class="icon">👥</span> User Management
        </a>
        <a href="/admin?tab=classes" class="nav-item ${currentTab === "classes" ? "active" : ""}">
          <span class="icon">🏫</span> Class Management
        </a>
      </nav>

      <div class="user-profile">
        <div class="user-info">
          <div class="avatar-sm">${(adminName || "A").charAt(0).toUpperCase()}</div>
          <div class="user-details">
            <p class="user-name">${escapeHtml(adminName || "Admin")}</p>
            <p class="user-email">${escapeHtml(adminEmail || "")}</p>
          </div>
        </div>
        <form method="post" action="/admin/logout">
          <button type="submit" class="logout-btn" title="Sign out">➔</button>
        </form>
      </div>
    </aside>
  `;

  return createHtmlResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>${escapeHtml(title)} | Freeducation Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* --- RESET & VARIABLES --- */
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --bg-body: #f3f4f6;
      --bg-surface: #ffffff;
      --text-main: #111827;
      --text-muted: #6b7280;
      --border: #e5e7eb;
      --sidebar-width: 260px;
      --header-height: 60px;
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-body);
      color: var(--text-main);
      -webkit-font-smoothing: antialiased;
    }

    /* --- UTILITIES --- */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-medium { font-weight: 500; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .text-red-600 { color: var(--danger); }
    .text-gray-500 { color: #6b7280; }
    .text-gray-900 { color: #111827; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-start { align-items: flex-start; }
    .border-b { border-bottom: 1px solid var(--border); }
    .border-t { border-top: 1px solid var(--border); }
    .overflow-hidden { overflow: hidden; }

    /* --- LAYOUT --- */
    .app-shell {
      display: flex;
      min-height: 100vh;
    }

    /* Mobile Header */
    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height);
      padding: 0 1rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 40;
    }

    /* Sidebar */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 50;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .sidebar-header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      gap: 0.75rem;
      border-bottom: 1px solid var(--border);
    }
    .brand-name {
      font-weight: 700;
      font-size: 1.125rem;
    }

    .nav-menu {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      padding-left: 0.75rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-item:hover {
      background: #f9fafb;
      color: var(--text-main);
    }
    .nav-item.active {
      background: #eff6ff; /* blue-50 */
      color: var(--primary);
    }
    .nav-item .icon { font-size: 1.1rem; }

    .user-profile {
      padding: 1rem;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .user-info { display: flex; align-items: center; gap: 0.75rem; overflow: hidden; }
    .avatar-sm {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .user-details { overflow: hidden; }
    .user-name { font-size: 0.875rem; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-email { font-size: 0.75rem; color: var(--text-muted); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .logout-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
    }
    .logout-btn:hover { background: #fee2e2; color: var(--danger); }

    /* Main Content */
    .main-content {
      flex: 1;
      width: 100%;
      padding: calc(var(--header-height) + 1.5rem) 1rem 2rem;
    }

    /* Mobile Toggle Logic */
    .mobile-menu-toggle { display: none; } /* Hide checkbox */
    .hamburger { cursor: pointer; padding: 0.5rem; font-size: 1.5rem; }
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 45;
      display: none;
      opacity: 0;
      transition: opacity 0.3s;
    }

    /* When Checked */
    #mobile-menu-toggle:checked ~ .app-shell .sidebar { transform: translateX(0); }
    #mobile-menu-toggle:checked ~ .mobile-backdrop { display: block; opacity: 1; }

    /* Desktop Styles */
    @media (min-width: 1024px) {
      .mobile-header { display: none; }
      .sidebar { transform: translateX(0); }
      .main-content { margin-left: var(--sidebar-width); padding: 2rem 2.5rem; }
      .mobile-backdrop { display: none !important; }
    }

    /* --- COMPONENTS --- */

    /* Cards */
    .card {
      background: var(--bg-surface);
      border-radius: 1rem;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    /* Headers */
    .page-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin: 0; }
    .page-subtitle { color: var(--text-muted); margin: 0.25rem 0 0; }

    @media (min-width: 640px) {
      .page-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.2s;
      gap: 0.5rem;
    }
    .btn-primary { background: var(--primary); color: white; border-color: transparent; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover { background: var(--danger-hover); }
    .btn-ghost { background: transparent; color: var(--text-muted); }
    .btn-ghost:hover { background: #f3f4f6; color: var(--text-main); }
    .icon-plus { font-weight: bold; font-size: 1.1em; line-height: 1; }

    /* Forms */
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    label { font-size: 0.875rem; font-weight: 500; color: #374151; }
    .form-input {
      padding: 0.625rem 0.875rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border);
      font-size: 0.95rem;
      width: 100%;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .form-check input { width: 16px; height: 16px; }

    /* Auth Pages */
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      background: white;
      padding: 2.5rem;
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-header h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
    .auth-header p { color: var(--text-muted); font-size: 0.875rem; margin: 0; }

    /* Tables */
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; white-space: nowrap; }
    .data-table th {
      background: #f9fafb;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.875rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .data-table td {
      padding: 1rem 1.5rem;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--border);
    }
    .data-table tbody tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover { background: #f9fafb; }

    .user-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e0e7ff;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    .badge {
      display: inline-flex;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-muted { background: #f3f4f6; color: #6b7280; }
    .badge-info { background: #e0f2fe; color: #0369a1; }

    /* Alerts */
    .alert {
      padding: 1rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .alert-info { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

    /* Modal */
    .modal-toggle { display: none; }
    .modal {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }
    .modal-box {
      position: relative;
      background: white;
      width: 100%;
      max-width: 460px;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      transform: scale(0.95);
      transition: transform 0.2s;
    }
    .modal-toggle:checked + .modal { opacity: 1; pointer-events: auto; }
    .modal-toggle:checked + .modal .modal-box { transform: scale(1); }

    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { margin: 0; font-size: 1.25rem; }
    .btn-close { font-size: 1.5rem; line-height: 1; cursor: pointer; color: var(--text-muted); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }

    /* Grid Layout for Settings */
    .grid-layout { display: grid; gap: 1.5rem; grid-template-columns: 1fr; }
    @media (min-width: 1024px) {
      .grid-layout { grid-template-columns: repeat(2, 1fr); }
    }
    .icon-box {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      font-weight: 700;
    }

    /* Class Management */
    .class-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }
    .class-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .class-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    .class-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .class-groups {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .class-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .link-summary {
      background: #f8fafc;
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .group-form {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .group-form input { flex: 1; }
    .checkbox-list {
      display: grid;
      gap: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--border);
      padding: 0.75rem;
      border-radius: 0.75rem;
      background: #f9fafb;
    }
  </style>
</head>
<body>
  ${fullPage ? content : `
    <input type="checkbox" id="mobile-menu-toggle" class="mobile-menu-toggle" />
    <label for="mobile-menu-toggle" class="mobile-backdrop"></label>

    <div class="app-shell">
      <header class="mobile-header">
        <label for="mobile-menu-toggle" class="hamburger">☰</label>
        <span class="brand-name">Freeducation</span>
        <div style="width: 24px;"></div> <!-- Spacer -->
      </header>

      ${sidebar}

      <main class="main-content">
        ${content}
      </main>
    </div>
  `}
</body>
</html>`
  );
}
