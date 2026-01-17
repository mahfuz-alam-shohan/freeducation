import { adminShell } from "./layout.js";

function dashboardPage(userProfile) {
  return adminShell({
    title: "Dashboard",
    active: "home",
    userProfile,
    content: `
      <div class="card">
        <h3 class="section-title">Welcome back</h3>
        <p class="small">Use the menu to manage users and build new learning modules. The layout stays consistent on desktop and mobile.</p>
      </div>
      <div class="card">
        <h3 class="section-title">Next steps</h3>
        <ul class="small">
          <li>Add more admins in the User Management page.</li>
          <li>Prepare subject modules using the content folders.</li>
          <li>Teachers and students dashboards will follow.</li>
        </ul>
      </div>
    `,
  });
}

function userManagementPage({ users, role, search }, userProfile) {
  const rows = users.results
    .map(
      (user) => `
        <tr>
          <td>${user.display_name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
        </tr>
      `
    )
    .join("");

  return adminShell({
    title: "User Management",
    active: "users",
    userProfile,
    content: `
      <div class="card">
        <div class="section-header">
          <div>
            <h3 class="section-title">User list</h3>
            <p class="small">Filter by role and search by name or email. Create users in a dedicated form.</p>
          </div>
          <a class="button-link" href="/admin/users/new">Create user</a>
        </div>
        <form class="filters-bar" method="get" action="/admin/users">
          <div class="field">
            <label for="role">User type</label>
            <select id="role" name="role">
              <option value="all" ${role === "all" ? "selected" : ""}>All types</option>
              <option value="admin" ${role === "admin" ? "selected" : ""}>Admin</option>
              <option value="teacher" ${role === "teacher" ? "selected" : ""}>Teacher</option>
              <option value="student" ${role === "student" ? "selected" : ""}>Student</option>
            </select>
          </div>
          <div class="field grow">
            <label for="search">Search</label>
            <input
              id="search"
              name="search"
              type="search"
              placeholder="Search by name or email"
              value="${search || ""}"
            />
          </div>
          <button type="submit">Filter</button>
        </form>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="4">No users found.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `,
  });
}

function createUserPage(userProfile) {
  return adminShell({
    title: "Create User",
    active: "users",
    userProfile,
    content: `
      <div class="card">
        <h3 class="section-title">Create user</h3>
        <p class="small">Select a role, then provide the basic account details.</p>
        <form class="form-grid" method="post" action="/admin/users">
          <div>
            <label for="role">User type</label>
            <select id="role" name="role" required>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label for="name">Full name</label>
            <input id="name" name="name" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div>
            <label for="password">Temporary password</label>
            <input id="password" name="password" type="password" required minlength="8" />
          </div>
          <div class="form-actions">
            <button type="submit">Create user</button>
            <a class="button-link secondary" href="/admin/users">Back to users</a>
          </div>
        </form>
      </div>
    `,
  });
}

export { createUserPage, dashboardPage, userManagementPage };
