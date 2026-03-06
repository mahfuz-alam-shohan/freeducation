import { renderShellNav } from "../navigation.js";
import { APP_SHELL_ICONS } from "../icons.js";

const ROLE = Object.freeze({
  ADMIN: "administrator",
  TEACHER: "teacher",
  STUDENT: "student",
  GUEST: "guest",
});

function normalizeNavSections(navItems = []) {
  const list = Array.isArray(navItems) ? navItems : [];
  if (!list.length) return [];
  const first = list[0] || {};
  if (Array.isArray(first.items)) return list;
  return [{ title: "", items: list }];
}

function normalizeRole(userType = "") {
  const normalized = String(userType || "").trim().toLowerCase();
  if (normalized === ROLE.ADMIN) return ROLE.ADMIN;
  if (normalized === ROLE.TEACHER) return ROLE.TEACHER;
  if (normalized === ROLE.STUDENT) return ROLE.STUDENT;
  return ROLE.GUEST;
}

function itemKey(item = {}) {
  return String(item?.key || "").trim().toLowerCase();
}

function flattenNavItems(navItems = []) {
  const sections = normalizeNavSections(navItems);
  return sections.flatMap((section) => (Array.isArray(section?.items) ? section.items : []));
}

function roleBottomTabKeys(role) {
  if (role === ROLE.ADMIN) return ["home", "social", "users"];
  if (role === ROLE.STUDENT) return ["home", "social", "results"];
  if (role === ROLE.TEACHER) return ["home", "social"];
  return ["home", "social"];
}

function buildNavByKey(items = []) {
  const map = new Map();
  items.forEach((item) => {
    const key = itemKey(item);
    if (!key || map.has(key)) return;
    map.set(key, item);
  });
  return map;
}

function buildMobileNavModel({ navItems, activeMenu, userType }) {
  const sections = normalizeNavSections(navItems);
  const role = normalizeRole(userType);
  const allItems = flattenNavItems(sections);
  const navByKey = buildNavByKey(allItems);
  const preferredTabKeys = roleBottomTabKeys(role);

  const bottomTabs = preferredTabKeys
    .map((key) => navByKey.get(key))
    .filter(Boolean);

  const tabKeys = new Set(bottomTabs.map((item) => itemKey(item)).filter(Boolean));
  const drawerHiddenKeys = new Set(tabKeys);
  if (role === ROLE.ADMIN || role === ROLE.TEACHER) drawerHiddenKeys.add("results");

  const drawerItems = sections
    .map((section) => ({
      title: String(section?.title || ""),
      items: (Array.isArray(section?.items) ? section.items : []).filter((item) => !drawerHiddenKeys.has(itemKey(item))),
    }))
    .filter((section) => section.items.length > 0);

  const safeActive = String(activeMenu || "").trim().toLowerCase();
  const isQuickActive = tabKeys.has(safeActive);

  return {
    role,
    bottomTabs,
    drawerItems,
    menuTabState: !isQuickActive,
    layoutColumns: Math.max(3, bottomTabs.length + 1),
  };
}

function renderMobileBottomNav(model = {}) {
  const quickItems = Array.isArray(model?.bottomTabs) ? model.bottomTabs : [];
  const columns = Math.max(3, Number(model?.layoutColumns || 4));
  const menuActiveByRoute = Boolean(model?.menuTabState);

  const quickLinks = quickItems.map((item) => {
    const key = String(item?.key || "").trim();
    const href = String(item?.href || "").trim() || "/";
    const label = String(item?.label || key || "Link").trim();
    const icon = String(item?.icon || "");
    const isActive = Boolean(String(item?.active || "").trim());
    return `<a class="app-mobile-nav-link${isActive ? " active" : ""}" href="${href}" data-nav-key="${key}"><span class="app-mobile-nav-icon">${icon}</span><span class="app-mobile-nav-label">${label}</span></a>`;
  }).join("");

  return `<nav class="app-mobile-nav" style="--app-mobile-nav-cols:${columns}" aria-label="Mobile navigation">${quickLinks}<button id="appMobileMenu" class="app-mobile-nav-link app-mobile-nav-menu${menuActiveByRoute ? " active" : ""}" type="button" data-nav-key="menu" aria-label="Open menu" aria-expanded="false"><span class="app-mobile-nav-icon">${APP_SHELL_ICONS.menu}</span><span class="app-mobile-nav-label">Menu</span></button></nav>`;
}

export function renderAppSidebar({ navItems, activeMenu, user }) {
  const model = buildMobileNavModel({
    navItems,
    activeMenu,
    userType: user?.user_type,
  });

  model.bottomTabs = model.bottomTabs.map((item) => ({
    ...item,
    active: itemKey(item) === String(activeMenu || "").trim().toLowerCase(),
  }));

  const desktopNav = renderShellNav(navItems, activeMenu);
  const drawerNav = renderShellNav(model.drawerItems, activeMenu);
  const mobileBottomNav = renderMobileBottomNav(model);

  return `<aside id="appSidebar" class="app-sidebar"><div class="app-nav-desktop">${desktopNav}</div><div class="app-nav-mobile">${drawerNav}</div><div class="app-theme-wrap"><button id="themeToggle" class="app-theme-toggle" type="button" data-theme-state="idle" aria-pressed="false" aria-busy="false"><span class="app-theme-orb" aria-hidden="true"><svg class="app-theme-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"></path></svg><svg class="app-theme-moon" viewBox="0 0 24 24"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"></path></svg></span><span class="app-theme-copy"><span class="app-theme-label">Theme</span><span id="themeToggleText" class="app-theme-text">Dark mode on</span></span><span id="themeToggleChip" class="app-theme-chip">Dark</span></button></div></aside>${mobileBottomNav}`;
}
