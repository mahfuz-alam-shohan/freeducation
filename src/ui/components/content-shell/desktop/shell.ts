export type ContentShellProps = {
  header: string;
  sidebar: string;
  main: string;
  footer: string;
};

export const renderContentShellDesktop = ({ header, sidebar, main, footer }: ContentShellProps): string => `
  <div class="app app--desktop">
    <input class="sidebar-toggle" type="checkbox" id="sidebar-toggle" />
    <div class="app-shell">
      ${header}
      ${sidebar}
      <main class="app-main">
        <div class="app-main__breadcrumb" id="breadcrumb" role="navigation" aria-label="Breadcrumb"></div>
        <div class="app-main__content">${main}</div>
      </main>
      ${footer}
    </div>
  </div>
`;

export const desktopShellStyles = `
  /* Base Layout */
  .app { min-height: 100vh; background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
  .sidebar-toggle { position: absolute; opacity: 0; pointer-events: none; }
  .app-shell { 
    display: grid; 
    grid-template-columns: 240px 1fr; 
    grid-template-rows: auto 1fr auto; 
    min-height: 100vh; 
    min-height: 100dvh; 
    height: 100vh; 
    height: 100dvh; 
    background: var(--color-bg); 
    transition: grid-template-columns 0.3s ease;
  }

  /* Header */
  .app-header {
    grid-column: 1 / -1;
    position: relative;
    z-index: 30;
    display: grid;
    grid-template-columns: 80px 1fr 200px;
    align-items: center;
    padding: 6px 12px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }
  .app-header__center { display: flex; justify-content: center; }
  .app-header__right { display: flex; justify-content: flex-end; gap: 12px; }
  .logo { font-family: var(--font-display); font-weight: 600; letter-spacing: 0.4px; color: var(--color-text); text-transform: lowercase; }

  /* Icon Button */
  .icon-button {
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0;
    width: 36px;
    height: 36px;
    background: var(--color-surface);
    color: var(--color-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  }
  .icon-button:hover { border-color: var(--color-border-strong); background: var(--color-surface-muted); transform: translateY(-1px); }

  /* Sidebar Toggle Icons */
  .sidebar-toggle__icon { display: inline-flex; }
  .sidebar-toggle__icon--open { display: none; }
  .sidebar-toggle__icon--close { display: inline-flex; }

  /* Sidebar */
  .app-sidebar {
    grid-row: 2 / 3;
    padding: 10px;
    border-right: 1px solid var(--color-border);
    background: var(--color-surface-muted);
    overflow: auto;
    box-shadow: var(--shadow-sm);
    transition: padding 0.3s ease;
  }

  /* Menu */
  .menu { list-style: none; padding: 0; margin: 0; }
  .menu-item {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 6px;
    border-radius: var(--radius-sm);
    color: var(--color-text);
    border: 1px solid transparent;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .menu-item:hover { background: var(--color-surface-elevated); border-color: var(--color-border); transform: translateX(2px); }
  .menu-icon { display: inline-flex; align-items: center; justify-content: center; color: var(--color-text-muted); }
  .menu-label { transition: opacity 0.2s ease; }

  /* Main Content */
  .app-main {
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    min-height: 0;
    background: var(--color-bg);
    border: none;
    border-radius: 0;
    position: relative;
    z-index: 1;
  }
  .app-main__content {
    padding: 12px 16px 16px;
    overflow: auto;
    overscroll-behavior: contain;
    min-height: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    animation: page-enter 0.35s ease;
  }

  /* Footer */
  .app-footer { 
    grid-column: 1 / -1; 
    padding: 6px 12px; 
    border-top: 1px solid var(--color-border); 
    background: var(--color-surface-muted); 
    color: var(--color-text-muted); 
    text-align: center; 
  }

  /* Dropdown Menu */
  .profile-menu, .notification-menu { position: relative; }
  .profile-menu summary, .notification-menu summary { list-style: none; cursor: pointer; }
  .profile-menu summary::-webkit-details-marker, .notification-menu summary::-webkit-details-marker { display: none; }
  .profile-menu, .notification-menu { z-index: 50; }
  .dropdown {
    position: absolute;
    right: 0;
    top: 40px;
    min-width: 220px;
    padding: 12px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    z-index: 60;
    animation: dropdown-fade 0.2s ease;
  }
  .dropdown p { margin: 0 0 8px; color: var(--color-text-muted); }
  .dropdown p strong { color: var(--color-text); }
  .dropdown .button-link { width: 100%; }

  /* Avatar */
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-accent);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  .profile-notifications { display: none; }

  /* Sidebar Toggle States */
  .sidebar-toggle:checked + .app-shell { 
    grid-template-columns: 60px 1fr; 
  }
  .sidebar-toggle:checked + .app-shell .menu-label { 
    opacity: 0; 
    width: 0;
    overflow: hidden;
  }
  .sidebar-toggle:checked + .app-shell .app-sidebar { 
    padding: 10px 6px; 
  }
  .sidebar-toggle:checked + .app-shell .sidebar-toggle__icon--open { 
    display: inline-flex; 
  }
  .sidebar-toggle:checked + .app-shell .sidebar-toggle__icon--close { 
    display: none; 
  }

  /* Responsive Breakpoints */
  @media (max-width: 900px) {
    .app-shell { grid-template-columns: 200px 1fr; }
  }

  @media (max-width: 768px) {
    .app-shell { 
      grid-template-columns: 1fr; 
      grid-template-rows: auto 1fr auto; 
    }
    .app-header { grid-template-columns: 60px 1fr 80px; }
    .app-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 80%;
      max-width: 320px;
      background: var(--color-surface-muted);
      border-right: 1px solid var(--color-border);
      padding: 16px;
      transform: translateX(-110%);
      transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
      z-index: 60;
      box-shadow: var(--shadow-sm);
    }
    .sidebar-toggle:checked + .app-shell .app-sidebar { transform: translateX(0); }
    .notification-menu { display: none; }
    .profile-notifications { display: block; }
    .app-main__content { padding: 10px; }
  }
`;
