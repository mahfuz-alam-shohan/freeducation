import { appScript, loginScript, setupScript, styles } from './assets.js';

function base(title, body, script = '') {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>${styles}</style></head><body>${body}${script ? `<script>${script}</script>` : ''}</body></html>`;
}

export function setupPage() {
  return base(
    'Create Admin',
    `<div class="center-wrap"><section class="auth-card"><p class="badge badge-info">Bootstrap</p><h1 class="page-title">Create admin account</h1><p class="page-subtitle">Initialize your workspace once, then invite your team.</p><p id="error" class="error"></p><form id="setup-form" class="form-grid">
      <label>Name</label><input required class="input" name="name" maxlength="100" />
      <label>Email</label><input required class="input" name="email" type="email" maxlength="190" />
      <label>Password</label><input required class="input" name="password" type="password" minlength="8" maxlength="120" />
      <label>Profile picture</label><input id="image" class="input" name="image" type="file" accept="image/*" />
      <button class="btn btn-primary" type="submit">Create admin</button></form></section></div>`,
    setupScript
  );
}

export function loginPage() {
  return base(
    'Admin Login',
    `<div class="center-wrap"><section class="auth-card"><p class="badge badge-info">Secure Login</p><h1 class="page-title">Welcome back</h1><p class="page-subtitle">Access your workspace dashboard.</p><p id="error" class="error"></p><form id="login-form" class="form-grid">
      <label>Email</label><input required class="input" name="email" type="email" />
      <label>Password</label><input required class="input" name="password" type="password" />
      <button class="btn btn-primary" type="submit">Login</button></form></section></div>`,
    loginScript
  );
}

function initials(name) {
  return String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function sidebar(active) {
  return `<aside class="sidebar">
    <header class="sidebar-head">
      <span class="brand">freeducation</span>
      <button class="sidebar-toggle desktop-only" data-sidebar-toggle aria-label="Toggle sidebar">⟵</button>
    </header>
    <div class="sidebar-scroll">
      <p class="nav-group-title">Core</p>
      <a href="/dashboard" class="menu-item ${active === 'dashboard' ? 'active' : ''}"><span class="icon">◻</span><span class="label">Dashboard</span></a>
      <div class="menu-block open">
        <button class="menu-expand" data-expand><span class="menu-item" style="padding:0;margin:0"><span class="icon">◎</span><span class="label">Management</span></span><span class="chevron">▾</span></button>
        <div class="submenu-wrap"><div class="submenu">
          <a href="/users" class="submenu-item ${active === 'users' ? 'active' : ''}"><span class="icon">◼</span><span class="label">Users</span></a>
          <a href="#" class="submenu-item"><span class="icon">◼</span><span class="label">Roles</span></a>
          <a href="#" class="submenu-item"><span class="icon">◼</span><span class="label">Billing</span></a>
        </div></div>
      </div>
      <p class="nav-group-title">Scale</p>
      ${Array.from({ length: 12 }, (_, idx) => `<a href="#" class="menu-item"><span class="icon">◦</span><span class="label">Menu item ${idx + 1}</span></a>`).join('')}
      <a href="/api/logout" class="menu-item"><span class="icon">↗</span><span class="label">Logout</span></a>
    </div>
  </aside>`;
}

function topbar(user) {
  return `<header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn mobile-only" data-mobile-toggle aria-label="Open menu">☰</button>
        <div class="search-wrap"><span class="icon">⌕</span><input class="input" placeholder="Search users, settings, invoices..."/></div>
      </div>
      <div class="topbar-right">
        <span class="workspace-pill desktop-only">Main workspace ▾</span>
        <button class="icon-btn" aria-label="Notifications">🔔</button>
        <button class="icon-btn" aria-label="Profile"><span class="avatar">${initials(user.name)}</span></button>
      </div>
    </header>`;
}

function shell(active, user, pageTitle, subtitle, content) {
  return base(
    pageTitle,
    `<div class="app-shell" data-shell>
      ${sidebar(active)}
      <div class="mobile-overlay" data-overlay></div>
      <main class="main-shell">
        ${topbar(user)}
        <div class="container">
          <section class="page-head">
            <h1 class="page-title">${pageTitle}</h1>
            <p class="page-subtitle">${subtitle}</p>
          </section>
          ${content}
        </div>
      </main>
      <div class="toast" data-toast>Updated</div>
    </div>`,
    appScript
  );
}

export function dashboardPage(user, stats) {
  const content = `
    <section class="grid grid-4" style="margin-bottom:16px;">
      <article class="card"><p class="muted">Total users</p><p class="kpi">${stats.userCount}</p><span class="badge badge-info">+12% this month</span></article>
      <article class="card"><p class="muted">Admins</p><p class="kpi">${stats.adminCount}</p><span class="badge badge-success">Healthy ratio</span></article>
      <article class="card"><p class="muted">Active sessions</p><p class="kpi">${stats.sessionCount}</p><span class="badge badge-info">Live now</span></article>
      <article class="card"><p class="muted">Errors</p><p class="kpi">0</p><span class="badge badge-warn">No incidents</span></article>
    </section>

    <section class="card" style="margin-bottom:16px;">
      <div class="toolbar">
        <div class="tabs">
          <button class="tab-btn active" data-tab>Overview</button>
          <button class="tab-btn" data-tab>Acquisition</button>
          <button class="tab-btn" data-tab>Retention</button>
        </div>
        <div class="toolbar-group">
          <button class="btn btn-ghost">Export</button>
          <button class="btn btn-secondary">Schedule report</button>
          <button class="btn btn-primary">Create campaign</button>
        </div>
      </div>
      <div class="grid grid-2">
        <article class="card" style="padding:16px;"><h3 class="card-title">Pipeline health</h3><p class="muted">Conversion trend and lead volume for the current period.</p></article>
        <article class="card" style="padding:16px;"><h3 class="card-title">Team updates</h3><p class="muted">Recent product and operations updates from internal teams.</p></article>
      </div>
    </section>

    <section class="card">
      <div class="toolbar">
        <div class="toolbar-group"><input class="input" placeholder="Search table"/><select class="select"><option>All roles</option><option>Admin</option><option>Member</option></select></div>
        <div class="toolbar-group"><button class="btn btn-ghost">Columns</button><button class="btn btn-danger">Archive selected</button></div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            <tr><td>Jane Cooper</td><td>jane@freeducation.com</td><td>Admin</td><td><span class="badge badge-success">Active</span></td><td>2026-01-08</td></tr>
            <tr><td>Wade Warren</td><td>wade@freeducation.com</td><td>Editor</td><td><span class="badge badge-info">Invited</span></td><td>2026-01-04</td></tr>
            <tr><td>Cody Fisher</td><td>cody@freeducation.com</td><td>Support</td><td><span class="badge badge-warn">Pending</span></td><td>2025-12-29</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination"><span>Showing 1-3 of 37</span><div class="toolbar-group"><button class="btn btn-ghost">Previous</button><button class="btn btn-ghost">Next</button></div></div>
    </section>`;

  return shell('dashboard', user, 'Dashboard overview', 'Modern SaaS workspace with scalable navigation and data controls.', content);
}

export function usersPage(user, rows) {
  const bodyRows = rows
    .map(
      (r) =>
        `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.role}</td><td><span class="badge badge-success">Active</span></td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`
    )
    .join('');

  const content = `<section class="card">
      <div class="toolbar">
        <div class="toolbar-group">
          <input class="input" placeholder="Search users"/>
          <select class="select"><option>All statuses</option><option>Active</option><option>Pending</option></select>
          <select class="select"><option>All roles</option><option>admin</option><option>user</option></select>
        </div>
        <div class="toolbar-group"><button class="btn btn-secondary">Invite user</button><button class="btn btn-primary">Add user</button></div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <div class="pagination"><span>Rows per page: 10</span><div class="toolbar-group"><button class="btn btn-ghost">Prev</button><button class="btn btn-ghost">Next</button></div></div>
    </section>`;

  return shell('users', user, 'User management', 'Manage accounts, permissions, and lifecycle in a unified data table.', content);
}
