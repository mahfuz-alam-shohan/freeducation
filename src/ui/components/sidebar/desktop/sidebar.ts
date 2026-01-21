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
