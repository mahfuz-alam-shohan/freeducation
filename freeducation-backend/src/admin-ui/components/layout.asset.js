export function renderLayout({ sidebar, topbar, content }) {
  return `
    <div class="app-shell">
      <header class="title-bar">${topbar}</header>
      <div class="content-wrapper">
        ${sidebar}
        <div class="mobile-overlay" data-action="close-nav"></div>
        <main class="main">
          <section class="page">${content}</section>
        </main>
      </div>
    </div>
  `;
}
