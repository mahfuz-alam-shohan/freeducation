export function socialFeedHtml(canInteract) {
  return `
    <section class="social-page" data-can-interact="${canInteract ? "1" : "0"}" data-mode="feed">
      <article class="social-card social-create-cta">
        <h2>Community posts</h2>
        <p class="social-note">Read updates from the community.</p>
        ${canInteract
          ? `<a class="social-create-button" href="/social/create">Create post</a>`
          : `<p class="social-readonly">Public visitors can view posts only. Login to create posts, comment, and react.</p>`}
      </article>

      <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>

      <section id="socialFeed" class="social-feed" aria-label="Community feed"></section>
    </section>
  `;
}

export function socialCreateHtml(canInteract) {
  if (!canInteract) {
    return `
      <section class="social-page" data-can-interact="0" data-mode="create">
        <article class="social-card">
          <h2>Create post</h2>
          <p class="social-readonly">Login required to create a post.</p>
          <a class="social-create-button" href="/social">Back to community feed</a>
        </article>
      </section>
    `;
  }

  return `
    <section class="social-page" data-can-interact="1" data-mode="create">
      <article class="social-card social-create-page">
        <div class="social-create-topbar">
          <h2>Create post</h2>
          <a class="social-back-link" href="/social">Back</a>
        </div>
        <form id="createPostForm" class="social-form">
          <label class="social-label" for="postImage">Image (optional)</label>
          <input id="postImage" type="file" accept="image/png,image/jpeg,image/webp" />
          <div id="imagePreviewWrap" class="image-preview-wrap" hidden>
            <img id="imagePreview" class="image-preview" alt="Selected post image preview" />
            <button id="clearImageButton" type="button" class="clear-image-button" aria-label="Remove selected image">×</button>
          </div>

          <label class="social-label" for="postText">Text</label>
          <textarea id="postText" maxlength="1200" rows="7" placeholder="Write something for the community"></textarea>

          <div id="uploadProgressWrap" class="upload-progress-wrap" hidden>
            <div class="upload-progress-head">
              <span>Posting...</span>
              <span id="uploadProgressValue">0%</span>
            </div>
            <progress id="uploadProgress" max="100" value="0"></progress>
          </div>

          <button id="submitPostButton" type="submit">Post</button>
        </form>
        <div id="socialStatus" class="social-status" role="status" aria-live="polite"></div>
      </article>
    </section>
  `;
}
