function escapeAttr(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
const SOCIAL_CLOSE_ICON = `<svg class="app-icon social-close-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 6-12 12"></path><path d="M6 6l12 12"></path></svg>`;

function socialPageContextAttrs(options = {}) {
  const viewerId = Number.parseInt(String(options?.viewerId || 0), 10) || 0;
  const viewerProfilePath = String(options?.viewerProfilePath || "").trim();
  return ` data-viewer-id="${viewerId}" data-viewer-profile-path="${escapeAttr(viewerProfilePath)}"`;
}

export function socialFeedHtml(canInteract, view = "feed", options = {}) {
  const scope = view === "mine" ? "mine" : "feed";
  const focusComposer = Boolean(options.focusComposer);
  const contextAttrs = socialPageContextAttrs(options);

  return `
    <section class="social-page" data-can-interact="${canInteract ? "1" : "0"}" data-mode="feed" data-scope="${scope}" data-focus-composer="${focusComposer ? "1" : "0"}"${contextAttrs}>
      <section class="social-main">
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section id="socialFeed" class="social-feed" aria-label="${scope === "mine" ? "My posts feed" : "Community feed"}"></section>
        <div id="socialFeedTail" class="social-feed-tail" aria-live="polite"></div>
        <div id="socialFeedSentinel" class="social-feed-sentinel" aria-hidden="true"></div>

        <section id="socialMobileCommentsTray" class="social-mobile-comments-tray" aria-hidden="true">
          <div class="social-mobile-comments-backdrop" data-action="close-social-comments"></div>
          <article class="social-mobile-comments-sheet" role="dialog" aria-modal="true" aria-label="Post comments">
            <header class="social-mobile-comments-head">
              <div class="social-mobile-comments-head-copy">
                <h3 id="socialMobileCommentsTitle">Comments</h3>
                <p id="socialMobileCommentsMeta" class="social-mobile-comments-meta"></p>
              </div>
              <button class="social-mobile-comments-close" type="button" data-action="close-social-comments" aria-label="Close comments">${SOCIAL_CLOSE_ICON}</button>
            </header>
            <div id="socialMobileCommentsContent" class="social-mobile-comments-content"></div>
          </article>
        </section>
      </section>
    </section>
  `;
}

export function socialCreateHtml(canInteract, options = {}) {
  return socialFeedHtml(canInteract, "feed", { ...options, focusComposer: true });
}

export function socialSearchHtml(canInteract, query = "", options = {}) {
  const safeQuery = String(query || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  const contextAttrs = socialPageContextAttrs(options);

  return `
    <section class="social-page social-page-search" data-can-interact="${canInteract ? "1" : "0"}" data-mode="search" data-scope="feed" data-search-query="${safeQuery}" data-focus-composer="0"${contextAttrs}>
      <section class="social-main">
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section class="social-search-page-card" aria-label="Profile search results">
          <h2 id="socialSearchHeading" class="social-search-heading">Search results</h2>
          <div id="socialSearchResults" class="social-search-results" aria-live="polite"></div>
        </section>
      </section>
    </section>
  `;
}

export function socialPostHtml(canInteract, postId, options = {}) {
  const safePostId = Number.isInteger(Number(postId)) ? Number(postId) : 0;
  const contextAttrs = socialPageContextAttrs(options);

  return `
    <section class="social-page social-page-post" data-can-interact="${canInteract ? "1" : "0"}" data-mode="post" data-scope="feed" data-post-id="${safePostId}" data-focus-composer="0"${contextAttrs}>
      <section class="social-main social-main-post">
        <a id="socialDetailBackFab" class="social-detail-back-fab" href="/social" aria-label="Back to feed">&larr;</a>
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section id="socialPostFocus" class="social-post-focus" aria-live="polite" aria-label="Post details"></section>
      </section>
    </section>
  `;
}

export function socialMatesHtml(canInteract, options = {}) {
  const contextAttrs = socialPageContextAttrs(options);
  return `
    <section class="social-page social-page-mates" data-can-interact="${canInteract ? "1" : "0"}" data-mode="mates" data-scope="mates" data-focus-composer="0"${contextAttrs}>
      <section class="social-main">
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section class="social-mates-page-card" aria-label="My mates">
          <header class="social-mates-head">
            <h2 class="social-mates-title">My Mates</h2>
            <a class="social-mates-link-button" href="/social/mates/requests">Mate Requests</a>
          </header>
          <p id="socialMatesSummary" class="social-mates-summary"></p>
          <div id="socialMatesList" class="social-mates-list" aria-live="polite"></div>
        </section>
      </section>
    </section>
  `;
}

export function socialMateRequestsHtml(canInteract, options = {}) {
  const contextAttrs = socialPageContextAttrs(options);
  return `
    <section class="social-page social-page-mate-requests" data-can-interact="${canInteract ? "1" : "0"}" data-mode="mate-requests" data-scope="mate-requests" data-focus-composer="0"${contextAttrs}>
      <section class="social-main">
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section class="social-mates-page-card" aria-label="Mate requests">
          <header class="social-mates-head">
            <h2 class="social-mates-title">Mate Requests</h2>
            <a class="social-mates-link-button" href="/social/mates">My Mates</a>
          </header>
          <p id="socialMateRequestsSummary" class="social-mates-summary"></p>
          <section class="social-mate-requests-grid">
            <article class="social-mate-requests-col">
              <h3>Received</h3>
              <div id="socialMateIncomingList" class="social-mates-list" aria-live="polite"></div>
            </article>
            <article class="social-mate-requests-col">
              <h3>Sent</h3>
              <div id="socialMateOutgoingList" class="social-mates-list" aria-live="polite"></div>
            </article>
          </section>
        </section>
      </section>
    </section>
  `;
}
