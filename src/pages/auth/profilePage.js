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
const iconEdit = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Zm17.71-10.04a1 1 0 0 0 0-1.42L18.2 3.3a1 1 0 0 0-1.41 0l-1.96 1.95 3.75 3.75 2.13-2.13Z"/></svg>`;

const dobMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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
  const [dobYear = '', dobMonth = '', dobDay = ''] = dobValue ? dobValue.split('-') : ['', '', ''];
  const currentYear = new Date().getUTCFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, index) => {
    const year = String(currentYear - index);
    const selected = year === dobYear ? ' selected' : '';
    return `<option value="${year}"${selected}>${year}</option>`;
  }).join('');
  const monthOptions = dobMonths
    .map((label, index) => {
      const value = String(index + 1).padStart(2, '0');
      const selected = value === dobMonth ? ' selected' : '';
      return `<option value="${value}"${selected}>${label}</option>`;
    })
    .join('');
  const dayOptions = Array.from({ length: 31 }, (_, index) => {
    const value = String(index + 1).padStart(2, '0');
    const selected = value === dobDay ? ' selected' : '';
    return `<option value="${value}"${selected}>${value}</option>`;
  }).join('');

  return `<section class="profile-body-flat">
    <nav class="profile-tabs" aria-label="Profile sections" role="tablist">
      <button type="button" class="profile-tab is-active" role="tab" aria-selected="true" aria-controls="profile-about-panel" id="profile-about-tab" data-profile-tab="about">About Me</button>
      <button type="button" class="profile-tab" role="tab" aria-selected="false" aria-controls="profile-security-panel" id="profile-security-tab" data-profile-tab="security">Security</button>
    </nav>

    <div class="profile-tab-panel" id="profile-about-panel" role="tabpanel" aria-labelledby="profile-about-tab" data-profile-panel="about">
      <div class="profile-bio" data-profile-about-view>
        <div class="profile-readonly-row" data-profile-inline-field="name">
          <div class="profile-readonly-head">
            <p class="muted">Name</p>
            <button type="button" class="profile-inline-edit-btn" data-profile-inline-toggle="name" aria-label="Edit name"><span class="icon">${iconEdit}</span></button>
          </div>
          <p class="profile-fixed-value" data-profile-name-value>${h(user.name)}</p>
          <form class="profile-inline-form" data-profile-inline-form="name" hidden>
            <label for="profile-name" class="sr-only">Name</label>
            <input id="profile-name" class="input" name="name" maxlength="100" required value="${h(user.name)}" autocomplete="name" />
            <div class="profile-form-actions">
              <button type="button" class="btn btn-secondary" data-profile-inline-cancel="name">Cancel</button>
              <button class="btn btn-primary" type="submit">Save</button>
            </div>
          </form>
        </div>
        <div class="profile-readonly-row"><p class="muted">Email</p><p class="profile-fixed-value">${h(user.email)}</p></div>
        <div class="profile-readonly-row"><p class="muted">Role</p><p class="profile-fixed-value">${h(user.role || 'user')}</p></div>
        <div class="profile-readonly-row" data-profile-inline-field="dob">
          <div class="profile-readonly-head">
            <p class="muted">Date of birth</p>
            <button type="button" class="profile-inline-edit-btn" data-profile-inline-toggle="dob" aria-label="Edit date of birth"><span class="icon">${iconEdit}</span></button>
          </div>
          <p class="profile-fixed-value" data-profile-dob-text>${h(formatDate(user.dateOfBirth))}</p>
          <form class="profile-inline-form" data-profile-inline-form="dob" hidden>
            <label for="profile-dob-year" class="sr-only">Date of birth</label>
            <div class="profile-dob-fields">
              <select class="input" name="dobYear" id="profile-dob-year" aria-label="Birth year"><option value="">Year</option>${yearOptions}</select>
              <select class="input" name="dobMonth" id="profile-dob-month" aria-label="Birth month"><option value="">Month</option>${monthOptions}</select>
              <select class="input" name="dobDay" id="profile-dob-day" aria-label="Birth day"><option value="">Day</option>${dayOptions}</select>
            </div>
            <input type="hidden" name="dateOfBirth" value="${h(dobValue)}" data-profile-dob-value />
            <div class="profile-form-actions">
              <button type="button" class="btn btn-secondary" data-profile-inline-cancel="dob">Cancel</button>
              <button class="btn btn-primary" type="submit">Save</button>
            </div>
          </form>
        </div>
        <div class="profile-readonly-row"><p class="muted">Joined</p><p class="profile-fixed-value">${h(formatJoined(user.createdAt))}</p></div>
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

  const inlineForms = {
    name: document.querySelector('[data-profile-inline-form="name"]'),
    dob: document.querySelector('[data-profile-inline-form="dob"]'),
  };
  const nameForm = document.createElement('form');
  nameForm.method = 'post';
  nameForm.action = '/api/profile/name';
  const dobForm = document.createElement('form');
  dobForm.method = 'post';
  dobForm.action = '/api/profile/dob';

  const nameInput = document.getElementById('profile-name');
  const dobYear = document.getElementById('profile-dob-year');
  const dobMonth = document.getElementById('profile-dob-month');
  const dobDay = document.getElementById('profile-dob-day');
  const dobValue = document.querySelector('[data-profile-dob-value]');
  const nameTitle = document.querySelector('[data-profile-name-title]');
  const nameValue = document.querySelector('[data-profile-name-value]');
  const dobText = document.querySelector('[data-profile-dob-text]');

  let lastSavedName = String(nameInput?.value || '').trim();
  let lastSavedDob = String(dobValue?.value || '');

  const closeInlineForms = () => {
    Object.values(inlineForms).forEach((form) => {
      if (form) form.hidden = true;
    });
  };

  const resetAboutForm = () => {
    if (nameInput) nameInput.value = lastSavedName;
    if (dobValue) dobValue.value = lastSavedDob;
    if (dobYear && dobMonth && dobDay) {
      const [year = '', month = '', day = ''] = lastSavedDob ? lastSavedDob.split('-') : ['', '', ''];
      dobYear.value = year;
      dobMonth.value = month;
      dobDay.value = day;
    }
    setFieldStatus('about', '', 'idle');
  };

  const updateDobValue = () => {
    if (!dobYear || !dobMonth || !dobDay || !dobValue) return null;
    const year = dobYear.value;
    const month = dobMonth.value;
    const day = dobDay.value;
    if (!year && !month && !day) return (dobValue.value = '');
    if (!year || !month || !day) return null;
    const candidate = year + '-' + month + '-' + day;
    const date = new Date(candidate + 'T00:00:00.000Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== candidate) return null;
    const today = new Date();
    const max = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (date.getUTCFullYear() < 1900 || date > max) return null;
    dobValue.value = candidate;
    return candidate;
  };

  document.querySelectorAll('[data-profile-inline-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-profile-inline-toggle');
      const target = key ? inlineForms[key] : null;
      if (!target) return;
      const opening = target.hidden;
      closeInlineForms();
      target.hidden = !opening;
      setFieldStatus('about', '', 'idle');
      if (opening) {
        if (key === 'name') nameInput?.focus();
        if (key === 'dob') dobYear?.focus();
      }
    });
  });

  document.querySelectorAll('[data-profile-inline-cancel]').forEach((button) => {
    button.addEventListener('click', () => {
      resetAboutForm();
      closeInlineForms();
    });
  });

  inlineForms.name?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!nameInput) return;

    const nextName = String(nameInput.value || '').trim();
    if (!nextName || nextName.length > 100) {
      setFieldStatus('about', 'Name must be between 1 and 100 characters.', 'error');
      return;
    }

    setFieldStatus('about', 'Saving…', 'working');

    if (nextName === lastSavedName) {
      setFieldStatus('about', 'No changes to save.', 'idle');
      closeInlineForms();
      return;
    }

    const payload = new FormData();
    payload.set('name', nextName);
    const response = await fetch(nameForm.action, { method: 'POST', body: payload, credentials: 'same-origin' }).catch(() => null);
    if (!response?.ok) {
      setFieldStatus('about', 'Could not save profile details.', 'error');
      return;
    }

    lastSavedName = nextName;
    if (nameTitle) nameTitle.textContent = nextName;
    if (nameValue) nameValue.textContent = nextName;

    setFieldStatus('about', 'Saved.', 'success');
    setTimeout(() => setFieldStatus('about', '', 'idle'), 1200);
    closeInlineForms();
  });

  inlineForms.dob?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!dobValue) return;

    const nextDob = updateDobValue();
    if (nextDob === null) {
      setFieldStatus('about', 'Please select a valid date of birth.', 'error');
      return;
    }

    if ((nextDob || '') === lastSavedDob) {
      setFieldStatus('about', 'No changes to save.', 'idle');
      closeInlineForms();
      return;
    }

    setFieldStatus('about', 'Saving…', 'working');
    const payload = new FormData();
    payload.set('dateOfBirth', nextDob || '');
    const response = await fetch(dobForm.action, { method: 'POST', body: payload, credentials: 'same-origin' }).catch(() => null);
    if (!response?.ok) {
      setFieldStatus('about', 'Could not save profile details.', 'error');
      return;
    }

    lastSavedDob = nextDob || '';
    if (dobText) dobText.textContent = nextDob
      ? new Date(nextDob + 'T00:00:00.000Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
      : 'Not set';

    setFieldStatus('about', 'Saved.', 'success');
    setTimeout(() => setFieldStatus('about', '', 'idle'), 1200);
    closeInlineForms();
  });
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileMain(user)}${profilePageScript()}`;
  return appShell('profile', user, 'Profile', '', content, { hidePageHead: true });
}
