export type ContentShellProps = {
  header: string;
  sidebar: string;
  main: string;
  footer: string;
};

export const renderContentShellTablet = ({ header, sidebar, main, footer }: ContentShellProps): string => `
  <div class="app app--tablet">
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

export const tabletShellStyles = `
  /* Tablet Layout System */
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
  
  .app-shell { 
    display: grid; 
    grid-template-columns: 200px 1fr; 
    grid-template-rows: auto 1fr auto; 
    min-height: 100vh; 
    min-height: 100dvh; 
    height: 100vh; 
    height: 100dvh; 
    background: var(--color-bg); 
    transition: grid-template-columns 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Tablet controls layout spacing */
  .sidebar-toggle:checked + .app-shell { 
    grid-template-columns: 60px 1fr; 
  }
  
  /* Toggle icon states for tablet */
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
    grid-template-columns: 60px 1fr 120px;
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

  /* Main Content Area - tablet specific */
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
    padding: 10px 14px 14px;
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

  /* Tablet specific - no responsive styles */
  
  /* Glassy UI and Bouncy Animations */
  .app-shell {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.05);
  }
  
  :root[data-theme="dark"] .app-shell {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .app-header {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  :root[data-theme="dark"] .app-header {
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .app-sidebar {
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.08);
    border-right: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  :root[data-theme="dark"] .app-sidebar {
    background: rgba(0, 0, 0, 0.08);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .app-main {
    backdrop-filter: blur(5px);
  }
  
  .icon-button {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  :root[data-theme="dark"] .icon-button {
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  .icon-button:hover { 
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  :root[data-theme="dark"] .icon-button:hover {
    background: rgba(0, 0, 0, 0.25);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  /* Bouncy sidebar transitions */
  .app-shell {
    transition: grid-template-columns 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .app-sidebar {
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .menu-item {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .menu-item:hover { 
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .menu-icon {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .menu-label {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  /* Bouncy theme toggle */
  .theme-toggle {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  :root[data-theme="dark"] .theme-toggle {
    background: rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  
  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
  
  :root[data-theme="dark"] .theme-toggle:hover {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  .theme-toggle:active {
    transform: translateY(-1px) scale(0.98);
  }
`;
