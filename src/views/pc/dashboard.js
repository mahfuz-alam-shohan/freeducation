import { sidebar } from "./components/sidebar.js";
import { topbar } from "./components/topbar.js";
import { contentShell } from "./components/contentShell.js";

function dashboardShellPc({
  title,
  contextLabel,
  navItems,
  sidebarTitle,
  sidebarSubtitle,
  actionSlot,
  content,
}) {
  const sidebarSlot = sidebar({
    title: sidebarTitle,
    subtitle: sidebarSubtitle,
    navItems,
    actionSlot,
  });
  const topbarSlot = topbar({ title, contextLabel });
  const mainContent = contentShell({ content, topbarSlot });

  return `
    <div class="pc-admin-layout">
      ${sidebarSlot}
      ${mainContent}
    </div>
  `;
}

export { dashboardShellPc };
