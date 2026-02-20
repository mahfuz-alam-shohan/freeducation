import { appShell } from './templates/shell.js';

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

  return appShell('users', user, 'User management', 'Current users in the database.', content);
}
