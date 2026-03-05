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

const APP_SHELL_STATIC_PRO_STYLE = `
/* Professional mode: keep visuals clean and reduce hover noise while preserving phase motion. */
.app-shell *,.app-shell *::before,.app-shell *::after{
  box-shadow:none !important;
  text-shadow:none !important;
}
.app-shell::before,
.app-shell .app-header::after,
.app-shell .app-sidebar::before,
.app-shell .social-page::before,
.app-shell .social-page::after,
.app-shell .profile-cover::after,
.app-shell .profile-avatar-wrap::after{
  content:none !important;
  display:none !important;
}
.app-shell :is(.social-header-search-icon,.social-header-search-clear,.home-cover-quote cite){color:var(--text-muted) !important}
.app-shell .app-brand-signature .site-logo-wordmark{filter:none !important}
@media (hover:hover){
  .app-shell *:hover{transform:none !important}
  .app-shell .post-media-nav:hover{transform:translateY(-50%) !important}
  .app-shell :is(
    a,button,[role='button'],input[type='button'],input[type='submit'],input[type='reset'],summary,[data-action],
    .app-nav a,.social-menu-link,.post-action-button,.profile-edit-trigger,.profile-image-action
  ):hover{
    text-decoration:none !important;
  }
}
@keyframes app-first-header-in{
  from{opacity:0;transform:translate3d(0,-10px,0)}
  to{opacity:1;transform:translate3d(0,0,0)}
}
@keyframes app-first-sidebar-in{
  from{opacity:0;transform:translate3d(-14px,0,0)}
  to{opacity:1;transform:translate3d(0,0,0)}
}
@keyframes app-first-mobile-content-in{
  from{opacity:0;transform:translate3d(0,12px,0) scale(.995)}
  to{opacity:1;transform:translate3d(0,0,0) scale(1)}
}
body.app-first-load .app-shell .app-header{
  animation:app-first-header-in .28s var(--motion-smooth) both !important;
}
body.app-first-load .app-shell .app-sidebar{
  animation:app-first-sidebar-in .34s var(--motion-smooth) .04s both !important;
}
@media (max-width:899px){
  body.app-first-load .app-shell .app-content > *{
    animation:app-first-mobile-content-in .42s var(--motion-spring) .08s both !important;
  }
  body.app-first-load .app-shell .app-footer{
    animation:app-first-mobile-content-in .42s var(--motion-spring) .14s both !important;
  }
}
@media (prefers-reduced-motion:reduce){
  body.app-first-load .app-shell .app-content > *,
  body.app-first-load .app-shell .app-footer{
    animation:none !important;
    transform:none !important;
    opacity:1 !important;
  }
}
html.app-view-transitioning .app-shell .app-header,
html.app-view-transitioning .app-shell .app-content,
html.app-view-transitioning .app-shell .app-footer,
html.app-view-transitioning .app-shell .app-content > *{
  animation:none !important;
}
body.app-navigating .app-shell .app-header,
body.app-navigating .app-shell .app-content,
body.app-navigating .app-shell .app-footer,
body.app-navigating .app-shell .app-content > *{
  animation:none !important;
}
`;

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
  shellScope = "app",
}) {
  const currentUser = user || null;
  const isAuthenticated = Boolean(currentUser);
  const initials = initialsForName(currentUser?.name);
  const avatarVersion = String(currentUser?.avatar_key || "").trim();
  const avatarFallback = isAuthenticated ? initials : guestFallbackAvatar();
  const rightSidebarMarkup = String(rightSidebar || "");
  const resolvedShellScope = String(shellScope || "").trim().toLowerCase() === "public" ? "public" : "app";

  const body = `<div class="app-shell" data-api-base="${apiBase}" data-shell-scope="${resolvedShellScope}">${renderAppHeader({ user: currentUser, homePath, avatarVersion, avatarFallback, isAuthenticated, headerCenter })}${renderShellOverlay({ isAuthenticated })}${renderAppSidebar({ navItems, activeMenu })}${rightSidebarMarkup}<main class="app-content ${contentClass}">${content}</main><footer class="app-footer">${footerText}</footer>${renderStatusToast()}</div>`;

  return renderDocument({
    title,
    bodyClass: pageClass,
    pageStyles: `${APP_SHELL_BASE_STYLE}
${SITE_LOGO_CSS}
${pageStyles}
${APP_SHELL_STATIC_PRO_STYLE}`,
    body,
    script: `${APP_SHELL_SCRIPT}
${script}`,
  });
}
