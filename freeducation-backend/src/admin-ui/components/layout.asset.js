export function renderLayout({ sidebar, topbar, content }) {
  return `
    <div class="app-shell">
      ${sidebar}
      <div class="mobile-overlay" data-action="close-nav"></div>
      <main class="main">
        ${topbar}
        <section class="page">${content}</section>
      </main>
    </div>
  `;
}
