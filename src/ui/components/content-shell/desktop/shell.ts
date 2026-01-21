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
  /* Layout System */
  .app { 
    min-height: 100vh; 
    background: var(--color-bg); 
    color: var(--color-text); 
    font-family: var(--font-body); 
  }
  
  .sidebar-toggle { 
    position: absolute; 
    opacity: 0; 
    pointer-events: none; 
  }
  
  /* Toggle icon states for desktop */
  .sidebar-toggle__icon { 
    display: inline-flex; 
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .sidebar-toggle__icon--open { 
    display: none; 
    opacity: 0;
    transform: rotate(180deg);
  }
  
  .sidebar-toggle__icon--close { 
    display: inline-flex; 
  }
  
  .app-shell { 
    display: grid; 
    grid-template-columns: 240px 1fr; 
    grid-template-rows: auto 1fr auto; 
    min-height: 100vh; 
    min-height: 100dvh; 
    height: 100vh; 
    height: 100dvh; 
    background: var(--color-bg); 
    transition: grid-template-columns 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Layout controls spacing between sidebar and main content */
  .sidebar-toggle:checked + .app-shell { 
    grid-template-columns: 60px 1fr; 
  }
  
  /* Toggle icon states when checked */
  .sidebar-toggle:checked + .app-shell .sidebar-toggle__icon--open { 
    display: inline-flex; 
    opacity: 1;
    transform: rotate(0deg);
  }
  
  .sidebar-toggle:checked + .app-shell .sidebar-toggle__icon--close { 
    display: none; 
    opacity: 0;
    transform: rotate(-180deg);
  }

  /* Header Component */
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
  
  .app-header__center { 
    display: flex; 
    justify-content: center; 
  }
  
  .app-header__right { 
    display: flex; 
    justify-content: flex-end; 
    gap: 12px; 
  }
  
  .logo { 
    font-family: var(--font-display); 
    font-weight: 600; 
    letter-spacing: 0.4px; 
    color: var(--color-text); 
    text-transform: lowercase; 
  }

  /* Interactive Elements */
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
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .icon-button:hover { 
    border-color: var(--color-border-strong); 
    background: var(--color-surface-muted); 
    transform: translateY(-1px); 
  }

  /* Main Content Area - gets more/less space based on sidebar */
  .app-main {
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    min-height: 0;
    background: var(--color-bg);
    position: relative;
    z-index: 1;
  }
  
  .app-main__content {
    padding: 12px 16px 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
    min-height: 0;
    transition: all 0.2s ease;
    animation: page-enter 0.35s ease;
  }

  /* Footer Component */
  .app-footer { 
    grid-column: 1 / -1; 
    padding: 6px 12px; 
    border-top: 1px solid var(--color-border); 
    background: var(--color-surface-muted); 
    color: var(--color-text-muted); 
    text-align: center; 
  }

  /* Dropdown Navigation */
  .profile-menu, .notification-menu { 
    position: relative; 
  }
  
  .profile-menu summary, .notification-menu summary { 
    list-style: none; 
    cursor: pointer; 
  }
  
  .profile-menu summary::-webkit-details-marker, 
  .notification-menu summary::-webkit-details-marker { 
    display: none; 
  }
  
  .profile-menu, .notification-menu { 
    z-index: 50; 
  }
  
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
  
  .dropdown p { 
    margin: 0 0 8px; 
    color: var(--color-text-muted); 
  }
  
  .dropdown p strong { 
    color: var(--color-text); 
  }
  
  .dropdown .button-link { 
    width: 100%; 
  }

  /* User Avatar */
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
  
  .profile-notifications { 
    display: none; 
  }

  /* Simple Theme Toggle - Clean and Professional */
  .theme-toggle {
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
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
  
  .theme-toggle:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
    transform: translateY(-1px);
  }
  
  .theme-toggle__icon { 
    display: inline-flex; 
    align-items: center; 
  }
  
  .theme-toggle__icon--moon { display: none; }
  .theme-toggle__label { font-size: 13px; font-weight: 600; }
  :root[data-theme="dark"] .theme-toggle__icon--sun { display: none; }
  :root[data-theme="dark"] .theme-toggle__icon--moon { display: inline-flex; }

  /* Glassy UI and Bouncy Animations - Enhanced Specificity */
  .app-shell {
    backdrop-filter: blur(10px) !important;
    background: rgba(255, 255, 255, 0.05) !important;
  }
  
  :root[data-theme="dark"] .app-shell {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  
  .app-header {
    backdrop-filter: blur(20px) !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
  
  :root[data-theme="dark"] .app-header {
    background: rgba(0, 0, 0, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  .app-sidebar {
    backdrop-filter: blur(15px) !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.15) !important;
  }
  
  :root[data-theme="dark"] .app-sidebar {
    background: rgba(0, 0, 0, 0.08) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  
  .app-main {
    backdrop-filter: blur(5px) !important;
  }
  
  .icon-button {
    backdrop-filter: blur(10px) !important;
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  :root[data-theme="dark"] .icon-button {
    background: rgba(0, 0, 0, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
  }
  
  .icon-button:hover { 
    background: rgba(255, 255, 255, 0.25) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
  
  :root[data-theme="dark"] .icon-button:hover {
    background: rgba(0, 0, 0, 0.25) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  }
  
  /* Bouncy sidebar transitions */
  .app-shell {
    transition: grid-template-columns 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  .app-sidebar {
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  .menu-item {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  .menu-item:hover { 
    transform: translateX(4px) scale(1.02) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  }
  
  .menu-icon {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  .menu-label {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  /* Bouncy theme toggle */
  .theme-toggle {
    backdrop-filter: blur(10px) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }
  
  :root[data-theme="dark"] .theme-toggle {
    background: rgba(0, 0, 0, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
  }
  
  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
  }
  
  :root[data-theme="dark"] .theme-toggle:hover {
    background: rgba(0, 0, 0, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
  }
  
  .theme-toggle:active {
    transform: translateY(-1px) scale(0.98) !important;
  }

  /* Desktop only - no responsive styles */
`;
