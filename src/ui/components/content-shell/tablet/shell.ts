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
  .theme-toggle__label { font-size: 12px; font-weight: 600; }
  :root[data-theme="dark"] .theme-toggle__icon--sun { display: none; }
  :root[data-theme="dark"] .theme-toggle__icon--moon { display: inline-flex; }
`;
