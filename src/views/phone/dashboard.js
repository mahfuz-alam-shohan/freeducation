import { topbar } from "./components/topbar.js";
import { contentShell } from "./components/contentShell.js";
import { bottomNav } from "./components/bottomNav.js";

function dashboardShellPhone({ siteName, userProfile, bottomNavItems, content }) {
  const topbarSlot = topbar({ siteName, userProfile });
  const mainContent = contentShell({ content, topbarSlot });
  const bottomNavSlot = bottomNav({ items: bottomNavItems });

  return `
    ${mainContent}
    ${bottomNavSlot}
  `;
}

export { dashboardShellPhone };
