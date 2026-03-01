import { renderProfileHero } from "./components/hero.js";
import { renderProfileImageModal } from "./components/imageModal.js";
import { renderProfileLoader } from "./components/loader.js";
import { renderProfileTabsCard } from "./components/tabsCard.js";

export function profileHtml(user, options = {}) {
  const readOnly = Boolean(options.readOnly);
  const profileUserId = Number.parseInt(String(options.profileUserId || user?.id || 0), 10) || 0;

  return `
    <section class="profile-page" data-read-only="${readOnly ? "1" : "0"}" data-profile-user-id="${profileUserId}">
      ${renderProfileLoader()}
      ${renderProfileHero(user, { readOnly })}
      ${renderProfileTabsCard()}
    </section>
    ${renderProfileImageModal()}
  `;
}
