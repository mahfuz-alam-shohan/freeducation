import { APP_SHELL_ICONS } from "../icons.js";

export function renderShellOverlay({ isAuthenticated = false } = {}) {
  const notificationsOverlay = isAuthenticated
    ? `<div id="appNotificationsOverlay" class="app-notifications-overlay" aria-hidden="true"></div>
      <aside id="appNotificationsPanel" class="app-notifications-panel" aria-label="Notifications" aria-hidden="true">
        <header class="app-notifications-head">
          <h2>Notifications</h2>
          <button id="appNotificationsClose" class="app-notifications-close" type="button" aria-label="Close notifications">${APP_SHELL_ICONS.close}</button>
        </header>
        <p id="appNotificationsLoading" class="app-notifications-loading" hidden>Loading notifications...</p>
        <div id="appNotificationsList" class="app-notifications-list" aria-live="polite"></div>
        <p id="appNotificationsEmpty" class="app-notifications-empty" hidden>No notifications yet.</p>
      </aside>`
    : "";

  return `<div id="appMenuOverlay" class="app-nav-overlay" aria-hidden="true"></div>${notificationsOverlay}`;
}

export function renderStatusToast() {
  return `<div id="appStatusToast" class="app-status-toast" role="status" aria-live="polite"></div>`;
}
