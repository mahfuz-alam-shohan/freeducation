export function usersHtml() {
  return `
    <section class="users-card">
      <h2>Administrators</h2>
      <div class="users-table-wrap">
        <table class="users-table"><thead><tr><th>Name</th><th>Email</th><th>Created</th></tr></thead><tbody id="rows"></tbody></table>
      </div>
    </section>
    <section class="users-card users-stack">
      <h2>Add administrator</h2>
      <form id="addUserForm" class="users-form">
        <label>Name<input name="name" required maxlength="120" /></label>
        <label>Email<input name="email" type="email" required maxlength="190" /></label>
        <label>Password<input name="password" type="password" required minlength="8" maxlength="200" /></label>
        <button>Add user</button>
      </form>
      <p id="usersMsg" class="users-muted"></p>
    </section>
  `;
}
