import { renderProfileAboutPanel } from "./aboutPanel.js";
import { renderProfilePostsPanel } from "./postsPanel.js";

function renderProfileSecurityPanel() {
  return `<section id="panelSecurity" class="profile-panel" role="tabpanel" aria-labelledby="tabSecurity" hidden><button id="openPasswordForm" class="profile-open-password" type="button">Change password</button><form id="passwordForm" class="profile-password-form" hidden><label>Current password<input type="password" name="currentPassword" required minlength="8" /></label><label>New password<input type="password" name="newPassword" required minlength="8" /></label><button type="submit">Update password</button></form><div class="profile-security-actions"><button id="profileLogoutButton" class="profile-logout-action" type="button">Logout</button><p class="profile-security-note">Logout is now managed from Settings.</p></div></section>`;
}

export function renderProfileTabsCard() {
  return `<article class="profile-tabs-card"><div class="profile-tabs" role="tablist" aria-label="Profile tabs"><button id="tabPosts" class="profile-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="panelPosts">Posts</button><button id="tabAbout" class="profile-tab" type="button" role="tab" aria-selected="false" aria-controls="panelAbout">About me</button><button id="tabSecurity" class="profile-tab" type="button" role="tab" aria-selected="false" aria-controls="panelSecurity">Settings</button><span id="profileTabIndicator" class="profile-tab-indicator" aria-hidden="true"></span></div>${renderProfilePostsPanel()}${renderProfileAboutPanel()}${renderProfileSecurityPanel()}<p id="profileMsg" class="profile-msg" aria-live="polite" hidden></p></article>`;
}
