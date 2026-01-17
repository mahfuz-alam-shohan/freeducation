import { adminShell } from "./layout.js";

function dashboardPage(session) {
  return adminShell({
    title: "Dashboard",
    userName: session.name || "Admin",
    active: "home",
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

function userManagementPage(session, admins) {
  const rows = admins.results
    .map(
      (admin) => `
        <tr>
          <td>${admin.display_name}</td>
          <td>${admin.email}</td>
          <td>${new Date(admin.created_at).toLocaleDateString()}</td>
        </tr>
      `
    )
    .join("");

  return adminShell({
    title: "User Management",
    userName: session.name || "Admin",
    active: "users",
    content: `
      <div class="card">
        <h3 class="section-title">Add a new admin</h3>
        <p class="small">Only admins can be created right now. Teachers and students will be added later.</p>
        <form class="form-grid" method="post" action="/admin/users">
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
          <button type="submit">Create admin</button>
        </form>
      </div>
      <div class="card">
        <h3 class="section-title">Existing admins</h3>
        <table class="small" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="text-align: left;">
              <th>Name</th>
              <th>Email</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="3">No admins yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    `,
  });
}

export { dashboardPage, userManagementPage };
