function sidebar({ navItems }) {
  const navLinks = navItems
    .map(
      (item) => `
        <a class="pc-nav-link ${item.active ? "active" : ""}" href="${item.href}">${item.label}</a>
      `
    )
    .join("");

  return `
    <aside class="pc-sidebar">
      <nav class="pc-nav-group">
        ${navLinks}
      </nav>
    </aside>
  `;
}

export { sidebar };
