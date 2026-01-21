import type { AdminSession } from "../../../../core/security/session";
import { renderHomeIcon, renderModulesIcon, renderUsersIcon, renderSunIcon, renderMoonIcon } from "../../icons";

type SidebarProps = {
  session: AdminSession | null;
};

const renderAdminMenuItems = (session: AdminSession | null): string => {
  if (!session) return "";
  
  return `
    <li>
      <a class="menu-item" href="/admin/users">
        <span class="menu-icon">${renderUsersIcon()}</span>
        <span class="menu-label">User management</span>
      </a>
    </li>
    <li>
      <a class="menu-item" href="/admin/modules">
        <span class="menu-icon">${renderModulesIcon()}</span>
        <span class="menu-label">Modules</span>
      </a>
    </li>
  `;
};

export const renderSidebarDesktop = ({ session }: SidebarProps): string => `
  <aside class="app-sidebar app-sidebar--desktop">
    <nav>
      <ul class="menu">
        <li>
          <a class="menu-item" href="/">
            <span class="menu-icon">${renderHomeIcon()}</span>
            <span class="menu-label">Home</span>
          </a>
        </li>
        ${renderAdminMenuItems(session)}
      </ul>
    </nav>
    <div class="sidebar-footer">
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Toggle theme">
        <span class="theme-toggle__icon theme-toggle__icon--sun">${renderSunIcon()}</span>
        <span class="theme-toggle__icon theme-toggle__icon--moon">${renderMoonIcon()}</span>
        <span class="theme-toggle__label">Theme</span>
      </button>
    </div>
  </aside>
`;
