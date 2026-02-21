import { iconChevron } from './icons.js';

export function renderNavigationGroup(group, active) {
  if (group.collapsible) {
    const expanded = (group.expandedKeys || []).includes(active);
    const items = group.items
      .map(
        (item) =>
          `<a href="${item.href}" class="submenu-item ${active === item.key ? 'active' : ''}"><span class="icon">${item.icon}</span><span class="label">${item.label}</span></a>`
      )
      .join('');
    return `<div class="menu-block ${expanded ? 'open' : ''}">
      <button class="menu-expand" data-expand aria-expanded="${expanded ? 'true' : 'false'}"><span class="menu-leading"><span class="icon">${group.icon}</span><span class="label">${group.title}</span></span><span class="chevron">${iconChevron}</span></button>
      <div class="submenu-wrap"><div class="submenu">${items}</div></div>
    </div>`;
  }

  const items = group.items
    .map(
      (item) =>
        `<a href="${item.href}" class="menu-item ${active === item.key ? 'active' : ''}"><span class="icon">${item.icon}</span><span class="label">${item.label}</span></a>`
    )
    .join('');
  return `<p class="nav-group-title">${group.title}</p>${items}`;
}
