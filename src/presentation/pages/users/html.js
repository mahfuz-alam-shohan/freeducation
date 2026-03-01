export function usersHtml() {
  return `
    <section class="users-card users-layout">
      <header class="users-toolbar">
        <h2>Users</h2>
        <button id="toggleAddUser" class="users-primary users-toggle" type="button" aria-label="Open add user form" aria-expanded="false" aria-controls="addUserPanel">
          <span class="users-toggle-label">Add user</span>
          <span class="users-toggle-icon" aria-hidden="true"></span>
        </button>
      </header>

      <section id="addUserPanel" class="users-panel" aria-hidden="true">
        <h3 class="users-panel-title">Add user</h3>
        <form id="addUserForm" class="users-form" autocomplete="off">
          <label>Name<input name="name" required maxlength="120" autocomplete="off" /></label>
          <label>Email<input name="email" type="email" required maxlength="190" autocomplete="off" /></label>
          <label>User type
            <select name="user_type" required>
              <option value="Administrator">Administrator</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </label>
          <label>Password<input name="password" type="password" required minlength="8" maxlength="200" autocomplete="new-password" /></label>
          <button type="submit">Add user</button>
        </form>
      </section>

      <div class="users-search-wrap">
        <label for="userSearch" class="users-search-label">Search users</label>
        <input id="userSearch" class="users-search" type="search" placeholder="Search by name, email, or user type" autocomplete="off" />
      </div>

      <div class="users-table-wrap">
        <table class="users-table">
          <thead><tr><th>Name</th><th>Email</th><th>User type</th><th>Created</th><th class="users-actions-col">Actions</th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>

      <section id="deleteUserDialog" class="users-delete-dialog" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="deleteUserTitle" aria-describedby="deleteUserHint">
        <div class="users-delete-surface">
          <h3 id="deleteUserTitle" class="users-delete-title">Delete user?</h3>
          <p id="deleteUserHint" class="users-delete-text">This action is permanent and removes access immediately.</p>
          <p class="users-delete-target" id="deleteUserSummary"></p>
          <div class="users-delete-actions">
            <button id="deleteUserCancel" type="button" class="users-secondary">Cancel</button>
            <button id="deleteUserConfirm" type="button" class="users-danger">Delete user</button>
          </div>
        </div>
      </section>

      <p id="usersMsg" class="users-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
