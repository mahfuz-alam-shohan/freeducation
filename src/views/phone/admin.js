import { adminTopbar } from "./components/adminTopbar.js";
import { adminContent } from "./components/adminContent.js";
import { adminBottomNav } from "./components/adminBottomNav.js";

function adminShellPhone({ title, active, content }) {
  const topbar = adminTopbar({ title });
  const mainContent = adminContent({ content, topbar });
  const bottomNav = adminBottomNav({ active });

  return `
    ${mainContent}
    ${bottomNav}
  `;
}

export { adminShellPhone };
