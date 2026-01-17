function bottomNav({ items, actionSlot = "" }) {
  const links = items
    .map(
      (item) => `
        <a class="${item.active ? "active" : ""}" href="${item.href}">${item.label}</a>
      `
    )
    .join("");

  return `
    <nav class="phone-bottom-nav">
      ${links}
      ${actionSlot}
    </nav>
  `;
}

export { bottomNav };
