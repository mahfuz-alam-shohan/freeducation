function adminSidebar({ userName, active }) {
  return `
    <aside class="pc-sidebar">
      <div>
        <h2>Freeducation Admin</h2>
        <div class="small">Signed in as ${userName}</div>
      </div>
      <nav class="pc-nav-group">
        <a class="pc-nav-link ${active === "home" ? "active" : ""}" href="/admin">Dashboard</a>
        <a class="pc-nav-link ${active === "users" ? "active" : ""}" href="/admin/users">User Management</a>
        <a class="pc-nav-link" href="#">Teachers (soon)</a>
        <a class="pc-nav-link" href="#">Students (soon)</a>
        <a class="pc-nav-link" href="#">Content (soon)</a>
      </nav>
      <form method="post" action="/logout">
        <button class="secondary" type="submit">Log out</button>
      </form>
    </aside>
  `;
}

export { adminSidebar };
