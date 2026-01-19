import { renderHomeIcon } from "../../ui/icons";

export const renderSidebarDesktop = (): string => `
  <aside class="app-sidebar app-sidebar--desktop">
    <nav>
      <ul class="menu">
        <li class="menu-item">
          <span class="menu-icon">${renderHomeIcon()}</span>
          <span class="menu-label">Home</span>
        </li>
      </ul>
    </nav>
  </aside>
`;
