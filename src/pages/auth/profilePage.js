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

function photoMenu(type, hasImage) {
  const target = type === 'cover' ? 'Cover image' : 'Profile picture';
  const fileId = `${type}-upload`;
  return `<div class="profile-photo-actions">
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
    <div class="profile-name-row"><h2>${h(user.name)}</h2></div>
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
    <nav class="profile-tabs" aria-label="Profile sections">
      <button type="button" class="profile-tab is-active" data-profile-tab="about">About Me</button>
      <button type="button" class="profile-tab" data-profile-tab="security">Security</button>
    </nav>

    <div class="profile-tab-panel" data-profile-panel="about">
      <div class="profile-readonly-row"><p class="muted">Email</p><p class="profile-fixed-value">${h(user.email)}</p></div>
      <form method="post" action="/api/profile/name" class="profile-form-grid" data-profile-name-form>
        <label for="profile-name">Full name</label>
        <input id="profile-name" class="input" name="name" maxlength="100" required value="${h(user.name)}" autocomplete="name" />
        <p class="muted profile-autosave-status" data-profile-status="name" aria-live="polite">Saved.</p>
      </form>
      <form method="post" action="/api/profile/dob" class="profile-form-grid" data-profile-dob-form>
        <label for="profile-dob-year">Date of birth</label>
        <div class="profile-dob-fields">
          <select class="input" name="dobYear" id="profile-dob-year" aria-label="Birth year"><option value="">Year</option>${yearOptions}</select>
          <select class="input" name="dobMonth" id="profile-dob-month" aria-label="Birth month"><option value="">Month</option>${monthOptions}</select>
          <select class="input" name="dobDay" id="profile-dob-day" aria-label="Birth day"><option value="">Day</option>${dayOptions}</select>
        </div>
        <input type="hidden" name="dateOfBirth" value="${h(dobValue)}" data-profile-dob-value />
        <p class="muted profile-autosave-status" data-profile-status="dob" aria-live="polite">Saved.</p>
      </form>
    </div>

    <div class="profile-tab-panel" data-profile-panel="security" hidden>
      <form method="post" action="/api/profile/password" class="profile-form-grid">
        <label for="profile-current-password">Current password</label>
        <input id="profile-current-password" class="input" type="password" name="currentPassword" minlength="8" maxlength="120" required autocomplete="current-password" />
        <label for="profile-new-password">New password</label>
        <input id="profile-new-password" class="input" type="password" name="newPassword" minlength="8" maxlength="120" required autocomplete="new-password" />
        <div class="profile-form-actions"><button class="btn btn-primary" type="submit">Update password</button></div>
      </form>
    </div>

    <dialog class="content-modal" data-profile-photo-modal>
      <div class="modal content-modal-inner">
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
      document.querySelectorAll('[data-profile-tab]').forEach((item) => item.classList.toggle('is-active', item === tab));
      document.querySelectorAll('[data-profile-panel]').forEach((panel) => {
        panel.hidden = panel.getAttribute('data-profile-panel') !== key;
      });
    });
  });

  let nameTimer = null;
  let nameSaving = false;
  let lastSavedName = '';
  const nameForm = document.querySelector('[data-profile-name-form]');
  const nameInput = document.getElementById('profile-name');
  const saveName = async () => {
    if (!nameForm || !nameInput || nameSaving) return;
    const nextName = String(nameInput.value || '').trim();
    if (!nextName || nextName.length > 100) return setFieldStatus('name', 'Name must be between 1 and 100 characters.', 'error');
    if (nextName === lastSavedName) return setFieldStatus('name', 'Saved.', 'success');
    setFieldStatus('name', 'Saving…', 'working');
    nameSaving = true;
    const result = await submitForm(nameForm);
    nameSaving = false;
    if (!result.ok) return setFieldStatus('name', 'Could not save name.', 'error');
    lastSavedName = nextName;
    setFieldStatus('name', 'Saved.', 'success');
  };
  if (nameForm && nameInput) {
    lastSavedName = String(nameInput.value || '').trim();
    nameInput.addEventListener('input', () => {
      clearTimeout(nameTimer);
      nameTimer = setTimeout(() => { saveName().catch(() => setFieldStatus('name', 'Could not save name.', 'error')); }, 250);
    });
    nameInput.addEventListener('blur', () => saveName().catch(() => setFieldStatus('name', 'Could not save name.', 'error')));
    nameForm.addEventListener('submit', (event) => event.preventDefault());
  }

  const dobForm = document.querySelector('[data-profile-dob-form]');
  const dobYear = document.getElementById('profile-dob-year');
  const dobMonth = document.getElementById('profile-dob-month');
  const dobDay = document.getElementById('profile-dob-day');
  const dobValue = document.querySelector('[data-profile-dob-value]');
  const updateDobValue = () => {
    if (!dobYear || !dobMonth || !dobDay || !dobValue) return null;
    const year = dobYear.value;
    const month = dobMonth.value;
    const day = dobDay.value;
    if (!year && !month && !day) return (dobValue.value = '');
    if (!year || !month || !day) return (dobValue.value = '', null);
    const candidate = year + '-' + month + '-' + day;
    const date = new Date(candidate + 'T00:00:00.000Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== candidate) return (dobValue.value = '', null);
    const today = new Date();
    const max = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (date.getUTCFullYear() < 1900 || date > max) return (dobValue.value = '', null);
    dobValue.value = candidate;
    return candidate;
  };

  if (dobForm && dobYear && dobMonth && dobDay && dobValue) {
    let lastSavedDob = dobValue.value;
    let dobSaving = false;
    const saveDob = async () => {
      if (dobSaving) return;
      const nextDob = updateDobValue();
      if (nextDob === null) return setFieldStatus('dob', 'Please select a valid date.', 'error');
      if (nextDob === lastSavedDob) return;
      setFieldStatus('dob', 'Saving…', 'working');
      dobSaving = true;
      const result = await submitForm(dobForm);
      dobSaving = false;
      if (!result.ok) return setFieldStatus('dob', 'Could not save date of birth.', 'error');
      lastSavedDob = nextDob;
      setFieldStatus('dob', 'Saved.', 'success');
    };
    [dobYear, dobMonth, dobDay].forEach((field) => field.addEventListener('change', () => saveDob().catch(() => setFieldStatus('dob', 'Could not save date of birth.', 'error'))));
    dobForm.addEventListener('submit', (event) => event.preventDefault());
  }
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileMain(user)}${profilePageScript()}`;
  return appShell('profile', user, 'Profile', '', content, { hidePageHead: true });
}
