export const renderSidebarMobile = (): string => `
  <aside class="app-sidebar app-sidebar--mobile">
    <div class="sidebar-header">
      <span>Menu</span>
      <label class="icon-button" for="sidebar-toggle" aria-label="Close sidebar">✕</label>
    </div>
    <nav>
      <ul class="menu">
        <li class="menu-item">
          <span class="menu-icon">🏠</span>
          <span class="menu-label">Home</span>
        </li>
      </ul>
    </nav>
  </aside>
`;
