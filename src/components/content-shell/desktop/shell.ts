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
  .app { min-height: 100vh; background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
  .sidebar-toggle { position: absolute; opacity: 0; pointer-events: none; }
  .app-shell { display: grid; grid-template-columns: 240px 1fr; grid-template-rows: auto 1fr auto; height: 100vh; background: var(--color-bg); }
  .app-header { grid-column: 1 / -1; display: grid; grid-template-columns: 80px 1fr 200px; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
  .app-header__center { display: flex; justify-content: center; }
  .app-header__right { display: flex; justify-content: flex-end; gap: 12px; }
  .logo { font-weight: 600; letter-spacing: 0.6px; color: var(--color-text); }
  .icon-button { cursor: pointer; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 6px 8px; background: var(--color-surface); color: var(--color-text); }
  .app-sidebar { grid-row: 2 / 3; padding: 12px; border-right: 1px solid var(--color-border); background: var(--color-surface); overflow: auto; }
  .menu { list-style: none; padding: 0; margin: 0; }
  .menu-item { display: flex; gap: 8px; align-items: center; padding: 6px 4px; color: var(--color-text); }
  .app-main { padding: 16px; overflow: auto; background: var(--color-surface); }
  .app-footer { grid-column: 1 / -1; padding: 8px 12px; border-top: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted); }
  .profile-menu, .notification-menu { position: relative; }
  .profile-menu summary, .notification-menu summary { list-style: none; }
  .profile-menu summary::-webkit-details-marker, .notification-menu summary::-webkit-details-marker { display: none; }
  .dropdown { position: absolute; right: 0; top: 36px; min-width: 200px; padding: 12px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
  .dropdown p { margin: 0 0 8px; }
  .dropdown button { width: 100%; padding: 6px 8px; margin-top: 6px; }
  .avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--color-accent); color: #fff; font-size: 14px; }
  .profile-notifications { display: none; }
  .sidebar-toggle:checked + .app-shell { grid-template-columns: 72px 1fr; }
  .sidebar-toggle:checked + .app-shell .menu-label { display: none; }

  @media (max-width: 900px) {
    .app-shell { grid-template-columns: 200px 1fr; }
  }

  @media (max-width: 768px) {
    .app-shell { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; }
    .app-header { grid-template-columns: 60px 1fr 80px; }
    .app-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 80%; max-width: 320px; background: var(--color-surface); border-right: 1px solid var(--color-border); padding: 16px; transform: translateX(-110%); transition: transform 0.2s ease; z-index: 20; }
    .sidebar-toggle:checked + .app-shell .app-sidebar { transform: translateX(0); }
    .notification-menu { display: none; }
    .profile-notifications { display: block; }
    .app-main { padding: 14px; }
  }
`;
