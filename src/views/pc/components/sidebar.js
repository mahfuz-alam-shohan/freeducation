function sidebar({ navItems }) {
  const navLinks = navItems
    .map(
      (item) => `
        <a class="pc-nav-link ${item.active ? "active" : ""}" href="${item.href}">
          <span class="pc-nav-icon">${item.label.slice(0, 1).toUpperCase()}</span>
          <span class="pc-nav-text">${item.label}</span>
        </a>
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
