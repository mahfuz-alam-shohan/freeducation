import { appShell } from '../templates/shell.js';
import { imageUrlFromKey } from '../imageUrl.js';

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const iconCamera = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7.5 9.4 5h5.2L16 7.5H20a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2z"/><circle cx="12" cy="13.25" r="3.75"/></svg>`;
const iconUser = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 19c0-3 2.9-5.3 7.5-5.3s7.5 2.3 7.5 5.3"/></svg>`;

function profileHeader(user) {
  const initials = (user.name || user.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  const avatarUrl = imageUrlFromKey(user.imageKey);
  const actionText = user.imageKey ? 'Change avatar' : 'Upload picture';

  return `<section class="card profile-hero">
    <div class="profile-avatar-wrap">
      <div class="profile-avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="${h(user.name)} avatar" loading="lazy" />` : h(initials || 'U')}</div>
      <form method="post" action="/api/profile/avatar" enctype="multipart/form-data" class="profile-avatar-form">
        <label class="btn btn-ghost profile-upload-btn" for="avatar-upload"><span class="icon">${iconCamera}</span>${actionText}</label>
        <input id="avatar-upload" name="avatar" type="file" accept="image/png,image/jpeg,image/webp" class="profile-file-input" />
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

function profileDetails(user) {
  return `<section class="card profile-tabs-card">
    <div class="profile-readonly-row"><p class="muted">Email (read-only)</p><p class="profile-fixed-value">${h(user.email)}</p></div>
    <form method="post" action="/api/profile/name" class="profile-form-grid">
      <label for="profile-name"><span class="icon">${iconUser}</span> Full name</label>
      <input id="profile-name" class="input" name="name" maxlength="100" required value="${h(user.name)}" />
      <div class="profile-form-actions">
        <button class="btn btn-primary" type="submit">Save name</button>
      </div>
    </form>
  </section>`;
}

function profilePageScript() {
  return `<script>
(function () {
  const avatarInput = document.getElementById('avatar-upload');
  const avatarForm = avatarInput?.closest('form');
  if (!avatarInput || !avatarForm) return;
  avatarInput.addEventListener('change', () => {
    if (!avatarInput.files?.length) return;
    avatarForm.requestSubmit();
  });
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileDetails(user)}${profilePageScript()}`;
  return appShell('profile', user, 'Your profile', 'Manage your avatar and profile name.', content);
}
