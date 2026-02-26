export function usersHtml() {
  return `
    <section class="users-card">
      <header class="users-head">
        <h2>Administrators</h2>
        <p class="users-muted">Use this direct table for quick visibility and low-friction scanning.</p>
      </header>
      <div class="users-table-wrap">
        <table class="users-table"><thead><tr><th>Name</th><th>Email</th><th>Created</th></tr></thead><tbody id="rows"></tbody></table>
      </div>
    </section>
    <section class="users-card users-stack">
      <header class="users-head">
        <h2>Add administrator</h2>
        <p class="users-muted">This is intentionally a direct form instead of a modal so admins can review existing users while submitting.</p>
      </header>
      <form id="addUserForm" class="users-form">
        <label>Name<input name="name" required maxlength="120" /></label>
        <label>Email<input name="email" type="email" required maxlength="190" /></label>
        <label>Password<input name="password" type="password" required minlength="8" maxlength="200" /></label>
        <button>Add user</button>
      </form>
      <p id="usersMsg" class="users-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
