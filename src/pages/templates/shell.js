import { appScript } from "../assets.js";
import { getNavigation } from "../navigation.js";
import { basePage } from "./base.js";
import { imageUrlFromKey } from "../imageUrl.js";
import { renderNavigationGroup } from "./navigationMarkup.js";
import { iconClose, iconCollapse, iconLogout, iconMenu, iconProfile, siteLogo } from "./icons.js";
import { sidebarIdentityMarkup } from "./sidebarIdentity.js";

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
      ${sidebarIdentityMarkup(user)}
      ${nav.map((group) => renderNavigationGroup(group, active)).join("")}
    </div>
    <div class="sidebar-foot">
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
        <div class="profile-menu" data-profile-menu>
          <button class="profile-trigger" type="button" aria-haspopup="true" aria-expanded="false" data-profile-trigger>
            <span class="avatar" aria-label="Profile">${avatarUrl ? `<img src="${avatarUrl}" alt="${avatarLabel}" loading="lazy" decoding="async" />` : iconProfile}</span>
          </button>
          <div class="profile-popup" data-profile-popup hidden>
            <p class="profile-popup-name">${user.name}</p>
            <p class="profile-popup-email">${user.email}</p>
            <div class="profile-popup-actions">
              <a class="btn btn-secondary profile-popup-btn" href="/profile">Show profile</a>
              <a class="btn btn-danger profile-popup-btn" href="/api/logout">Log out</a>
            </div>
          </div>
        </div>
      </div>
    </header>`;
}

export function appShell(active, user, pageTitle, subtitle, content, options = {}) {
  const hidePageHead = user.role === "admin" || Boolean(options.hidePageHead);
  const containerClass = `container${options.fullBleed ? " container-full-bleed" : ""}`;
  const pageHeadClass = "page-head";
  return basePage(
    pageTitle,
    `<div class="app-shell" data-shell>
      ${sidebar(active, user)}
      <div class="mobile-overlay" data-overlay></div>
      <main class="main-shell">
        ${topbar(user)}
        <div class="${containerClass}">
          ${
            hidePageHead
              ? ""
              : `<section class="${pageHeadClass}">
            <h1 class="page-title">${pageTitle}</h1>
            <p class="page-subtitle">${subtitle}</p>
          </section>`
          }
          <div data-live-region="page-content">${content}</div>
        </div>
      </main>
    </div>`,
    appScript,
    options.pageStyles || "",
  );
}
