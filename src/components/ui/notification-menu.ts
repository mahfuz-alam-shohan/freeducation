import type { AdminSession } from "../../services/security/session";

export type NotificationMenuProps = {
  session: AdminSession | null;
};

export const renderNotificationMenu = ({ session }: NotificationMenuProps): string => {
  const trigger = `<span class="icon-button" aria-label="Notifications">🔔</span>`;
  const content = session
    ? "<p>No notifications yet.</p>"
    : "<p>Sign in to view notifications.</p>";

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
