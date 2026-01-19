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
  .app { min-height: 100vh; background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
  .sidebar-toggle { position: absolute; opacity: 0; pointer-events: none; }
  .app-shell { display: grid; grid-template-rows: auto 1fr auto; height: 100vh; background: var(--color-bg); }
  .app-header { display: grid; grid-template-columns: 60px 1fr 80px; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
  .app-header__center { display: flex; justify-content: center; }
  .app-header__right { display: flex; justify-content: flex-end; }
  .logo { font-weight: 600; letter-spacing: 0.6px; color: var(--color-text); }
  .icon-button { cursor: pointer; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 6px 8px; background: var(--color-surface); color: var(--color-text); }
  .app-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 80%; max-width: 320px; background: var(--color-surface); border-right: 1px solid var(--color-border); padding: 16px; transform: translateX(-110%); transition: transform 0.2s ease; z-index: 20; overflow: auto; }
  .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .menu { list-style: none; padding: 0; margin: 0; }
  .menu-item { display: flex; gap: 8px; align-items: center; padding: 6px 4px; color: var(--color-text); }
  .app-main { padding: 14px; overflow: auto; background: var(--color-surface); }
  .app-footer { padding: 8px 12px; border-top: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted); }
  .profile-menu summary { list-style: none; }
  .profile-menu summary::-webkit-details-marker { display: none; }
  .dropdown { position: absolute; right: 12px; top: 48px; min-width: 200px; padding: 12px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
  .dropdown button { width: 100%; padding: 6px 8px; margin-top: 6px; }
  .avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--color-accent); color: #fff; font-size: 14px; }
  .sidebar-toggle:checked + .app-shell .app-sidebar { transform: translateX(0); }
`;
