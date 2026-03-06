import { renderShellNav } from "../../../layout/appShell/navigation.js";

const socialIcon = (path) => `<svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const SOCIAL_MENU = {
  myPosts: socialIcon("<path d='M7 4h10a2 2 0 0 1 2 2v12l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z'/><path d='M9 8h6M9 11h6'/>"),
  myMates: socialIcon("<path d='M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'/><path d='M16 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/><path d='M3.5 20a4.5 4.5 0 0 1 9 0'/><path d='M12.5 20a3.8 3.8 0 0 1 7.5 0'/>"),
};
const SOCIAL_COMPOSER_ICON = socialIcon("<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><path d='M17 8l-5 5-5-5'/><path d='M12 13V3'/>");
const SOCIAL_IMAGE_ICON = socialIcon("<rect x='6.5' y='3.5' width='11' height='17' rx='2.4'/><circle cx='12' cy='8.4' r='1.2'/><path d='m7.9 16.8 2.7-3a1.2 1.2 0 0 1 1.8 0l1.8 2 2.1-2.2'/>");
const SOCIAL_CLOSE_ICON = socialIcon("<path d='m18 6-12 12'/><path d='M6 6l12 12'/>");

function normalizeSections(navSections = []) {
  if (!Array.isArray(navSections)) return [];
  const first = navSections[0] || {};
  if (Array.isArray(first?.items)) return navSections;
  return [{ title: "", items: navSections }];
}

export function renderSocialRightSidebar({ canInteract, scope = "feed", navSections = [] }) {
  const mineActive = scope === "mine";
  const matesActive = scope === "mates";
  const mateRequestsActive = scope === "mate-requests";
  const mobileSections = normalizeSections(navSections);

  return `
    <aside id="socialRightSidebar" class="social-right-sidebar" aria-label="Social sidebar">
      <div class="social-right-head">
        <p class="social-right-title">Social menu</p>
        <button id="socialMenuClose" class="social-menu-close" type="button" data-action="close-social-menu" aria-label="Close social menu">${SOCIAL_CLOSE_ICON}</button>
      </div>
      <div id="socialSidebarDefault" class="social-right-default">
        ${canInteract
          ? `<form id="createPostForm" class="social-compose-menu">
              <div class="social-compose-head">${SOCIAL_COMPOSER_ICON}<span>Create post</span></div>
              <div class="social-compose-row">
                <textarea id="postText" class="social-compose-input" maxlength="1200" rows="1" placeholder="Write something"></textarea>
                <div class="social-compose-actions">
                  <button id="openPostImagePicker" class="social-image-picker-trigger" type="button" aria-label="Add image" title="Add image">${SOCIAL_IMAGE_ICON}</button>
                  <button id="submitPostButton" class="social-compose-submit" type="submit">Post</button>
                </div>
              </div>
              <div class="social-compose-extra">
                <input id="postImage" type="file" accept="image/*" multiple hidden />
                <div id="imagePreviewWrap" class="image-preview-wrap" hidden>
                  <div id="imagePreviewList" class="image-preview-list" aria-live="polite"></div>
                </div>
                <div id="uploadProgressWrap" class="upload-progress-wrap" hidden>
                  <div class="upload-progress-head">
                    <span>Posting...</span>
                    <span id="uploadProgressValue">0%</span>
                  </div>
                  <progress id="uploadProgress" max="100" value="0"></progress>
                </div>
              </div>
            </form>`
          : `<p class="social-readonly">Login required to create posts.</p>`}

        <div class="social-menu-stack" aria-label="Social tools">
          <a class="social-menu-link ${mineActive ? "active" : ""}" href="/social/my-posts">${SOCIAL_MENU.myPosts}<span>My posts</span></a>
          <a class="social-menu-link ${matesActive || mateRequestsActive ? "active" : ""}" href="/social/mates">${SOCIAL_MENU.myMates}<span>My mates</span></a>
        </div>

        <section class="social-mobile-pages" aria-label="Main pages">
          <p class="social-menu-caption">Pages</p>
          ${renderShellNav(mobileSections, "social")}
        </section>
      </div>

      <section id="socialCommentsPanel" class="social-comments-panel" aria-label="Post comments panel" aria-hidden="true">
        <button id="socialCommentsClose" class="social-comments-panel-close social-comments-panel-close-float" type="button" data-action="close-social-comments" aria-label="Close comments panel">${SOCIAL_CLOSE_ICON}</button>
        <header class="social-comments-panel-head">
          <h3 id="socialCommentsPanelTitle" class="social-comments-panel-title">Comments</h3>
          <p id="socialCommentsPanelMeta" class="social-comments-panel-meta"></p>
        </header>
        <div id="socialCommentsContent" class="social-comments-content" aria-live="polite"></div>
      </section>
    </aside>
  `;
}
