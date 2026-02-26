export function profileHtml(admin) {
  return `
    <section class="profile-page">
      <article class="profile-hero">
        <div id="coverPanel" class="profile-cover" aria-label="Cover photo">
          <img id="coverImage" class="profile-cover-image" alt="Cover" hidden />
          <button id="coverAction" class="profile-image-action" type="button" aria-label="Change cover photo" title="Change cover photo">📷</button>
        </div>
        <div class="profile-head">
          <div id="avatarPanel" class="profile-avatar-wrap" aria-label="Profile photo">
            <img id="avatarImage" class="profile-avatar-image" alt="Profile" hidden />
            <span id="avatarFallback" class="profile-avatar-fallback">${(admin?.name || "A").slice(0, 2).toUpperCase()}</span>
            <button id="avatarAction" class="profile-image-action profile-image-action-avatar" type="button" aria-label="Change profile photo" title="Change profile photo">📷</button>
          </div>
          <div class="profile-title">
            <h1>${admin?.name || "Administrator"}</h1>
            <p>${admin?.user_type || "Administrator"}</p>
          </div>
        </div>
      </article>

      <article class="profile-tabs-card">
        <div class="profile-tabs" role="tablist" aria-label="Profile tabs">
          <button id="tabAbout" class="profile-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="panelAbout">About me</button>
          <button id="tabSecurity" class="profile-tab" type="button" role="tab" aria-selected="false" aria-controls="panelSecurity">Security</button>
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

    <dialog id="imageUploadModal" class="profile-modal">
      <div class="profile-modal-card">
        <h3 id="imageModalTitle">Upload image</h3>
        <img id="imageModalPreview" class="profile-modal-preview" alt="Current image" hidden />
        <p id="imageModalEmpty">No image uploaded.</p>
        <label class="profile-upload-input">📤 Upload / change picture<input id="imageUploadInput" type="file" accept="image/png,image/jpeg,image/webp" /></label>
        <div id="uploadProgressWrap" class="profile-upload-progress" hidden>
          <p id="uploadProgressText">Preparing upload…</p>
          <progress id="uploadProgressBar" max="100" value="0"></progress>
        </div>
        <div class="profile-modal-actions">
          <button id="viewImageButton" type="button">View picture</button>
          <button id="closeImageModal" type="button">Close</button>
        </div>
      </div>
    </dialog>

    <dialog id="imageViewModal" class="profile-modal">
      <div class="profile-modal-card profile-modal-large">
        <img id="imageBigPreview" class="profile-big-preview" alt="Large preview" />
        <button id="closeViewModal" type="button">Close</button>
      </div>
    </dialog>
  `;
}
