import type { AdminSession } from "../../services/security/session";
import { renderUserIcon } from "./icons";

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

export type ProfileMenuProps = {
  session: AdminSession | null;
};

export const renderProfileMenu = ({ session }: ProfileMenuProps): string => {
  const trigger = session
    ? `<span class="avatar" aria-label="Profile">${getInitials(session.name)}</span>`
    : `<span class="icon-button" aria-label="Profile">${renderUserIcon()}</span>`;

  const profileContent = session
    ? `
      <p><strong>${session.name}</strong></p>
      <p>${session.email}</p>
      <a class="button-link" href="/logout">Logout</a>
    `
    : `
      <p>Sign in to continue.</p>
      <a class="button-link button-link--primary" href="/login">Sign in</a>
      <a class="button-link" href="/signup">Sign up</a>
    `;

  const notificationContent = `
      <hr />
      <p><strong>Notifications</strong></p>
      <p>No notifications yet.</p>
    `;

  return `
    <details class="profile-menu">
      <summary>${trigger}</summary>
      <div class="dropdown">
        ${profileContent}
        <div class="profile-notifications">
          ${notificationContent}
        </div>
      </div>
    </details>
  `;
};
