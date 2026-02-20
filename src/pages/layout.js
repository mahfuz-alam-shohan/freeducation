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
      <nav class="sidebar-nav">
        <a href="/dashboard" class="menu-item ${active === 'dashboard' ? 'active' : ''}"><span class="label">Dashboard</span></a>
        <a href="/users" class="menu-item ${active === 'users' ? 'active' : ''}"><span class="label">Users</span></a>
      </nav>
      <a href="/api/logout" class="menu-item logout-item"><span class="label">Log out</span></a>
    </div>
  </aside>`;
}

function topbar(user) {
  return `<header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn mobile-only" data-mobile-toggle aria-label="Open menu">☰</button>
        <p class="muted login-note">Logged in as <strong class="login-name">${user.name}</strong></p>
      </div>
      <div class="topbar-right">
        <span class="avatar" aria-label="Profile">${initials(user.name)}</span>
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
    </div>`,
    appScript
  );
}

export function dashboardPage(user, stats) {
  const content = `
    <section class="grid grid-3" style="margin-bottom:16px;">
      <article class="card"><p class="muted">Total users</p><p class="kpi">${stats.userCount}</p></article>
      <article class="card"><p class="muted">Admins</p><p class="kpi">${stats.adminCount}</p></article>
      <article class="card"><p class="muted">Active sessions</p><p class="kpi">${stats.sessionCount}</p></article>
    </section>

    <section class="card">
      <h3 class="card-title">What this dashboard shows</h3>
      <p class="muted">All values on this page come directly from the current database state. Use the users page to review account-level details.</p>
    </section>
    `;

  return shell('dashboard', user, 'Dashboard overview', 'Live system metrics.', content);
}

export function usersPage(user, rows) {
  const bodyRows = rows
    .map(
      (r) =>
        `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.role}</td><td><span class="badge badge-success">Active</span></td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`
    )
    .join('');

  const content = `<section class="card">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    </section>`;

  return shell('users', user, 'User management', 'Current users in the database.', content);
}
