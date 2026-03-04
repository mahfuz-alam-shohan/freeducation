import { renderProfileHero } from "./components/hero.js";
import { renderProfileImageModal } from "./components/imageModal.js";
import { renderProfileLoader } from "./components/loader.js";
import { renderProfileTabsCard } from "./components/tabsCard.js";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function profileHtml(user, options = {}) {
  const readOnly = Boolean(options.readOnly);
  const profileUserId = Number.parseInt(String(options.profileUserId || user?.id || 0), 10) || 0;
  const showBackToFeed = Boolean(options.showBackToFeed);
  const backToFeedHref = String(options.backToFeedHref || "/social");
  const backToFeedLabel = String(options.backToFeedLabel || "Back to feed");
  const backToFeedMarkup = showBackToFeed
    ? `<nav class="profile-context-nav" aria-label="Profile context"><a class="profile-back-feed" href="${escapeHtml(backToFeedHref)}" aria-label="${escapeHtml(backToFeedLabel)}">&larr; ${escapeHtml(backToFeedLabel)}</a></nav>`
    : "";

  return `
    <section class="profile-page" data-read-only="${readOnly ? "1" : "0"}" data-profile-user-id="${profileUserId}">
      ${renderProfileLoader()}
      ${backToFeedMarkup}
      ${renderProfileHero(user, { readOnly })}
      ${renderProfileTabsCard()}
    </section>
    ${renderProfileImageModal()}
  `;
}
