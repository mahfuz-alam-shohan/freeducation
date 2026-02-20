import { appShell } from '../templates/shell.js';

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const iconCamera = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7.5 9.4 5h5.2L16 7.5H20a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2z"/><circle cx="12" cy="13.25" r="3.75"/></svg>`;
const iconUser = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 19c0-3 2.9-5.3 7.5-5.3s7.5 2.3 7.5 5.3"/></svg>`;
const iconLock = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14.3v2.7"/></svg>`;
const iconMail = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`;

function profileHeader(user) {
  const initials = (user.name || user.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return `<section class="card profile-hero">
    <div class="profile-avatar-wrap">
      <div class="profile-avatar">${h(initials || 'U')}</div>
      <form method="post" action="/api/profile/avatar" enctype="multipart/form-data" class="profile-avatar-form">
        <label class="btn btn-ghost profile-upload-btn" for="avatar-upload"><span class="icon">${iconCamera}</span>Change Avatar</label>
        <input id="avatar-upload" name="avatar" type="file" accept="image/png,image/jpeg,image/webp" class="profile-file-input" />
        <button class="btn btn-primary" type="submit">Upload</button>
      </form>
    </div>
    <div>
      <h3 class="card-title">${h(user.name)}</h3>
      <p class="muted">Role: ${h(user.role)}</p>
      <p class="muted">Avatar status: ${user.imageKey ? "Uploaded" : "Using initials"}</p>
      <p class="muted">Keep profile details simple, clear, and ready for daily teaching workflow.</p>
    </div>
  </section>`;
}

function profileTabs(user) {
  return `<section class="card profile-tabs-card">
    <div class="tabs profile-tabs">
      <button class="tab-btn active" type="button" data-profile-tab="identity">Identity</button>
      <button class="tab-btn" type="button" data-profile-tab="security">Security</button>
    </div>

    <div class="profile-tab-panel" data-profile-panel="identity">
      <div class="profile-readonly-row"><span class="icon">${iconMail}</span><div><p class="muted">Email (read-only)</p><p class="profile-fixed-value">${h(user.email)}</p></div></div>
      <form method="post" action="/api/profile/name" class="profile-form-grid">
        <label for="profile-name"><span class="icon">${iconUser}</span> Full name</label>
        <input id="profile-name" class="input" name="name" maxlength="100" required value="${h(user.name)}" />
        <div class="profile-form-actions">
          <button class="btn btn-primary" type="submit">Save name</button>
        </div>
      </form>
    </div>

    <div class="profile-tab-panel" data-profile-panel="security" hidden>
      <form method="post" action="/api/profile/password" class="profile-form-grid">
        <label for="current-password"><span class="icon">${iconLock}</span> Current password</label>
        <input id="current-password" class="input" type="password" name="currentPassword" minlength="8" maxlength="120" required />

        <label for="new-password"><span class="icon">${iconLock}</span> New password</label>
        <input id="new-password" class="input" type="password" name="newPassword" minlength="8" maxlength="120" required />

        <label for="confirm-password"><span class="icon">${iconLock}</span> Confirm new password</label>
        <input id="confirm-password" class="input" type="password" name="confirmPassword" minlength="8" maxlength="120" required />

        <div class="profile-form-actions">
          <button class="btn btn-primary" type="submit">Update password</button>
        </div>
      </form>
    </div>
  </section>`;
}

function profileTabsScript() {
  return `<script>
(function () {
  const buttons = Array.from(document.querySelectorAll('[data-profile-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-profile-panel]'));
  function activate(tabName) {
    buttons.forEach((button) => button.classList.toggle('active', button.dataset.profileTab === tabName));
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.profilePanel !== tabName;
    });
  }
  buttons.forEach((button) => {
    button.addEventListener('click', () => activate(button.dataset.profileTab));
  });
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileTabs(user)}${profileTabsScript()}`;
  return appShell('profile', user, 'Your profile', 'Manage avatar, name, and password securely.', content);
}
