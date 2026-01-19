import type { AdminSession } from "../../services/security/session";
import { renderBellIcon } from "./icons";

export type NotificationMenuProps = {
  session: AdminSession | null;
};

export const renderNotificationMenu = ({ session }: NotificationMenuProps): string => {
  const trigger = `<span class="icon-button" aria-label="Notifications">${renderBellIcon()}</span>`;
  const content = session
    ? "<p>No notifications yet.</p>"
    : '<p><a href="/login">Sign in</a> to view notifications.</p>';

  return `
    <details class="notification-menu">
      <summary>${trigger}</summary>
      <div class="dropdown">
        <p><strong>Notifications</strong></p>
        ${content}
      </div>
    </details>
  `;
};
