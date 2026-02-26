export function usersHtml() {
  return `
    <section class="users-card users-layout">
      <header class="users-toolbar">
        <h2>Users</h2>
        <button id="toggleAddUser" class="users-primary" type="button" aria-expanded="false" aria-controls="addUserPanel">Add user</button>
      </header>

      <section id="addUserPanel" class="users-panel" aria-hidden="true">
        <header class="users-panel-head">
          <h3>Add user</h3>
          <button id="closeAddUser" class="users-ghost" type="button" aria-label="Close add user form">Close</button>
        </header>
        <form id="addUserForm" class="users-form">
          <label>Name<input name="name" required maxlength="120" /></label>
          <label>Email<input name="email" type="email" required maxlength="190" /></label>
          <label>Password<input name="password" type="password" required minlength="8" maxlength="200" /></label>
          <button type="submit">Add user</button>
        </form>
      </section>

      <div class="users-search-wrap">
        <label for="userSearch" class="users-search-label">Search users</label>
        <input id="userSearch" class="users-search" type="search" placeholder="Search by name, email, or user type" autocomplete="off" />
      </div>

      <div class="users-table-wrap">
        <table class="users-table">
          <thead><tr><th>Name</th><th>Email</th><th>User type</th><th>Created</th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
      <p id="usersMsg" class="users-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
