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
  .app { min-height: 100vh; min-height: 100dvh; background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
  .sidebar-toggle { position: absolute; opacity: 0; pointer-events: none; }
  .app-shell { display: grid; grid-template-rows: auto 1fr auto; min-height: 100vh; min-height: 100dvh; height: auto; background: linear-gradient(180deg, #0f132f 0%, #151b45 55%, #101432 100%); }
  .app-header { position: relative; z-index: 30; display: grid; grid-template-columns: 60px 1fr 80px; align-items: center; padding: 6px 12px; border-bottom: 1px solid var(--color-border); background: linear-gradient(90deg, #171c4e 0%, #232a68 100%); box-shadow: 0 8px 18px rgba(6, 8, 26, 0.35); }
  .app-header__center { display: flex; justify-content: center; }
  .app-header__right { display: flex; justify-content: flex-end; }
  .logo { font-weight: 600; letter-spacing: 0.5px; color: var(--color-text); text-transform: lowercase; }
  .icon-button {
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0;
    width: 36px;
    height: 36px;
    background: linear-gradient(180deg, #202862 0%, #191f4d 100%);
    color: var(--color-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
  .icon-button:hover { border-color: var(--color-border-strong); box-shadow: 0 10px 18px rgba(6, 8, 26, 0.35); transform: translateY(-1px); }
  .app-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 80%; max-width: 320px; background: linear-gradient(180deg, #141a3f 0%, #101636 100%); border-right: 1px solid var(--color-border); padding: 16px; transform: translateX(-110%); transition: transform 0.2s ease; z-index: 20; overflow: auto; }
  .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-weight: 600; color: var(--color-text); }
  .menu { list-style: none; padding: 0; margin: 0; }
  .menu-item { display: flex; gap: 10px; align-items: center; padding: 8px 6px; border-radius: var(--radius-sm); color: var(--color-text); border: 1px solid transparent; transition: background 0.2s ease, border-color 0.2s ease; }
  .menu-item:hover { background: var(--color-surface-elevated); border-color: var(--color-border); }
  .menu-icon { display: inline-flex; align-items: center; justify-content: center; color: var(--color-text-muted); }
  .app-main { padding: 10px; overflow: visible; background: linear-gradient(180deg, #141a40 0%, #12163a 100%); border: 1px solid var(--color-border); border-radius: 0; position: relative; z-index: 1; }
  .app-footer { padding: 6px 12px; border-top: 1px solid var(--color-border); background: #101636; color: var(--color-text-muted); text-align: center; }
  .profile-menu summary { list-style: none; cursor: pointer; }
  .profile-menu summary::-webkit-details-marker { display: none; }
  .profile-menu { position: relative; z-index: 50; }
  .dropdown { position: absolute; right: 12px; top: 52px; min-width: 220px; padding: 12px; background: linear-gradient(180deg, #202862 0%, #191f4d 100%); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: 0 16px 32px rgba(5, 7, 22, 0.45); z-index: 60; }
  .dropdown p { margin: 0 0 8px; color: var(--color-text-muted); }
  .dropdown p strong { color: var(--color-text); }
  .dropdown .button-link { width: 100%; }
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
  .sidebar-toggle:checked + .app-shell .app-sidebar { transform: translateX(0); }
`;
