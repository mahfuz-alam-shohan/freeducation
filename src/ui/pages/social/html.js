export function socialHtml(canInteract) {
  return `
    <section class="social-page" data-can-interact="${canInteract ? "1" : "0"}">
      <article class="social-card social-create">
        <h2>Community posts</h2>
        <p class="social-note">Share updates with text and one image.</p>
        ${canInteract
          ? `<form id="createPostForm" class="social-form">
              <textarea id="postText" maxlength="1200" rows="4" placeholder="Write something for the community"></textarea>
              <input id="postImage" type="file" accept="image/png,image/jpeg,image/webp" />
              <button type="submit">Post</button>
            </form>`
          : `<p class="social-readonly">Public visitors can view posts only. Login to post, comment, and react.</p>`}
      </article>

      <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>

      <section id="socialFeed" class="social-feed" aria-label="Community feed"></section>
    </section>
  `;
}
