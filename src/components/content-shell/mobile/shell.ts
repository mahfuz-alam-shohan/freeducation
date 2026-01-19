export type ContentShellProps = {
  header: string;
  sidebar: string;
  main: string;
  footer: string;
};

export const renderContentShellMobile = ({ header, sidebar, main, footer }: ContentShellProps): string => `
  <div class="app app--mobile">
    <input class="sidebar-toggle" type="checkbox" id="sidebar-toggle" />
    <div class="app-shell">
      ${header}
      ${sidebar}
      <main class="app-main">${main}</main>
      ${footer}
    </div>
  </div>
`;

export const mobileShellStyles = `
  .app { min-height: 100vh; background: #fff; color: #1d1d1d; font-family: Arial, sans-serif; }
  .sidebar-toggle { position: absolute; opacity: 0; pointer-events: none; }
  .app-shell { display: grid; grid-template-rows: auto 1fr auto; height: 100vh; }
  .app-header { display: grid; grid-template-columns: 60px 1fr 80px; align-items: center; padding: 8px 12px; border-bottom: 1px solid #e3e3e3; background: #fff; }
  .app-header__center { display: flex; justify-content: center; }
  .app-header__right { display: flex; justify-content: flex-end; }
  .logo { font-weight: 600; letter-spacing: 0.6px; }
  .icon-button { cursor: pointer; border: 1px solid #d7d7d7; border-radius: 6px; padding: 6px 8px; background: #fff; }
  .app-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 80%; max-width: 320px; background: #fff; border-right: 1px solid #e3e3e3; padding: 16px; transform: translateX(-110%); transition: transform 0.2s ease; z-index: 20; overflow: auto; }
  .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .menu { list-style: none; padding: 0; margin: 0; }
  .menu-item { display: flex; gap: 8px; align-items: center; padding: 6px 4px; }
  .app-main { padding: 14px; overflow: auto; }
  .app-footer { padding: 8px 12px; border-top: 1px solid #e3e3e3; background: #fff; }
  .profile-menu summary { list-style: none; }
  .profile-menu summary::-webkit-details-marker { display: none; }
  .dropdown { position: absolute; right: 12px; top: 48px; min-width: 200px; padding: 12px; background: #fff; border: 1px solid #d7d7d7; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); }
  .dropdown button { width: 100%; padding: 6px 8px; margin-top: 6px; }
  .avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #1d1d1d; color: #fff; font-size: 14px; }
  .sidebar-toggle:checked + .app-shell .app-sidebar { transform: translateX(0); }
`;
