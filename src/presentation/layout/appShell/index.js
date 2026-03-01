import { PRIMARY_NAV_SECTIONS } from "../../config/navigation.js";
import { globalFooterText } from "../footer.js";
import { renderDocument } from "../document.js";
import { SITE_LOGO_CSS } from "../siteLogo.js";
import { APP_SHELL_BASE_STYLE } from "./baseStyle.js";
import { APP_SHELL_SCRIPT } from "./clientScript.js";
import { initialsForName } from "./navigation.js";
import { renderAppHeader } from "./components/header.js";
import { renderShellOverlay, renderStatusToast } from "./components/overlays.js";
import { renderAppSidebar } from "./components/sidebar.js";

function guestFallbackAvatar() {
  return `<svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z"/><path d="M4 21c.35-3.6 3.4-6.1 8-6.1s7.65 2.5 8 6.1" /></svg>`;
}

export function renderAppShellLayout({
  title,
  activeMenu,
  user,
  content,
  rightSidebar = "",
  contentClass = "",
  script = "",
  footerText = globalFooterText(),
  homePath = "/",
  navItems = PRIMARY_NAV_SECTIONS,
  pageClass = "",
  pageStyles = "",
  apiBase = "",
  headerCenter = "",
}) {
  const currentUser = user || null;
  const isAuthenticated = Boolean(currentUser);
  const initials = initialsForName(currentUser?.name);
  const avatarVersion = String(currentUser?.avatar_key || "").trim();
  const avatarFallback = isAuthenticated ? initials : guestFallbackAvatar();
  const rightSidebarMarkup = String(rightSidebar || "");

  const body = `<div class="app-shell" data-api-base="${apiBase}">${renderAppHeader({ user: currentUser, homePath, avatarVersion, avatarFallback, isAuthenticated, headerCenter })}${renderShellOverlay({ isAuthenticated })}${renderAppSidebar({ navItems, activeMenu })}${rightSidebarMarkup}<main class="app-content ${contentClass}">${content}</main><footer class="app-footer">${footerText}</footer>${renderStatusToast()}</div>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${APP_SHELL_BASE_STYLE}
${SITE_LOGO_CSS}
${pageStyles}`,
    body,
    script: `${APP_SHELL_SCRIPT}
${script}`,
  });
}
