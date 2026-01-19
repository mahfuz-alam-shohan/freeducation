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
      <main class="app-main">${main}</main>
      ${footer}
    </div>
  </div>
`;

export const desktopShellStyles = `
  .app { min-height: 100vh; background: #fff; color: #1d1d1d; font-family: Arial, sans-serif; }
  .sidebar-toggle { position: absolute; opacity: 0; pointer-events: none; }
  .app-shell { display: grid; grid-template-columns: 240px 1fr; grid-template-rows: auto 1fr auto; height: 100vh; }
  .app-header { grid-column: 1 / -1; display: grid; grid-template-columns: 80px 1fr 200px; align-items: center; padding: 8px 12px; border-bottom: 1px solid #e3e3e3; background: #fff; }
  .app-header__center { display: flex; justify-content: center; }
  .app-header__right { display: flex; justify-content: flex-end; gap: 12px; }
  .logo { font-weight: 600; letter-spacing: 0.6px; }
  .icon-button { cursor: pointer; border: 1px solid #d7d7d7; border-radius: 6px; padding: 6px 8px; background: #fff; }
  .app-sidebar { grid-row: 2 / 3; padding: 12px; border-right: 1px solid #e3e3e3; overflow: auto; }
  .menu { list-style: none; padding: 0; margin: 0; }
  .menu-item { display: flex; gap: 8px; align-items: center; padding: 6px 4px; }
  .app-main { padding: 16px; overflow: auto; }
  .app-footer { grid-column: 1 / -1; padding: 8px 12px; border-top: 1px solid #e3e3e3; background: #fff; }
  .profile-menu, .notification-menu { position: relative; }
  .profile-menu summary, .notification-menu summary { list-style: none; }
  .profile-menu summary::-webkit-details-marker, .notification-menu summary::-webkit-details-marker { display: none; }
  .dropdown { position: absolute; right: 0; top: 36px; min-width: 200px; padding: 12px; background: #fff; border: 1px solid #d7d7d7; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); }
  .dropdown p { margin: 0 0 8px; }
  .dropdown button { width: 100%; padding: 6px 8px; margin-top: 6px; }
  .avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #1d1d1d; color: #fff; font-size: 14px; }
  .profile-notifications { display: none; }
  .sidebar-toggle:checked + .app-shell { grid-template-columns: 72px 1fr; }
  .sidebar-toggle:checked + .app-shell .menu-label { display: none; }

  @media (max-width: 900px) {
    .app-shell { grid-template-columns: 200px 1fr; }
  }

  @media (max-width: 768px) {
    .app-shell { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; }
    .app-header { grid-template-columns: 60px 1fr 80px; }
    .app-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 80%; max-width: 320px; background: #fff; border-right: 1px solid #e3e3e3; padding: 16px; transform: translateX(-110%); transition: transform 0.2s ease; z-index: 20; }
    .sidebar-toggle:checked + .app-shell .app-sidebar { transform: translateX(0); }
    .notification-menu { display: none; }
    .profile-notifications { display: block; }
    .app-main { padding: 14px; }
  }
`;
