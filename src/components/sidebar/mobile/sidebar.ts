import type { AdminSession } from "../../../services/security/session";
import { renderCloseIcon, renderHomeIcon, renderModulesIcon, renderUsersIcon } from "../../ui/icons";

type SidebarProps = {
  session: AdminSession | null;
};

export const renderSidebarMobile = ({ session }: SidebarProps): string => `
  <aside class="app-sidebar app-sidebar--mobile">
    <div class="sidebar-header">
      <span>Menu</span>
      <label class="icon-button" for="sidebar-toggle" aria-label="Close sidebar">${renderCloseIcon()}</label>
    </div>
    <nav>
      <ul class="menu">
        <li>
          <a class="menu-item" href="/">
            <span class="menu-icon">${renderHomeIcon()}</span>
            <span class="menu-label">Home</span>
          </a>
        </li>
        ${
          session
            ? `<li>
          <a class="menu-item" href="/admin/users">
            <span class="menu-icon">${renderUsersIcon()}</span>
            <span class="menu-label">User management</span>
          </a>
        </li>`
            : ""
        }
        ${
          session
            ? `<li>
          <a class="menu-item" href="/admin/modules">
            <span class="menu-icon">${renderModulesIcon()}</span>
            <span class="menu-label">Modules</span>
          </a>
        </li>`
            : ""
        }
      </ul>
    </nav>
  </aside>
`;
