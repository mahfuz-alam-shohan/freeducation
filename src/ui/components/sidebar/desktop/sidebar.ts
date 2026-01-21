import type { AdminSession } from "../../../../core/security/session";
import { renderHomeIcon, renderModulesIcon, renderUsersIcon, renderSunIcon, renderMoonIcon } from "../../icons";

type SidebarProps = {
  session: AdminSession | null;
};

const createMenuItem = (href: string, icon: string, label: string): string => `
  <li>
    <a class="menu-item" href="${href}">
      <span class="menu-icon">${icon}</span>
      <span class="menu-label">${label}</span>
    </a>
  </li>
`;

const renderNavigationItems = (session: AdminSession | null): string => {
  const items = [
    createMenuItem("/", renderHomeIcon(), "Home")
  ];
  
  if (session) {
    items.push(
      createMenuItem("/admin/users", renderUsersIcon(), "User management"),
      createMenuItem("/admin/modules", renderModulesIcon(), "Modules")
    );
  }
  
  return items.join("");
};

const renderThemeToggle = (): string => `
  <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Toggle theme">
    <span class="theme-toggle__icon theme-toggle__icon--sun">${renderSunIcon()}</span>
    <span class="theme-toggle__icon theme-toggle__icon--moon">${renderMoonIcon()}</span>
    <span class="theme-toggle__label">Theme</span>
  </button>
`;

export const renderSidebarDesktop = ({ session }: SidebarProps): string => `
  <aside class="app-sidebar app-sidebar--desktop">
    <nav>
      <ul class="menu">
        ${renderNavigationItems(session)}
      </ul>
    </nav>
    <div class="sidebar-footer">
      ${renderThemeToggle()}
    </div>
  </aside>
`;

export const sidebarDesktopStyles = `
  /* Sidebar controls its own appearance */
  .app-sidebar {
    grid-row: 2 / 3;
    padding: 10px;
    border-right: 1px solid var(--color-border);
    background: var(--color-surface-muted);
    overflow-y: auto;
    box-shadow: var(--shadow-sm);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Navigation Menu */
  .menu { 
    list-style: none; 
    padding: 0; 
    margin: 0; 
  }
  
  .menu-item {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 6px;
    border-radius: var(--radius-sm);
    color: var(--color-text);
    border: 1px solid transparent;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  
  .menu-item:hover { 
    background: var(--color-surface-elevated); 
    border-color: var(--color-border); 
    transform: translateX(2px); 
  }
  
  /* Sidebar appearance when shrunk */
  .sidebar-toggle:checked + .app-shell .menu-item:hover {
    transform: translateX(0);
    background: var(--color-surface-elevated); 
  }
  
  .menu-icon { 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    color: var(--color-text-muted); 
    flex-shrink: 0;
  }
  
  .menu-label { 
    transition: all 0.2s ease; 
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Sidebar controls its own full/shrunk appearance */
  .sidebar-toggle:checked + .app-shell .menu-label { 
    opacity: 0; 
    visibility: hidden;
    position: absolute;
    pointer-events: none;
  }
  
  .sidebar-toggle:checked + .app-shell .menu-item {
    justify-content: center;
    width: 100%;
    min-width: 0; /* Prevent flex items from overflowing */
  }
  
  .sidebar-toggle:checked + .app-shell .menu-icon {
    flex-shrink: 0;
    min-width: 0;
    overflow: hidden;
  }
  
  .sidebar-toggle:checked + .app-shell .app-sidebar { 
    padding: 10px 6px; 
    overflow-x: hidden; /* Prevent horizontal scrolling */
    overflow-y: auto; /* Allow vertical scrolling only */
  }
  
  /* Hide theme button label when sidebar is minimized */
  .sidebar-toggle:checked + .app-shell .theme-toggle__label {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    pointer-events: none;
  }
  
  .sidebar-toggle:checked + .app-shell .theme-toggle {
    justify-content: center;
    width: 100%;
    min-width: 0;
  }

  /* Sidebar Footer */
  .sidebar-footer {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--color-border);
  }

`;
