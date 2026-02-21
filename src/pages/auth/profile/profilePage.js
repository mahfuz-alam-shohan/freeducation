import { appShell } from '../../templates/shell.js';
import { profileStyles } from './profileStyles.js';
import { imageUrlFromKey } from '../../imageUrl.js';

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const iconCamera = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5a2 2 0 0 1 2-2h2.05c.46 0 .9-.22 1.18-.6l.8-1.09A2 2 0 0 1 11.14 4h1.72a2 2 0 0 1 1.61.81l.8 1.09c.28.38.72.6 1.18.6h2.05a2 2 0 0 1 2 2v8.75a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.75"/><path d="M17.35 10.25h.01"/></svg>`;
const iconEdit = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h5.2a2 2 0 0 0 1.42-.59L20 10.03a1.9 1.9 0 0 0 0-2.69l-3.32-3.32a1.9 1.9 0 0 0-2.69 0L3.59 14.42A2 2 0 0 0 3 15.84z"/><path d="m12.6 5.4 6 6"/></svg>`;

function initialsForUser(user) {
  return (user.name || user.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function formatDate(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate || ''))) return 'Not set';
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return 'Not set';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatJoined(isoDateTime) {
  const date = new Date(String(isoDateTime || ''));
  if (!Number.isFinite(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function photoMenu(type, hasImage) {
  const target = type === 'cover' ? 'Cover image' : 'Profile picture';
  const fileId = `${type}-upload`;
  return `<div class="profile-photo-actions" data-profile-photo-actions="${type}">
    <button type="button" class="profile-photo-action" data-profile-view="${type}" ${hasImage ? '' : 'disabled'}>See ${target}</button>
    <button type="button" class="profile-photo-action" data-profile-upload-trigger="${fileId}">${hasImage ? `Change ${target}` : `Upload ${target}`}</button>
  </div>`;
}

function profileHeader(user) {
  const initials = initialsForUser(user);
  const avatarUrl = imageUrlFromKey(user.imageKey);
  const coverUrl = imageUrlFromKey(user.coverImageKey);

  return `<section class="profile-header-flat">
    <div class="profile-cover-shell">
      <div class="profile-cover-media" data-profile-cover-media>${coverUrl ? `<img src="${coverUrl}" alt="${h(user.name)} cover image" loading="lazy" decoding="async" />` : '<div class="profile-cover-placeholder">Upload cover image</div>'}</div>
      <div class="profile-photo-control profile-cover-control">
        <button class="btn btn-secondary profile-photo-icon-btn" type="button" data-profile-photo-menu-toggle="cover" aria-expanded="false" aria-haspopup="true"><span class="icon">${iconCamera}</span></button>
        ${photoMenu('cover', Boolean(coverUrl))}
        <form method="post" action="/api/profile/cover" enctype="multipart/form-data" data-profile-upload-form="cover">
          <input id="cover-upload" name="cover" type="file" accept="image/png,image/jpeg,image/webp" class="profile-file-input" />
        </form>
      </div>
      <div class="profile-avatar-row">
        <div class="profile-avatar-shell" data-profile-avatar>${avatarUrl ? `<img src="${avatarUrl}" alt="${h(user.name)} avatar" loading="lazy" decoding="async" />` : h(initials || 'U')}</div>
        <div class="profile-photo-control profile-avatar-control">
          <button class="btn btn-secondary profile-photo-icon-btn" type="button" data-profile-photo-menu-toggle="avatar" aria-expanded="false" aria-haspopup="true"><span class="icon">${iconCamera}</span></button>
          ${photoMenu('avatar', Boolean(avatarUrl))}
          <form method="post" action="/api/profile/avatar" enctype="multipart/form-data" data-profile-upload-form="avatar">
            <input id="avatar-upload" name="avatar" type="file" accept="image/png,image/jpeg,image/webp" class="profile-file-input" />
          </form>
        </div>
      </div>
    </div>
    <div class="profile-name-row"><h2 data-profile-name-title>${h(user.name)}</h2></div>
    <p class="muted profile-upload-status" data-profile-upload-status aria-live="polite"></p>
  </section>`;
}

function profileMain(user) {
  const dobValue = /^\d{4}-\d{2}-\d{2}$/.test(String(user.dateOfBirth || '')) ? String(user.dateOfBirth) : '';

  return `<section class="profile-body-flat">
    <nav class="profile-tabs" aria-label="Profile sections" role="tablist">
      <button type="button" class="profile-tab is-active" role="tab" aria-selected="true" aria-controls="profile-about-panel" id="profile-about-tab" data-profile-tab="about">About Me</button>
      <button type="button" class="profile-tab" role="tab" aria-selected="false" aria-controls="profile-security-panel" id="profile-security-tab" data-profile-tab="security">Security</button>
    </nav>

    <div class="profile-tab-panel" id="profile-about-panel" role="tabpanel" aria-labelledby="profile-about-tab" data-profile-panel="about">
      <div class="profile-bio" data-profile-about-view>
        <div class="profile-section-actions">
          <button type="button" class="profile-icon-btn" data-profile-about-edit-toggle aria-label="Edit about me"><span class="icon">${iconEdit}</span></button>
        </div>

        <div class="profile-readonly-row" data-profile-inline-field="name">
          <p class="profile-bio-label">Name</p>
          <p class="profile-fixed-value" data-profile-name-value>${h(user.name)}</p>
          <label for="profile-name" class="sr-only">Name</label>
          <input id="profile-name" class="input profile-inline-input" name="name" maxlength="100" required value="${h(user.name)}" autocomplete="name" hidden />
        </div>
        <div class="profile-readonly-row"><p class="profile-bio-label">Email</p><p class="profile-fixed-value">${h(user.email)}</p></div>
        <div class="profile-readonly-row"><p class="profile-bio-label">Role</p><p class="profile-fixed-value">${h(user.role || 'user')}</p></div>
        <div class="profile-readonly-row" data-profile-inline-field="dob">
          <p class="profile-bio-label">Date of birth</p>
          <p class="profile-fixed-value" data-profile-dob-text>${h(formatDate(user.dateOfBirth))}</p>
          <label for="profile-dob" class="sr-only">Date of birth</label>
          <input id="profile-dob" class="input profile-inline-input" type="date" name="dateOfBirth" value="${h(dobValue)}" max="${new Date().toISOString().slice(0, 10)}" hidden />
        </div>
        <div class="profile-readonly-row"><p class="profile-bio-label">Joined</p><p class="profile-fixed-value">${h(formatJoined(user.createdAt))}</p></div>
        <p class="muted profile-autosave-status" data-profile-status="about" aria-live="polite"></p>
      </div>
    </div>

    <div class="profile-tab-panel" id="profile-security-panel" role="tabpanel" aria-labelledby="profile-security-tab" data-profile-panel="security" hidden>
      <form method="post" action="/api/profile/password" class="profile-form-grid">
        <label for="profile-current-password">Current password</label>
        <input id="profile-current-password" class="input" type="password" name="currentPassword" minlength="8" maxlength="120" required autocomplete="current-password" />
        <label for="profile-new-password">New password</label>
        <input id="profile-new-password" class="input" type="password" name="newPassword" minlength="8" maxlength="120" required autocomplete="new-password" />
        <div class="profile-form-actions"><button class="btn btn-primary" type="submit">Update password</button></div>
      </form>
    </div>

    <dialog class="content-modal" data-profile-photo-modal>
      <div class="modal content-modal-inner profile-photo-modal-card">
        <div class="content-modal-head"><h3 class="card-title" data-profile-photo-modal-title>Image</h3><button type="button" class="btn btn-secondary" data-profile-photo-modal-close>Close</button></div>
        <div class="profile-photo-modal-image" data-profile-photo-modal-image></div>
      </div>
    </dialog>
  </section>`;
}

function profilePageScript() {
  return `<script>
(function () {
  const statusEl = document.querySelector('[data-profile-upload-status]');
  const setStatus = (message, tone) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.tone = tone || 'idle';
  };

  const setFieldStatus = (key, message, tone) => {
    const element = document.querySelector('[data-profile-status="' + key + '"]');
    if (!element) return;
    element.textContent = message;
    element.dataset.tone = tone || 'idle';
  };

  const submitForm = async (form, options) => {
    const response = await fetch(form.action, {
      method: (form.method || 'POST').toUpperCase(),
      body: new FormData(form),
      credentials: 'same-origin',
      redirect: 'follow',
      headers: options?.headers || undefined,
    }).catch(() => null);
    if (!response || !response.ok) return { ok: false, data: null };
    if (!options?.expectJson) return { ok: true, data: null };
    const data = await response.json().catch(() => null);
    return { ok: true, data };
  };

  const closeMenus = () => {
    document.querySelectorAll('.profile-photo-control.menu-open').forEach((item) => item.classList.remove('menu-open'));
    document.querySelectorAll('[data-profile-photo-menu-toggle]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  };

  document.querySelectorAll('[data-profile-photo-menu-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const control = button.closest('.profile-photo-control');
      const isOpen = control?.classList.contains('menu-open');
      closeMenus();
      if (!control || isOpen) return;
      control.classList.add('menu-open');
      button.setAttribute('aria-expanded', 'true');
    });
  });
  document.addEventListener('click', closeMenus);

  const viewImage = (type) => {
    const modal = document.querySelector('[data-profile-photo-modal]');
    const title = document.querySelector('[data-profile-photo-modal-title]');
    const holder = document.querySelector('[data-profile-photo-modal-image]');
    const source = type === 'cover' ? document.querySelector('[data-profile-cover-media] img') : document.querySelector('[data-profile-avatar] img');
    if (!modal || !title || !holder || !source) return;
    title.textContent = type === 'cover' ? 'Cover image' : 'Profile picture';
    holder.innerHTML = '<img src="' + source.src + '" alt="Preview" loading="lazy" decoding="async" />';
    modal.showModal();
  };

  document.querySelectorAll('[data-profile-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-profile-view');
      closeMenus();
      viewImage(type);
    });
  });

  document.querySelectorAll('[data-profile-photo-modal-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });

  document.querySelectorAll('[data-profile-upload-trigger]').forEach((button) => {
    button.addEventListener('click', () => {
      closeMenus();
      const input = document.getElementById(button.getAttribute('data-profile-upload-trigger'));
      if (input) input.click();
    });
  });

  const updateImageDom = (type, imageUrl) => {
    const withVersion = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
    if (type === 'avatar') {
      const wrap = document.querySelector('[data-profile-avatar]');
      if (!wrap) return;
      const img = wrap.querySelector('img') || document.createElement('img');
      img.src = withVersion;
      img.alt = 'Profile avatar';
      img.loading = 'lazy';
      img.decoding = 'async';
      if (!wrap.querySelector('img')) {
        wrap.textContent = '';
        wrap.appendChild(img);
      }
      return;
    }
    const cover = document.querySelector('[data-profile-cover-media]');
    if (!cover) return;
    const img = cover.querySelector('img') || document.createElement('img');
    img.src = withVersion;
    img.alt = 'Profile cover image';
    img.loading = 'lazy';
    img.decoding = 'async';
    if (!cover.querySelector('img')) cover.innerHTML = '';
    if (!cover.contains(img)) cover.appendChild(img);
  };

  document.querySelectorAll('[data-profile-upload-form]').forEach((form) => {
    const type = form.getAttribute('data-profile-upload-form');
    const input = form.querySelector('input[type="file"]');
    if (!input) return;
    input.addEventListener('change', async () => {
      if (!input.files?.length) return;
      setStatus('Uploading ' + input.files[0].name + '…', 'working');
      const result = await submitForm(form, { expectJson: true, headers: { Accept: 'application/json' } });
      if (!result.ok || !result.data?.imageUrl) {
        setStatus('Image upload failed.', 'error');
        return;
      }
      updateImageDom(type, String(result.data.imageUrl));
      setStatus('Image updated.', 'success');
    });
  });

  document.querySelectorAll('[data-profile-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-profile-tab');
      document.querySelectorAll('[data-profile-tab]').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('[data-profile-panel]').forEach((panel) => {
        panel.hidden = panel.getAttribute('data-profile-panel') !== key;
      });
    });
  });

  const editToggle = document.querySelector('[data-profile-about-edit-toggle]');
  const nameInlineInput = document.getElementById('profile-name');
  const dobInlineInput = document.getElementById('profile-dob');
  let isEditing = false;

  const nameForm = document.createElement('form');
  nameForm.method = 'post';
  nameForm.action = '/api/profile/name';
  const dobForm = document.createElement('form');
  dobForm.method = 'post';
  dobForm.action = '/api/profile/dob';

  const nameInput = document.getElementById('profile-name');
  const dobInput = document.getElementById('profile-dob');
  const nameTitle = document.querySelector('[data-profile-name-title]');
  const nameValue = document.querySelector('[data-profile-name-value]');
  const dobText = document.querySelector('[data-profile-dob-text]');

  let lastSavedName = String(nameInput?.value || '').trim();
  let lastSavedDob = String(dobInput?.value || '');

  const syncEditUi = () => {
    isEditing = !isEditing;
    if (nameInlineInput) nameInlineInput.hidden = !isEditing;
    if (dobInlineInput) dobInlineInput.hidden = !isEditing;
    document.querySelectorAll('[data-profile-name-value],[data-profile-dob-text]').forEach((item) => item.hidden = isEditing);
    if (editToggle) {
      editToggle.setAttribute('aria-label', isEditing ? 'Save about me' : 'Edit about me');
      editToggle.classList.toggle('is-editing', isEditing);
    }
    if (isEditing) nameInput?.focus();
  };

  const resetAboutForm = () => {
    if (nameInput) nameInput.value = lastSavedName;
    if (dobInput) dobInput.value = lastSavedDob;
    setFieldStatus('about', '', 'idle');
  };

  const updateDobValue = () => {
    if (!dobInput) return '';
    const candidate = String(dobInput.value || '');
    if (!candidate) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;
    const date = new Date(candidate + 'T00:00:00.000Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== candidate) return null;
    const today = new Date();
    const max = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (date.getUTCFullYear() < 1900 || date > max) return null;
    return candidate;
  };

  editToggle?.addEventListener('click', async () => {
    if (!isEditing) {
      setFieldStatus('about', '', 'idle');
      syncEditUi();
      return;
    }
    const nextName = String(nameInput?.value || '').trim();
    if (!nextName || nextName.length > 100) {
      setFieldStatus('about', 'Name must be between 1 and 100 characters.', 'error');
      return;
    }

    const nextDob = updateDobValue();
    if (nextDob === null) {
      setFieldStatus('about', 'Please select a valid date of birth.', 'error');
      return;
    }

    const hasNameChange = nextName !== lastSavedName;
    const hasDobChange = (nextDob || '') !== lastSavedDob;
    if (!hasNameChange && !hasDobChange) {
      setFieldStatus('about', 'No changes to save.', 'idle');
      syncEditUi();
      return;
    }

    setFieldStatus('about', 'Saving…', 'working');
    if (hasNameChange) {
      const namePayload = new FormData();
      namePayload.set('name', nextName);
      const nameResponse = await fetch(nameForm.action, { method: 'POST', body: namePayload, credentials: 'same-origin' }).catch(() => null);
      if (!nameResponse?.ok) {
        setFieldStatus('about', 'Could not save profile details.', 'error');
        return;
      }
      lastSavedName = nextName;
      if (nameTitle) nameTitle.textContent = nextName;
      if (nameValue) nameValue.textContent = nextName;
    }

    if (hasDobChange) {
      const dobPayload = new FormData();
      dobPayload.set('dateOfBirth', nextDob || '');
      const dobResponse = await fetch(dobForm.action, { method: 'POST', body: dobPayload, credentials: 'same-origin' }).catch(() => null);
      if (!dobResponse?.ok) {
        setFieldStatus('about', 'Could not save profile details.', 'error');
        return;
      }
      lastSavedDob = nextDob || '';
      if (dobText) dobText.textContent = nextDob
        ? new Date(nextDob + 'T00:00:00.000Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
        : 'Not set';
    }

    setFieldStatus('about', 'Saved.', 'success');
    setTimeout(() => setFieldStatus('about', '', 'idle'), 1200);
    syncEditUi();
  });
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileMain(user)}${profilePageScript()}`;
  return appShell('profile', user, 'Profile', '', content, { hidePageHead: true, pageStyles: profileStyles });
}
