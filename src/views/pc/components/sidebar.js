function sidebar({ navItems }) {
  const navLinks = navItems
    .map(
      (item) => `
        <a class="pc-nav-link ${item.active ? "active" : ""}" href="${item.href}">
          <span class="pc-nav-icon tone-${item.tone ?? "sun"}">${item.icon ?? ""}</span>
          <span class="pc-nav-text">${item.label}</span>
        </a>
      `
    )
    .join("");

  return `
    <aside class="pc-sidebar">
      <div class="pc-nav-title">Sections</div>
      <nav class="pc-nav-group">
        ${navLinks}
      </nav>
    </aside>
  `;
}

export { sidebar };
