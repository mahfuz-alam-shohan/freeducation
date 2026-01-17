import { sidebar } from "./components/sidebar.js";
import { topbar } from "./components/topbar.js";
import { contentShell } from "./components/contentShell.js";

function dashboardShellPc({
  title,
  contextLabel,
  navItems,
  siteName,
  userProfile,
  authAction,
  content,
}) {
  const sidebarSlot = sidebar({
    navItems,
  });
  const topbarSlot = topbar({
    siteName,
    pageTitle: title,
    contextLabel,
    userProfile,
    authAction,
  });
  const mainContent = contentShell({ content });

  return `
    <div class="pc-admin-layout">
      ${topbarSlot}
      <div class="pc-admin-body">
        ${sidebarSlot}
        ${mainContent}
      </div>
    </div>
  `;
}

export { dashboardShellPc };
