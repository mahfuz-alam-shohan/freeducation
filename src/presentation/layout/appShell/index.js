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
/* Global static/professional mode: black-white palette behavior, no glow, no motion noise. */
.app-shell *,.app-shell *::before,.app-shell *::after{
  animation:none !important;
  transition:none !important;
  box-shadow:none !important;
  text-shadow:none !important;
  filter:none !important;
  backdrop-filter:none !important;
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
.app-shell .app-brand-signature .site-logo-svg{filter:none !important}
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
@keyframes app-mobile-header-enter{
  from{opacity:0;transform:translate3d(0,-10px,0)}
  to{opacity:1;transform:translate3d(0,0,0)}
}
@keyframes app-mobile-content-enter{
  from{opacity:0;transform:translate3d(0,12px,0)}
  to{opacity:1;transform:translate3d(0,0,0)}
}
@keyframes app-mobile-footer-enter{
  from{opacity:0;transform:translate3d(0,8px,0)}
  to{opacity:1;transform:translate3d(0,0,0)}
}
@media (max-width:899px) and (prefers-reduced-motion:no-preference){
  .app-shell .app-header{
    animation:app-mobile-header-enter .28s ease-out both !important;
  }
  .app-shell .app-content{
    animation:app-mobile-content-enter .36s cubic-bezier(.2,.7,.2,1) .06s both !important;
  }
  .app-shell .app-footer{
    animation:app-mobile-footer-enter .3s ease-out .1s both !important;
  }
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
${pageStyles}
${APP_SHELL_STATIC_PRO_STYLE}`,
    body,
    script: `${APP_SHELL_SCRIPT}
${script}`,
  });
}
