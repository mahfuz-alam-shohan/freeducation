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

  /* Responsive Design */
  @media (max-width: 900px) {
    .app-shell { 
      grid-template-columns: 200px 1fr; 
    }
  }

  @media (max-width: 768px) {
    .app-shell { 
      grid-template-columns: 1fr; 
      grid-template-rows: auto 1fr auto; 
    }
    
    .app-header { 
      grid-template-columns: 60px 1fr 80px; 
    }
    
    .notification-menu { 
      display: none; 
    }
    
    .profile-notifications { 
      display: block; 
    }
    
    .app-main__content { 
      padding: 10px; 
    }
  }
`;
