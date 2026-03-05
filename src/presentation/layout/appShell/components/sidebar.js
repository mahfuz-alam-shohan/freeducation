import { renderShellNav } from "../navigation.js";
import { APP_SHELL_ICONS } from "../icons.js";

function normalizeNavSections(navItems = []) {
  const list = Array.isArray(navItems) ? navItems : [];
  if (!list.length) return [];
  const first = list[0] || {};
  if (Array.isArray(first.items)) return list;
  return [{ title: "", items: list }];
}

function flattenNavItems(navItems = []) {
  const sections = normalizeNavSections(navItems);
  return sections.flatMap((section) => (Array.isArray(section?.items) ? section.items : []));
}

function pickMobilePrimaryItems(navItems = []) {
  const items = flattenNavItems(navItems);
  if (!items.length) return [];
  const priority = ["home", "social", "results"];
  const picked = [];
  priority.forEach((key) => {
    const match = items.find((item) => String(item?.key || "").trim().toLowerCase() === key);
    if (match && !picked.some((entry) => entry.key === match.key)) picked.push(match);
  });
  items.forEach((item) => {
    if (picked.length >= 3) return;
    if (!picked.some((entry) => entry.key === item.key)) picked.push(item);
  });
  return picked.slice(0, 3);
}

function renderMobileBottomNav({ navItems, activeMenu }) {
  const quickItems = pickMobilePrimaryItems(navItems);
  if (!quickItems.length) return "";

  const safeActive = String(activeMenu || "").trim().toLowerCase();
  const isQuickActive = quickItems.some((item) => String(item?.key || "").trim().toLowerCase() === safeActive);

  const quickLinks = quickItems.map((item) => {
    const key = String(item?.key || "").trim();
    const href = String(item?.href || "").trim() || "/";
    const label = String(item?.label || key || "Link").trim();
    const icon = String(item?.icon || "");
    const isActive = safeActive && safeActive === key.toLowerCase();
    return `<a class="app-mobile-nav-link${isActive ? " active" : ""}" href="${href}" data-nav-key="${key}"><span class="app-mobile-nav-icon">${icon}</span><span class="app-mobile-nav-label">${label}</span></a>`;
  }).join("");

  const menuActive = !isQuickActive;
  return `<nav class="app-mobile-nav" aria-label="Mobile navigation">${quickLinks}<button id="appMobileMenu" class="app-mobile-nav-link app-mobile-nav-menu${menuActive ? " active" : ""}" type="button" data-nav-key="menu" aria-label="Open menu" aria-expanded="false"><span class="app-mobile-nav-icon">${APP_SHELL_ICONS.menu}</span><span class="app-mobile-nav-label">Menu</span></button></nav>`;
}

export function renderAppSidebar({ navItems, activeMenu }) {
  const nav = renderShellNav(navItems, activeMenu);
  const mobileBottomNav = renderMobileBottomNav({ navItems, activeMenu });

  return `<aside id="appSidebar" class="app-sidebar">${nav}<div class="app-theme-wrap"><button id="themeToggle" class="app-theme-toggle" type="button" data-theme-state="idle" aria-pressed="false" aria-busy="false"><span class="app-theme-orb" aria-hidden="true"><svg class="app-theme-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"></path></svg><svg class="app-theme-moon" viewBox="0 0 24 24"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"></path></svg></span><span class="app-theme-copy"><span class="app-theme-label">Theme</span><span id="themeToggleText" class="app-theme-text">Dark mode on</span></span><span id="themeToggleChip" class="app-theme-chip">Dark</span></button></div></aside>${mobileBottomNav}`;
}
