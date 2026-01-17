import { adminSidebar } from "./components/adminSidebar.js";
import { adminTopbar } from "./components/adminTopbar.js";
import { adminContent } from "./components/adminContent.js";

function adminShellPc({ title, userName, active, content }) {
  const sidebar = adminSidebar({ userName, active });
  const topbar = adminTopbar({ title });
  const mainContent = adminContent({ content, topbar });

  return `
    <div class="pc-admin-layout">
      ${sidebar}
      ${mainContent}
    </div>
  `;
}

export { adminShellPc };
