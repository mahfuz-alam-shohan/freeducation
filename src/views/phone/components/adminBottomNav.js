function adminBottomNav({ active }) {
  return `
    <nav class="phone-bottom-nav">
      <a class="${active === "home" ? "active" : ""}" href="/admin">Home</a>
      <a class="${active === "users" ? "active" : ""}" href="/admin/users">Users</a>
      <a href="#">Content</a>
      <form method="post" action="/logout">
        <button class="secondary" type="submit">Logout</button>
      </form>
    </nav>
  `;
}

export { adminBottomNav };
