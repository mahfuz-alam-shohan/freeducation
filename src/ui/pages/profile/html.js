const PROFILE_ICONS = {
  camera: `<svg viewBox="0 0 24 24" class="profile-inline-icon" aria-hidden="true" focusable="false"><path d="M7.5 6.5h2.1l1-1.5h2.8l1 1.5h2.1A2.5 2.5 0 0 1 19 9v8a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17V9a2.5 2.5 0 0 1 2.5-2.5Zm4.5 3.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm0 1.7a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Z" fill="currentColor"/></svg>`,
};

export function profileHtml(admin) {
  return `
    <section class="profile-page">
      <div id="profilePageLoader" class="profile-page-loader" role="status" aria-live="polite" aria-label="Loading profile" aria-busy="true">
        <div class="profile-loader-block profile-loader-block-hero">
          <div class="profile-loader-shimmer profile-loader-shimmer-cover"></div>
          <div class="profile-loader-head">
            <div class="profile-loader-shimmer profile-loader-shimmer-avatar"></div>
            <div class="profile-loader-lines">
              <div class="profile-loader-shimmer profile-loader-shimmer-line profile-loader-shimmer-line-title"></div>
              <div class="profile-loader-shimmer profile-loader-shimmer-line profile-loader-shimmer-line-subtitle"></div>
            </div>
          </div>
        </div>
        <div class="profile-loader-block profile-loader-block-tabs">
          <div class="profile-loader-tabs-row">
            <div class="profile-loader-shimmer profile-loader-shimmer-tab"></div>
            <div class="profile-loader-shimmer profile-loader-shimmer-tab"></div>
          </div>
          <div class="profile-loader-shimmer profile-loader-shimmer-row"></div>
          <div class="profile-loader-shimmer profile-loader-shimmer-row"></div>
          <div class="profile-loader-shimmer profile-loader-shimmer-row"></div>
          <div class="profile-loader-shimmer profile-loader-shimmer-row"></div>
        </div>
      </div>
      <article class="profile-hero">
        <div id="coverPanel" class="profile-cover" aria-label="Cover photo">
          <img id="coverImage" class="profile-cover-image" alt="Cover" hidden />
          <button id="coverAction" class="profile-image-action profile-image-action-cover" type="button" aria-label="Change cover photo" title="Change cover photo">${PROFILE_ICONS.camera}</button>
        </div>
        <div class="profile-head">
          <div id="avatarPanel" class="profile-avatar-wrap" aria-label="Profile photo">
            <img id="avatarImage" class="profile-avatar-image" alt="Profile" hidden />
            <span id="avatarFallback" class="profile-avatar-fallback">${(admin?.name || "A").slice(0, 2).toUpperCase()}</span>
            <button id="avatarAction" class="profile-image-action profile-image-action-avatar" type="button" aria-label="Change profile photo" title="Change profile photo">${PROFILE_ICONS.camera}</button>
          </div>
          <div class="profile-title">
            <h1>${admin?.name || "Administrator"}</h1>
            <p>${admin?.user_type || "Administrator"}</p>
          </div>
        </div>
        <div id="imageActionMenu" class="profile-image-menu" role="menu" hidden>
          <button id="viewImageButton" class="profile-menu-btn" type="button" role="menuitem">View picture</button>
          <button id="changeImageButton" class="profile-menu-btn" type="button" role="menuitem">Upload picture</button>
          <div id="uploadProgressWrap" class="profile-upload-progress" hidden>
            <p id="uploadProgressText">Preparing upload…</p>
            <progress id="uploadProgressBar" max="100" value="0"></progress>
          </div>
        </div>
        <input id="imageUploadInput" type="file" accept="image/png,image/jpeg,image/webp" hidden />
      </article>

      <article class="profile-tabs-card">
        <div class="profile-tabs" role="tablist" aria-label="Profile tabs">
          <button id="tabAbout" class="profile-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="panelAbout">About me</button>
          <button id="tabSecurity" class="profile-tab" type="button" role="tab" aria-selected="false" aria-controls="panelSecurity">Security</button>
          <span id="profileTabIndicator" class="profile-tab-indicator" aria-hidden="true"></span>
        </div>

        <section id="panelAbout" class="profile-panel is-active" role="tabpanel" aria-labelledby="tabAbout">
          <div class="profile-row"><span>Mail</span><strong id="aboutEmail">-</strong></div>
          <div class="profile-row"><span>Date of birth</span><strong id="aboutDob">-</strong></div>
          <div class="profile-row"><span>Gender</span><strong id="aboutGender">-</strong></div>
          <div class="profile-row"><span>Role</span><strong id="aboutRole">-</strong></div>
        </section>

        <section id="panelSecurity" class="profile-panel" role="tabpanel" aria-labelledby="tabSecurity" hidden>
          <button id="openPasswordForm" class="profile-open-password" type="button">Change password</button>
          <form id="passwordForm" class="profile-password-form" hidden>
            <label>Current password<input type="password" name="currentPassword" required minlength="8" /></label>
            <label>New password<input type="password" name="newPassword" required minlength="8" /></label>
            <button type="submit">Update password</button>
          </form>
        </section>
        <p id="profileMsg" class="profile-msg" aria-live="polite"></p>
      </article>
    </section>

    <dialog id="imageViewModal" class="profile-modal">
      <div class="profile-modal-card profile-modal-large">
        <img id="imageBigPreview" class="profile-big-preview" alt="Large preview" />
        <button id="closeViewModal" type="button">Close</button>
      </div>
    </dialog>
  `;
}
