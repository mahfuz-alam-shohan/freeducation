import { appScript } from '../assets.js';
import { getNavigation } from '../navigation.js';
import { imageUrlFromKey } from '../imageUrl.js';
import { basePage } from './base.js';
import { renderNavigationGroup } from './navigationMarkup.js';
import { iconClose, iconLogout, iconMenu, iconProfile, siteLogo } from './icons.js';
import { sidebarIdentityMarkup } from './sidebarIdentity.js';

function initials(name) {
  return String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function publicSidebar(active, user) {
  const nav = getNavigation(user?.role);

  return `<aside class="sidebar public-sidebar">
    <header class="sidebar-head">
      <span class="brand">
        <span class="brand-logo" aria-hidden="true">${siteLogo}</span>
        <span class="brand-name">freeducation</span>
      </span>
    </header>
    <div class="sidebar-scroll">
      ${sidebarIdentityMarkup(user)}
      ${nav.map((group) => renderNavigationGroup(group, active)).join('')}
    </div>
    <div class="sidebar-foot">
      <a href="${user ? '/api/logout' : '/login'}" class="menu-item ${user ? 'logout-item' : 'sidebar-login-item'}"><span class="icon">${user ? iconLogout : iconProfile}</span><span class="label">${user ? 'Log out' : 'Login'}</span></a>
    </div>
  </aside>`;
}

function publicTopbar(user) {
  const avatarUrl = imageUrlFromKey(user?.imageKey);
  const avatarLabel = user ? `${user.name} avatar` : 'Profile';
  const triggerAvatar = user
    ? `<span class="avatar" aria-label="Profile">${avatarUrl ? `<img src="${avatarUrl}" alt="${avatarLabel}" loading="lazy" decoding="async" />` : initials(user.name)}</span>`
    : `<span class="avatar" aria-hidden="true">${iconProfile}</span>`;
  const action = user
    ? triggerAvatar
    : `<div class="profile-menu" data-profile-menu>
        <button class="profile-trigger" type="button" aria-haspopup="true" aria-expanded="false" data-profile-trigger>${triggerAvatar}</button>
        <div class="profile-popup" data-profile-popup hidden>
          <span class="avatar">${iconProfile}</span>
          <p class="muted">Login to get full access.</p>
          <a class="btn btn-primary profile-popup-login-btn" href="/login">Login</a>
        </div>
      </div>`;
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
      <div class="topbar-right">${action}</div>
    </header>`;
}

export function publicShell(active, user, title, content, script = '') {
  return basePage(
    title,
    `<div class="app-shell" data-shell>
      ${publicSidebar(active, user)}
      <div class="mobile-overlay" data-overlay></div>
      <main class="main-shell public-main-shell">
        ${publicTopbar(user)}
        <div class="public-content-shell">${content}</div>
        ${active === 'home' ? '' : '<footer class="public-footer">Freeducation</footer>'}
      </main>
    </div>`,
    `${appScript}\n${script || ''}`
  );
}
