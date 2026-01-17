import { topbar } from "./components/topbar.js";
import { contentShell } from "./components/contentShell.js";
import { bottomNav } from "./components/bottomNav.js";

function dashboardShellPhone({ title, contextLabel, bottomNavItems, actionSlot, content }) {
  const topbarSlot = topbar({ title, contextLabel });
  const mainContent = contentShell({ content, topbarSlot });
  const bottomNavSlot = bottomNav({ items: bottomNavItems, actionSlot });

  return `
    ${mainContent}
    ${bottomNavSlot}
  `;
}

export { dashboardShellPhone };
