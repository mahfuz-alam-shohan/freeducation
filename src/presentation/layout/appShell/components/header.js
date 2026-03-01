import { APP_NAME } from "../../../../config/index.js";
import { renderSiteLogo } from "../../siteLogo.js";
import { APP_SHELL_ICONS } from "../icons.js";
import { renderAvatarButton } from "./userAvatar.js";
import { renderProfilePanel } from "./profilePanel.js";

export function renderAppHeader({ user, homePath, avatarVersion, avatarFallback, isAuthenticated, headerCenter = "" }) {
  const safeUser = user || { name: "Guest", email: "Not signed in" };
  const centerMarkup = String(headerCenter || "");
  const notificationsButton = isAuthenticated
    ? `<button id="appNotificationsToggle" class="app-notify-toggle" type="button" aria-label="Open notifications" aria-expanded="false" aria-controls="appNotificationsPanel">${APP_SHELL_ICONS.notifications}</button>`
    : "";

  return `<header class="app-header"><div class="app-header-left"><button id="appMenuOpen" class="app-menu-toggle" aria-label="Open menu" aria-expanded="false">${APP_SHELL_ICONS.menu}</button><button id="appBrandHome" class="app-brand app-brand-signature" type="button" aria-label="Go to ${APP_NAME} homepage" data-brand="${APP_NAME}" data-home="${homePath}">${renderSiteLogo({ className: "site-logo site-logo--block", label: APP_NAME })}</button></div><div class="app-header-center">${centerMarkup}</div><div class="app-header-right">${notificationsButton}<div class="app-user-meta"><span class="app-user-name" title="${safeUser.name}">${safeUser.name}</span><span class="app-user-email" title="${safeUser.email}">${safeUser.email}</span></div>${renderAvatarButton({ isAuthenticated, avatarVersion, avatarFallback })}${isAuthenticated ? `<button id="logout" class="app-logout">${APP_SHELL_ICONS.logout}<span>Logout</span></button>` : ""}${renderProfilePanel({ user: safeUser, isAuthenticated })}</div></header>`;
}
