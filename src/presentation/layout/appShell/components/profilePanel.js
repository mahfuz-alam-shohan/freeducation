import { APP_SHELL_ICONS } from "../icons.js";

export function renderProfilePanel({ user, isAuthenticated }) {
  if (isAuthenticated) {
    return `<div id="appProfilePanel" class="app-profile-pop" role="dialog" aria-label="Profile menu"><p class="app-profile-name" title="${user.name}">${user.name}</p><p class="app-profile-email" title="${user.email}">${user.email}</p><div class="app-profile-divider"></div><button id="profileLogout" class="app-profile-logout">${APP_SHELL_ICONS.logout}<span>Logout</span></button></div>`;
  }

  return `<div id="appProfilePanel" class="app-profile-pop" role="dialog" aria-label="Login menu"><p class="app-profile-name">Welcome</p><p class="app-profile-help">You are currently logged out. Please sign in to access dashboard pages and your profile.</p><div class="app-profile-divider"></div><a class="app-profile-login" href="/login">Login</a></div>`;
}
