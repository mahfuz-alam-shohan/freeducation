import type { AdminSession } from "../../services/security/session";

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

export type ProfileMenuProps = {
  session: AdminSession | null;
  includeNotifications: boolean;
};

export const renderProfileMenu = ({ session, includeNotifications }: ProfileMenuProps): string => {
  const trigger = session
    ? `<span class="avatar" aria-label="Profile">${getInitials(session.name)}</span>`
    : `<span class="icon-button" aria-label="Profile">👤</span>`;

  const profileContent = session
    ? `
      <p><strong>${session.name}</strong></p>
      <p>${session.email}</p>
      <a href="/logout">Logout</a>
    `
    : `
      <p>Sign in or create account.</p>
      <button disabled>Sign in</button>
      <button disabled>Sign up</button>
    `;

  const notificationContent = includeNotifications
    ? `
      <hr />
      <p><strong>Notifications</strong></p>
      <p>No notifications yet.</p>
    `
    : "";

  return `
    <details class="profile-menu">
      <summary>${trigger}</summary>
      <div class="dropdown">
        ${profileContent}
        ${notificationContent}
      </div>
    </details>
  `;
};
