import { navIcons } from "./icons";

type NavItem = {
  id: string;
  href: string;
  icon: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", href: "/admin", icon: navIcons.dashboard, label: "Home" },
  { id: "classes", href: "/admin/classes", icon: navIcons.classes, label: "Classes" },
  { id: "settings", href: "/admin/settings", icon: navIcons.settings, label: "Settings" }
];

export function renderBottomNav(activeTab: string) {
  return `
    <nav class="bottom-nav" aria-label="Primary">
      ${navItems
        .map(
          (item) => `
          <a href="${item.href}" class="nav-item ${activeTab === item.id ? "active" : ""}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
            <span>${item.label}</span>
          </a>
        `
        )
        .join("")}
    </nav>
  `;
}
