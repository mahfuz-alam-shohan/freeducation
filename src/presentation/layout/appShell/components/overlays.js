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

  const commandPalette = `<section id="appCommandPalette" class="app-command-palette" aria-hidden="true" hidden><div class="app-command-surface"><header class="app-command-head"><h2>Command Palette</h2><button id="appCommandClose" class="app-command-close" type="button" aria-label="Close command palette">${APP_SHELL_ICONS.close}</button></header><div class="app-command-input-wrap"><input id="appCommandInput" type="text" autocomplete="off" spellcheck="false" placeholder="Search pages or run actions..." aria-label="Command palette search" /></div><div id="appCommandList" class="app-command-list" role="listbox" aria-label="Command results"></div><p class="app-command-hint"><kbd>Ctrl</kbd>+<kbd>K</kbd> to open, <kbd>Esc</kbd> to close</p></div></section>`;
  return `<div id="appMenuOverlay" class="app-nav-overlay" aria-hidden="true"></div>${notificationsOverlay}${commandPalette}`;
}

export function renderStatusToast() {
  return `<div id="appStatusToast" class="app-status-toast" role="status" aria-live="polite"></div>`;
}

export function renderDesktopStatusBar({ footerText = "" } = {}) {
  return `<section id="appDesktopStatus" class="app-desktop-status" aria-live="polite"><div class="app-desktop-status-left">${footerText}</div><p id="appDesktopStatusMessage" class="app-desktop-status-message">Ready</p><time id="appDesktopStatusTime" class="app-desktop-status-time" datetime=""></time></section>`;
}
