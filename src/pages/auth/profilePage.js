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
const iconEdit = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16 9.9-9.9a2.2 2.2 0 0 1 3.1 0l.8.8a2.2 2.2 0 0 1 0 3.1L8 20H4z"/><path d="M14.5 5.5 18.5 9.5"/></svg>`;
const iconCalendar = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></svg>`;
const iconLock = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

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
    <div class="profile-hero-meta">
      <h3 class="card-title">${h(user.name)}</h3>
      <p class="muted">Role: ${h(user.role)}</p>
      <p class="muted">Avatar status: ${user.imageKey ? 'Uploaded' : 'Using initials'}</p>
    </div>
  </section>`;
}

function profileDetails(user) {
  const dobMin = '1900-01-01';
  const dobMax = new Date().toISOString().slice(0, 10);
  const dobValue = /^\d{4}-\d{2}-\d{2}$/.test(String(user.dateOfBirth || '')) ? String(user.dateOfBirth) : '';
  return `<section class="card profile-tabs-card">
    <div class="profile-readonly-row"><p class="muted">Email (read-only)</p><p class="profile-fixed-value">${h(user.email)}</p></div>

    <form method="post" action="/api/profile/name" class="profile-form-grid" data-profile-name-form>
      <div class="profile-label-row">
        <label for="profile-name">Full name</label>
        <button class="btn btn-ghost btn-icon-inline" type="button" data-profile-name-edit aria-label="Edit full name"><span class="icon">${iconEdit}</span>Edit</button>
      </div>
      <input id="profile-name" class="input" name="name" maxlength="100" required value="${h(user.name)}" disabled />
      <div class="profile-form-actions">
        <button class="btn btn-primary" type="submit" data-profile-name-save hidden>Save name</button>
      </div>
    </form>

    <form method="post" action="/api/profile/dob" class="profile-form-grid">
      <label for="profile-dob"><span class="icon">${iconCalendar}</span>Date of birth</label>
      <input id="profile-dob" class="input" name="dateOfBirth" type="date" min="${dobMin}" max="${dobMax}" pattern="\\d{4}-\\d{2}-\\d{2}" maxlength="10" value="${h(dobValue)}" />
      <div class="profile-form-actions"><button class="btn btn-primary" type="submit">Save date of birth</button></div>
    </form>

    <div class="profile-security-row">
      <div>
        <p class="profile-fixed-value">Password</p>
        <p class="muted">Use a strong password with at least 8 characters.</p>
      </div>
      <button class="btn btn-ghost" type="button" data-content-modal-open="profile-password-modal"><span class="icon">${iconLock}</span>Change password</button>
    </div>

    <dialog class="content-modal" data-content-modal="profile-password-modal">
      <div class="modal content-modal-inner">
        <div class="content-modal-head">
          <h3 class="card-title">Change password</h3>
          <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
        </div>
        <form method="post" action="/api/profile/password" class="profile-form-grid">
          <label for="profile-current-password">Current password</label>
          <input id="profile-current-password" class="input" type="password" name="currentPassword" minlength="8" maxlength="120" required autocomplete="current-password" />
          <label for="profile-new-password">New password</label>
          <input id="profile-new-password" class="input" type="password" name="newPassword" minlength="8" maxlength="120" required autocomplete="new-password" />
          <div class="profile-form-actions"><button class="btn btn-primary" type="submit">Update password</button></div>
        </form>
      </div>
    </dialog>
  </section>`;
}

function profilePageScript() {
  return `<script>
(function () {
  const avatarInput = document.getElementById('avatar-upload');
  const avatarForm = avatarInput?.closest('form');
  if (avatarInput && avatarForm) {
    avatarInput.addEventListener('change', () => {
      if (!avatarInput.files?.length) return;
      avatarForm.requestSubmit();
    });
  }

  const editNameButton = document.querySelector('[data-profile-name-edit]');
  const saveNameButton = document.querySelector('[data-profile-name-save]');
  const nameInput = document.getElementById('profile-name');
  if (editNameButton && saveNameButton && nameInput) {
    editNameButton.addEventListener('click', () => {
      nameInput.disabled = false;
      nameInput.focus();
      nameInput.select();
      saveNameButton.hidden = false;
      editNameButton.hidden = true;
    });
  }

  const dobInput = document.getElementById('profile-dob');
  if (dobInput) {
    const minDate = dobInput.min;
    const maxDate = dobInput.max;
    const clampDobValue = () => {
      const rawValue = String(dobInput.value || '').trim();
      if (!rawValue) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
        dobInput.value = '';
        return;
      }
      if (minDate && rawValue < minDate) dobInput.value = minDate;
      if (maxDate && rawValue > maxDate) dobInput.value = maxDate;
    };

    dobInput.addEventListener('input', clampDobValue);
    dobInput.addEventListener('change', clampDobValue);
  }
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileDetails(user)}${profilePageScript()}`;
  return appShell('profile', user, 'Your profile', 'Manage your profile details, password, and avatar.', content);
}
