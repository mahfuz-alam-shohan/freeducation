function normalizeNavSections(navItems = []) {
  if (!Array.isArray(navItems) || !navItems.length) return [];
  const first = navItems[0] || {};
  if (Array.isArray(first.items)) return navItems;
  return [{ title: "", items: navItems }];
}

export function renderShellNav(navItems = [], activeMenu = "") {
  const sections = normalizeNavSections(navItems);
  return `<nav class="app-nav">${sections.map((section) => {
    const title = String(section?.title || "").trim();
    const items = Array.isArray(section?.items) ? section.items : [];
    return `<section class="app-nav-section">${title ? `<h3 class="app-nav-title">${title}</h3>` : ""}<div class="app-nav-links">${items.map((item) => `<a class="${activeMenu === item.key ? "active" : ""} ${item.kind === "highlight" ? "app-nav-highlight" : ""}" href="${item.href}" data-nav-key="${item.key || ""}"><span class="app-nav-icon">${item.icon || ""}</span><span class="app-nav-label">${item.label || ""}</span></a>`).join("")}</div></section>`;
  }).join("")}</nav>`;
}

export function initialsForName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}
