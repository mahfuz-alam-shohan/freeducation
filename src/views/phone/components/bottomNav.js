function bottomNav({ items }) {
  const links = items
    .map(
      (item) => `
        <a class="phone-bottom-link ${item.active ? "active" : ""}" href="${item.href}">
          <span class="phone-nav-icon tone-${item.tone ?? "sun"}">${item.icon ?? ""}</span>
          <span>${item.label}</span>
        </a>
      `
    )
    .join("");

  return `
    <nav class="phone-bottom-nav">
      ${links}
    </nav>
  `;
}

export { bottomNav };
