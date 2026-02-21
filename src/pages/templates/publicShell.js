import { appScript } from '../assets.js';
import { basePage } from './base.js';
import { iconClose, iconMenu, siteLogo } from './icons.js';

function publicSidebar(active) {
  const navItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'login', label: 'Login', href: '/login' },
  ];

  return `<aside class="sidebar public-sidebar">
    <header class="sidebar-head">
      <span class="brand">
        <span class="brand-logo" aria-hidden="true">${siteLogo}</span>
        <span class="brand-name">freeducation</span>
      </span>
    </header>
    <div class="sidebar-scroll">
      <p class="nav-group-title">Public</p>
      ${navItems
        .map(
          (item) =>
            `<a href="${item.href}" class="menu-item ${active === item.key ? 'active' : ''}"><span class="label">${item.label}</span></a>`
        )
        .join('')}
    </div>
  </aside>`;
}

function publicTopbar(user) {
  const action = user
    ? '<a class="btn btn-primary" href="/dashboard">Workspace</a>'
    : '<a class="btn btn-primary" href="/login">Login</a>';
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
      ${publicSidebar(active)}
      <div class="mobile-overlay" data-overlay></div>
      <main class="main-shell public-main-shell">
        ${publicTopbar(user)}
        <div class="public-content-shell">${content}</div>
        <footer class="public-footer">Freeducation</footer>
      </main>
    </div>`,
    `${appScript}\n${script || ''}`
  );
}
