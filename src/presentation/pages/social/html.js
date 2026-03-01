export function socialFeedHtml(canInteract, view = "feed", options = {}) {
  const scope = view === "mine" ? "mine" : "feed";
  const focusComposer = Boolean(options.focusComposer);

  return `
    <section class="social-page" data-can-interact="${canInteract ? "1" : "0"}" data-mode="feed" data-scope="${scope}" data-focus-composer="${focusComposer ? "1" : "0"}">
      <section class="social-main">
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section id="socialFeed" class="social-feed" aria-label="${scope === "mine" ? "My posts feed" : "Community feed"}"></section>
        <div id="socialFeedTail" class="social-feed-tail" aria-live="polite"></div>
        <div id="socialFeedSentinel" class="social-feed-sentinel" aria-hidden="true"></div>

        <section id="socialPostModal" class="social-post-modal" aria-hidden="true">
          <div class="social-post-modal-backdrop" data-action="close-modal"></div>
          <article class="social-post-modal-sheet" role="dialog" aria-modal="true" aria-label="Post comments">
            <header class="social-post-modal-head">
              <h3>Post details</h3>
              <button class="social-post-modal-close" type="button" data-action="close-modal" aria-label="Close post details">&times;</button>
            </header>
            <div id="socialModalContent" class="social-modal-content"></div>
          </article>
        </section>
      </section>
    </section>
  `;
}

export function socialCreateHtml(canInteract) {
  return socialFeedHtml(canInteract, "feed", { focusComposer: true });
}

export function socialSearchHtml(canInteract, query = "") {
  const safeQuery = String(query || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  return `
    <section class="social-page social-page-search" data-can-interact="${canInteract ? "1" : "0"}" data-mode="search" data-scope="feed" data-search-query="${safeQuery}" data-focus-composer="0">
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

export function socialPostHtml(canInteract, postId) {
  const safePostId = Number.isInteger(Number(postId)) ? Number(postId) : 0;

  return `
    <section class="social-page social-page-post" data-can-interact="${canInteract ? "1" : "0"}" data-mode="post" data-scope="feed" data-post-id="${safePostId}" data-focus-composer="0">
      <section class="social-main social-main-post">
        <a id="socialDetailBackFab" class="social-detail-back-fab" href="/social" aria-label="Back to feed">&larr;</a>
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
        <section id="socialPostFocus" class="social-post-focus" aria-live="polite" aria-label="Post details"></section>
      </section>
    </section>
  `;
}
