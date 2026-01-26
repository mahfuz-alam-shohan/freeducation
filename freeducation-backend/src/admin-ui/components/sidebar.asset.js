export function renderSidebar(items, active) {
  const links = items.map((item) => {
    const isActive = item.id === active ? 'active' : '';
    return `<a class="${isActive}" href="${item.href}">${item.label}</a>`;
  }).join('');

  return `
    <aside class="sidebar">
      <div class="brand">
        <h2>FREEDUCATION</h2>
        <span>Admin Console</span>
      </div>
      <nav>${links}</nav>
      <div class="footer">Version 1.0</div>
    </aside>
  `;
}
