import { appShell } from "../../templates/shell.js";
import { modulesStyles } from "../modules/modulesStyles.js";

export function usersPage(user, rows) {
  const bodyRows = rows.length
    ? rows
        .map((r) => `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.role}</td><td><span class="badge badge-success">Active</span></td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`)
        .join("")
    : '<tr><td colspan="5" class="table-empty">No users found.</td></tr>';

  const content = `<section class="card">
      <div class="card-head" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <h3 style="margin:0;">Users</h3>
        <button type="button" class="btn btn-outline" data-content-modal-open="add-user">Add user</button>
      </div>
      <div class="table-wrap">
        <table class="table flat-grid-table table-excel">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    </section>

    <dialog class="content-modal" data-content-modal="add-user">
      <div class="content-modal-inner">
        <div class="content-modal-head">
          <h3 style="margin:0;">Add user</h3>
          <button type="button" class="btn btn-ghost" data-content-modal-close>Close</button>
        </div>
        <div style="display:grid;gap:8px;">
          <form method="post" action="/api/users" style="display:grid;gap:8px;">
            <label>Name <input name="name" maxlength="100" required /></label>
            <label>Email <input type="email" name="email" autocomplete="email" required /></label>
            <label>Password <input type="password" name="password" minlength="8" maxlength="120" autocomplete="new-password" required /></label>
            <label>User type
              <select name="role" required>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button type="submit" class="btn">Create user</button>
          </form>
        </div>
      </div>
    </dialog>`;

  return appShell("users", user, "User management", "Current users in the database.", content, { pageStyles: modulesStyles });
}
