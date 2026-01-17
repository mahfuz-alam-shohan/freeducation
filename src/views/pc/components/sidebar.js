function sidebar({ title, subtitle, navItems, actionSlot = "" }) {
  const navLinks = navItems
    .map(
      (item) => `
        <a class="pc-nav-link ${item.active ? "active" : ""}" href="${item.href}">${item.label}</a>
      `
    )
    .join("");

  return `
    <aside class="pc-sidebar">
      <div>
        <h2>${title}</h2>
        ${subtitle ? `<div class="small">${subtitle}</div>` : ""}
      </div>
      <nav class="pc-nav-group">
        ${navLinks}
      </nav>
      ${actionSlot}
    </aside>
  `;
}

export { sidebar };
