const detailIcon = (path) => `<svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const BACK_ICON = detailIcon("<path d='m14.5 5.5-6 6 6 6'/><path d='M8.5 11.5H20'/>");
const LIKE_ICON = "<svg class='post-like-icon' viewBox='0 0 24 24' aria-hidden='true'><path d='M12 20.3C7.2 16.7 4 13.8 4 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 2.9c0 3.5-3.2 6.4-8 10z'></path></svg>";

export function renderSocialPostDetailSidebar({ canInteract }) {
  return `
    <aside id="socialRightSidebar" class="social-right-sidebar social-detail-sidebar" aria-label="Post interactions">
      <div class="social-right-head social-detail-right-head">
        <a class="social-detail-back" href="/social" aria-label="Back to feed">${BACK_ICON}<span>Back to feed</span></a>
        <button id="socialMenuClose" class="social-menu-close" type="button" data-action="close-social-menu" aria-label="Close social menu">&times;</button>
      </div>

      <section id="socialDetailPostMeta" class="social-detail-post-meta social-detail-desktop-only" aria-label="Post details"></section>

      <section class="social-detail-reaction social-detail-desktop-only" aria-label="Post reactions">
        <button id="socialDetailLikeButton" class="social-detail-like social-like post-action-button" type="button" aria-pressed="false"${canInteract ? "" : " disabled"}>${LIKE_ICON}<span id="socialDetailLikeLabel" class="post-like-label">Like</span></button>
        <p id="socialDetailMeta" class="social-detail-meta">0 likes 0 comments</p>
      </section>

      <section class="social-detail-comments-wrap social-detail-desktop-only" aria-label="Post comments">
        <h3 class="social-detail-comments-title">Comments</h3>
        <div id="socialDetailComments" class="social-detail-comments" aria-live="polite"></div>
        ${canInteract
          ? `<form id="socialDetailCommentForm" class="social-detail-comment-form" data-action="detail-comment">
              <input id="socialDetailCommentInput" type="text" maxlength="600" name="comment" placeholder="Write a comment">
              <button type="submit">Comment</button>
            </form>`
          : `<p class="social-readonly">Login required to comment or like.</p>`}
      </section>
    </aside>
  `;
}
