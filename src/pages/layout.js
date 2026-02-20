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


const siteLogo = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#fff" stroke="#0f172a" stroke-width="1.5"/><path d="M6.5 16V8.5c2.1 0 3.6.6 5.1 1.9 1.5-1.3 3-1.9 5.1-1.9V16c-2.1 0-3.6.5-5.1 1.7-1.5-1.2-3-1.7-5.1-1.7Z" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/><path d="M11.6 10.4v7.2" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const iconDashboard = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>`;
const iconManagement = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const iconUsers = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3"/><path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5"/><circle cx="17" cy="10" r="2.5"/><path d="M14.5 18.5c.4-1.9 2-3.5 4-4"/></svg>`;
const iconLogout = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M14 16l4-4-4-4"/><path d="M18 12H9"/></svg>`;
const iconChevron = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>`;
const iconCollapse = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>`;
const iconMenu = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
const iconClose = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`;

function sidebar(active) {
  const managementOpen = active === 'users';
  return `<aside class="sidebar">
    <header class="sidebar-head">
      <span class="brand">
        <span class="brand-logo" aria-hidden="true">${siteLogo}</span>
        <span class="brand-name">freeducation</span>
      </span>
      <button class="sidebar-toggle desktop-only" data-sidebar-toggle aria-label="Collapse sidebar" aria-expanded="true">
        <span class="toggle-icon" aria-hidden="true">${iconCollapse}</span>
      </button>
    </header>
    <div class="sidebar-scroll">
      <p class="nav-group-title">Core</p>
      <a href="/dashboard" class="menu-item ${active === 'dashboard' ? 'active' : ''}"><span class="icon">${iconDashboard}</span><span class="label">Dashboard</span></a>

      <div class="menu-block ${managementOpen ? 'open' : ''}">
        <button class="menu-expand" data-expand aria-expanded="${managementOpen ? 'true' : 'false'}"><span><span class="icon">${iconManagement}</span><span class="label">Management</span></span><span class="chevron">${iconChevron}</span></button>
        <div class="submenu-wrap"><div class="submenu">
          <a href="/users" class="submenu-item ${active === 'users' ? 'active' : ''}"><span class="icon">${iconUsers}</span><span class="label">Users</span></a>
        </div></div>
      </div>

      <a href="/api/logout" class="menu-item logout-item"><span class="icon">${iconLogout}</span><span class="label">Log out</span></a>
    </div>
  </aside>`;
}

function topbar(user) {
  return `<header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn mobile-only mobile-menu-btn" data-mobile-toggle aria-label="Open navigation menu" aria-expanded="false"><span class="mobile-icon mobile-icon-menu" aria-hidden="true">${iconMenu}</span><span class="mobile-icon mobile-icon-close" aria-hidden="true">${iconClose}</span></button>
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
    <section class="grid grid-3 kpi-grid" style="margin-bottom:12px;">
      <article class="card kpi-card"><p class="muted">Total users</p><p class="kpi">${stats.userCount}</p></article>
      <article class="card kpi-card"><p class="muted">Admins</p><p class="kpi">${stats.adminCount}</p></article>
      <article class="card kpi-card"><p class="muted">Active sessions</p><p class="kpi">${stats.sessionCount}</p></article>
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
