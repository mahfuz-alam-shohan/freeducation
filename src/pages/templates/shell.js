import { appScript } from '../assets.js';
import { getNavigation } from '../navigation.js';
import { basePage } from './base.js';
import { imageUrlFromKey } from '../imageUrl.js';
import { iconChevron, iconClose, iconCollapse, iconLogout, iconMenu, siteLogo } from './icons.js';

function initials(name) {
  return String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function renderNavigationGroup(group, active) {
  if (group.collapsible) {
    const expanded = (group.expandedKeys || []).includes(active);
    const items = group.items
      .map(
        (item) =>
          `<a href="${item.href}" class="submenu-item ${active === item.key ? 'active' : ''}"><span class="icon">${item.icon}</span><span class="label">${item.label}</span></a>`
      )
      .join('');
    return `<div class="menu-block ${expanded ? 'open' : ''}">
      <button class="menu-expand" data-expand aria-expanded="${expanded ? 'true' : 'false'}"><span><span class="icon">${group.icon}</span><span class="label">${group.title}</span></span><span class="chevron">${iconChevron}</span></button>
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

function sidebar(active, user) {
  const nav = getNavigation(user.role);
  return `<aside class="sidebar">
    <header class="sidebar-head">
      <span class="brand">
        <span class="brand-logo" aria-hidden="true">${siteLogo}</span>
        <span class="brand-name">freeducation</span>
      </span>
      <button class="sidebar-toggle desktop-only" data-sidebar-toggle aria-label="Collapse sidebar" aria-expanded="true">
        <span class="toggle-icon" aria-hidden="true">${iconCollapse}</span>
      </button>
    </header>
    <div class="sidebar-scroll">
      <p class="muted sidebar-login-note">Logged in as <strong class="login-name">${user.name}</strong> (${user.role})</p>
      ${nav.map((group) => renderNavigationGroup(group, active)).join('')}
      <a href="/api/logout" class="menu-item logout-item"><span class="icon">${iconLogout}</span><span class="label">Log out</span></a>
    </div>
  </aside>`;
}

function topbar(user) {
  const avatarUrl = imageUrlFromKey(user.imageKey);
  const avatarLabel = `${user.name} avatar`;
  return `<header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn mobile-only mobile-menu-btn" data-mobile-toggle aria-label="Open navigation menu" aria-expanded="false"><span class="mobile-icon mobile-icon-menu" aria-hidden="true">${iconMenu}</span><span class="mobile-icon mobile-icon-close" aria-hidden="true">${iconClose}</span></button>
      </div>
      <div class="topbar-center">
        <span class="brand topbar-brand">
          <span class="brand-logo" aria-hidden="true">${siteLogo}</span>
          <span class="brand-name">freeducation</span>
        </span>
      </div>
      <div class="topbar-right">
        <span class="avatar" aria-label="Profile">${avatarUrl ? `<img src="${avatarUrl}" alt="${avatarLabel}" loading="lazy" />` : initials(user.name)}</span>
      </div>
    </header>`;
}

export function appShell(active, user, pageTitle, subtitle, content) {
  return basePage(
    pageTitle,
    `<div class="app-shell" data-shell>
      ${sidebar(active, user)}
      <div class="mobile-overlay" data-overlay></div>
      <main class="main-shell">
        ${topbar(user)}
        <div class="container">
          <section class="page-head">
            <h1 class="page-title">${pageTitle}</h1>
            <p class="page-subtitle">${subtitle}</p>
          </section>
          ${content}
        </div>
      </main>
    </div>`,
    appScript
  );
}
