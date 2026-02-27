const PROFILE_ICONS = {
  camera: `<svg viewBox="0 0 24 24" class="profile-inline-icon" aria-hidden="true" focusable="false"><path d="M7.5 6.5h2.1l1-1.5h2.8l1 1.5h2.1A2.5 2.5 0 0 1 19 9v8a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17V9a2.5 2.5 0 0 1 2.5-2.5Zm4.5 3.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm0 1.7a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Z" fill="currentColor"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" class="profile-inline-icon" aria-hidden="true" focusable="false"><path d="M4 17.2V20h2.8l9.9-9.9-2.8-2.8L4 17.2Zm11.7-11.8 1.4-1.4a1.2 1.2 0 0 1 1.7 0l1 1a1.2 1.2 0 0 1 0 1.7l-1.4 1.4-2.7-2.7Z" fill="currentColor"/><path d="M3.5 20.5h4.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
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
          <div class="profile-loader-about-rows" aria-hidden="true">
            <div class="profile-loader-about-row">
              <div class="profile-loader-shimmer profile-loader-shimmer-label"></div>
              <div class="profile-loader-shimmer profile-loader-shimmer-value"></div>
            </div>
            <div class="profile-loader-about-row">
              <div class="profile-loader-shimmer profile-loader-shimmer-label"></div>
              <div class="profile-loader-shimmer profile-loader-shimmer-value"></div>
            </div>
            <div class="profile-loader-about-row">
              <div class="profile-loader-shimmer profile-loader-shimmer-label"></div>
              <div class="profile-loader-shimmer profile-loader-shimmer-value"></div>
            </div>
            <div class="profile-loader-about-row">
              <div class="profile-loader-shimmer profile-loader-shimmer-label"></div>
              <div class="profile-loader-shimmer profile-loader-shimmer-value"></div>
            </div>
            <div class="profile-loader-about-row">
              <div class="profile-loader-shimmer profile-loader-shimmer-label"></div>
              <div class="profile-loader-shimmer profile-loader-shimmer-value"></div>
            </div>
          </div>
          <div class="profile-loader-security" aria-hidden="true">
            <div class="profile-loader-shimmer profile-loader-shimmer-row profile-loader-shimmer-row-short"></div>
            <div class="profile-loader-shimmer profile-loader-shimmer-row"></div>
            <div class="profile-loader-shimmer profile-loader-shimmer-row"></div>
          </div>
        </div>
      </div>
      <article class="profile-hero">
        <div id="coverPanel" class="profile-cover" aria-label="Cover photo">
          <img id="coverImage" class="profile-cover-image" alt="Cover" hidden />
          <button id="coverAction" class="profile-image-action profile-image-action-cover" type="button" aria-label="Change cover photo" title="Change cover photo">${PROFILE_ICONS.camera}</button>
          <div id="coverUploadProgress" class="profile-media-progress" hidden>
            <p id="coverUploadText">Preparing upload...</p>
            <div class="profile-media-progress-track"><span id="coverUploadBar"></span></div>
          </div>
        </div>
        <div class="profile-head">
          <div id="avatarPanel" class="profile-avatar-wrap" aria-label="Profile photo">
            <img id="avatarImage" class="profile-avatar-image" alt="Profile" hidden />
            <span id="avatarFallback" class="profile-avatar-fallback">${(admin?.name || "A").slice(0, 2).toUpperCase()}</span>
            <button id="avatarAction" class="profile-image-action profile-image-action-avatar" type="button" aria-label="Change profile photo" title="Change profile photo">${PROFILE_ICONS.camera}</button>
            <div id="avatarUploadProgress" class="profile-media-progress profile-media-progress-avatar" hidden>
              <p id="avatarUploadText">Preparing upload...</p>
              <div class="profile-media-progress-track"><span id="avatarUploadBar"></span></div>
            </div>
          </div>
          <div class="profile-title">
            <h1 id="profileTitleName">${admin?.name || "Administrator"}</h1>
            <p>${admin?.user_type || "Administrator"}</p>
          </div>
        </div>
        <div id="imageActionMenu" class="profile-image-menu" role="menu" hidden>
          <button id="viewImageButton" class="profile-menu-btn" type="button" role="menuitem">View picture</button>
          <button id="changeImageButton" class="profile-menu-btn" type="button" role="menuitem">Upload picture</button>
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
          <div class="profile-row profile-row-editable" data-field="name">
            <span>Name</span>
            <div class="profile-inline-edit">
              <strong id="aboutName">-</strong>
              <button class="profile-edit-trigger" type="button" data-edit-trigger="name" aria-label="Edit name" title="Edit name">${PROFILE_ICONS.edit}</button>
              <form class="profile-edit-form profile-edit-form-compact" data-edit-form="name" hidden>
                <input type="text" name="value" minlength="2" maxlength="120" required />
                <button type="submit">Save</button>
                <button type="button" data-edit-cancel="name">Cancel</button>
              </form>
            </div>
          </div>
          <div class="profile-row"><span>Mail</span><strong id="aboutEmail">-</strong></div>
          <div class="profile-row profile-row-editable" data-field="date_of_birth">
            <span>Date of birth</span>
            <div class="profile-inline-edit">
              <strong id="aboutDob">-</strong>
              <button class="profile-edit-trigger" type="button" data-edit-trigger="date_of_birth" aria-label="Edit date of birth" title="Edit date of birth">${PROFILE_ICONS.edit}</button>
              <form class="profile-edit-form" data-edit-form="date_of_birth" hidden>
                <div class="profile-dob-inputs">
                  <input type="number" name="day" min="1" max="31" inputmode="numeric" placeholder="Day" required />
                  <select name="month" required aria-label="Birth month">
                    <option value="" selected disabled>Month</option>
                    <option value="01">Jan</option>
                    <option value="02">Feb</option>
                    <option value="03">Mar</option>
                    <option value="04">Apr</option>
                    <option value="05">May</option>
                    <option value="06">Jun</option>
                    <option value="07">Jul</option>
                    <option value="08">Aug</option>
                    <option value="09">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                  </select>
                  <input type="number" name="year" min="1900" max="9999" inputmode="numeric" placeholder="Year" required />
                </div>
                <button type="submit">Save</button>
                <button type="button" data-edit-cancel="date_of_birth">Cancel</button>
              </form>
            </div>
          </div>
          <div class="profile-row profile-row-editable" data-field="gender">
            <span>Gender</span>
            <div class="profile-inline-edit">
              <strong id="aboutGender">-</strong>
              <button class="profile-edit-trigger" type="button" data-edit-trigger="gender" aria-label="Edit gender" title="Edit gender">${PROFILE_ICONS.edit}</button>
              <form class="profile-edit-form profile-edit-form-compact" data-edit-form="gender" hidden>
                <select name="value" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <button type="submit">Save</button>
                <button type="button" data-edit-cancel="gender">Cancel</button>
              </form>
            </div>
          </div>
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
        <p id="profileMsg" class="profile-msg" aria-live="polite" hidden></p>
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
