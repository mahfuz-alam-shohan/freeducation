export function renderProfileSocialContextSidebar({ canInteract = false, profileUserId = 0 } = {}) {
  const id = Number.parseInt(String(profileUserId || 0), 10) || 0;
  const profileHref = id > 0 ? `/profile/${id}?from=social` : "/social";

  return `
    <aside id="socialRightSidebar" class="social-right-sidebar" aria-label="Social sidebar">
      <div class="social-right-head">
        <p class="social-right-title">Social menu</p>
      </div>

      <div class="social-menu-stack">
        <a class="social-menu-link" href="/social">Community</a>
        ${canInteract ? `<a class="social-menu-link" href="/social/my-posts">My posts</a>` : ""}
        <a class="social-menu-link active" href="${profileHref}">Profile view</a>
      </div>

      <p class="social-readonly">${canInteract ? "Use Social page to create new posts." : "Login to create and interact with posts."}</p>
    </aside>
  `;
}
