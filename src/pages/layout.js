import { styles, setupScript, loginScript } from './assets.js';

function base(title, body, script = '') {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>${styles}</style></head><body>${body}${script ? `<script>${script}</script>` : ''}</body></html>`;
}

export function setupPage() {
  return base(
    'Create Admin',
    `<div class="center-wrap"><div class="panel"><h2>Create admin</h2><p class="muted">Run once to initialize your site.</p><p id="error" class="error"></p><form id="setup-form">
      <label>Name</label><input required name="name" maxlength="100" />
      <label>Email</label><input required name="email" type="email" maxlength="190" />
      <label>Password</label><input required name="password" type="password" minlength="8" maxlength="120" />
      <label>Profile picture</label><input id="image" name="image" type="file" accept="image/*" />
      <button type="submit">Create admin</button></form></div></div>`,
    setupScript
  );
}

export function loginPage() {
  return base(
    'Admin Login',
    `<div class="center-wrap"><div class="panel"><h2>Admin login</h2><p id="error" class="error"></p><form id="login-form">
      <label>Email</label><input required name="email" type="email" />
      <label>Password</label><input required name="password" type="password" />
      <button type="submit">Login</button></form></div></div>`,
    loginScript
  );
}

function shell(active, content, userName) {
  return base(
    'Admin Dashboard',
    `<div class="app"><aside class="sidebar"><div class="logo">freeducation</div><nav class="menu">
      <a href="/dashboard" class="${active === 'dashboard' ? 'active' : ''}">Dashboard</a>
      <a href="/users" class="${active === 'users' ? 'active' : ''}">User management</a>
      <a href="/api/logout">Logout</a>
      </nav></aside><main class="main"><div class="topbar"><span class="badge">${userName}</span></div>${content}</main></div>`
  );
}

export function dashboardPage(user, stats) {
  const content = `<div class="grid"><div class="card"><div class="muted">Total users</div><div class="kpi">${stats.userCount}</div></div>
    <div class="card"><div class="muted">Admins</div><div class="kpi">${stats.adminCount}</div></div>
    <div class="card"><div class="muted">Active sessions</div><div class="kpi">${stats.sessionCount}</div></div></div>`;
  return shell('dashboard', content, user.name);
}

export function usersPage(user, rows) {
  const bodyRows = rows
    .map(
      (r) => `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.role}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`
    )
    .join('');
  const content = `<div class="card"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead><tbody>${bodyRows}</tbody></table></div>`;
  return shell('users', content, user.name);
}
