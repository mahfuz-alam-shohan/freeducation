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
const iconCalendar = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></svg>`;
const iconLock = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

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
        <p class="muted profile-upload-help">PNG, JPG, or WEBP. Auto uploads after selection.</p>
        <p class="muted profile-upload-status" data-profile-avatar-status aria-live="polite">No file selected.</p>
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

  return `<section class="card profile-tabs-card">
    <div class="profile-readonly-row"><p class="muted">Email (read-only)</p><p class="profile-fixed-value">${h(user.email)}</p></div>

    <form method="post" action="/api/profile/name" class="profile-form-grid" data-profile-name-form data-profile-autosave>
      <label for="profile-name">Full name</label>
      <input id="profile-name" class="input" name="name" maxlength="100" required value="${h(user.name)}" autocomplete="name" />
      <p class="muted profile-autosave-status" data-profile-status="name" aria-live="polite">Changes save automatically.</p>
    </form>

    <form method="post" action="/api/profile/dob" class="profile-form-grid" data-profile-dob-form data-profile-autosave>
      <label for="profile-dob-year"><span class="icon">${iconCalendar}</span>Date of birth</label>
      <div class="profile-dob-fields">
        <select class="input" name="dobYear" id="profile-dob-year" aria-label="Birth year">
          <option value="">Year</option>
          ${yearOptions}
        </select>
        <select class="input" name="dobMonth" id="profile-dob-month" aria-label="Birth month">
          <option value="">Month</option>
          ${monthOptions}
        </select>
        <select class="input" name="dobDay" id="profile-dob-day" aria-label="Birth day">
          <option value="">Day</option>
          ${dayOptions}
        </select>
      </div>
      <input type="hidden" name="dateOfBirth" value="${h(dobValue)}" data-profile-dob-value />
      <p class="muted profile-autosave-status" data-profile-status="dob" aria-live="polite">Select year, month, and day to autosave.</p>
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
  const avatarForm = avatarInput ? avatarInput.closest('form') : null;
  const avatarStatus = document.querySelector('[data-profile-avatar-status]');

  const setStatus = (key, message, tone) => {
    const element = document.querySelector('[data-profile-status="' + key + '"]');
    if (!element) return;
    element.textContent = message;
    element.dataset.tone = tone || 'idle';
  };

  const submitForm = async (form) => {
    const response = await fetch(form.action, {
      method: (form.method || 'POST').toUpperCase(),
      body: new FormData(form),
      credentials: 'same-origin',
      redirect: 'follow',
    }).catch(() => null);
    return Boolean(response && response.ok);
  };

  if (avatarInput && avatarForm) {
    avatarInput.addEventListener('change', async () => {
      if (!avatarInput.files?.length) return;
      if (avatarStatus) {
        avatarStatus.dataset.tone = 'working';
        avatarStatus.textContent = 'Uploading ' + avatarInput.files[0].name + '…';
      }
      const ok = await submitForm(avatarForm);
      if (ok) {
        if (avatarStatus) {
          avatarStatus.dataset.tone = 'success';
          avatarStatus.textContent = 'Upload complete. Refreshing profile…';
        }
        window.location.reload();
        return;
      }
      if (avatarStatus) {
        avatarStatus.dataset.tone = 'error';
        avatarStatus.textContent = 'Could not upload image. Please try again.';
      }
    });
  }

  let nameTimer = null;
  let nameSaving = false;
  let lastSavedName = '';
  const nameForm = document.querySelector('[data-profile-name-form]');
  const nameInput = document.getElementById('profile-name');

  const saveName = async () => {
    if (!nameForm || !nameInput || nameSaving) return;
    const nextName = String(nameInput.value || '').trim();
    if (!nextName || nextName.length > 100) {
      setStatus('name', 'Name must be between 1 and 100 characters.', 'error');
      return;
    }
    if (nextName === lastSavedName) {
      setStatus('name', 'All changes saved.', 'success');
      return;
    }
    setStatus('name', 'Saving name…', 'working');
    nameSaving = true;
    const ok = await submitForm(nameForm);
    nameSaving = false;
    if (ok) {
      lastSavedName = nextName;
      setStatus('name', 'Name saved.', 'success');
      if (String(nameInput.value || '').trim() !== lastSavedName) {
        saveName().catch(() => setStatus('name', 'Could not save name. Please retry.', 'error'));
      }
      return;
    }
    setStatus('name', 'Could not save name. Please retry.', 'error');
  };

  if (nameForm && nameInput) {
    lastSavedName = String(nameInput.value || '').trim();
    nameInput.addEventListener('input', () => {
      setStatus('name', 'Changes detected. Autosaving…', 'working');
      clearTimeout(nameTimer);
      nameTimer = setTimeout(() => {
        saveName().catch(() => setStatus('name', 'Could not save name. Please retry.', 'error'));
      }, 250);
    });
    nameInput.addEventListener('blur', () => {
      clearTimeout(nameTimer);
      saveName().catch(() => setStatus('name', 'Could not save name. Please retry.', 'error'));
    });
    nameForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    window.setInterval(() => {
      if (String(nameInput.value || '').trim() !== lastSavedName) {
        saveName().catch(() => setStatus('name', 'Could not save name. Please retry.', 'error'));
      }
    }, 1200);
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
    if (!year && !month && !day) {
      dobValue.value = '';
      return '';
    }
    if (!year || !month || !day) {
      dobValue.value = '';
      return null;
    }
    const candidate = year + '-' + month + '-' + day;
    const date = new Date(candidate + 'T00:00:00.000Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== candidate) {
      dobValue.value = '';
      return null;
    }
    const today = new Date();
    const max = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (date.getUTCFullYear() < 1900 || date > max) {
      dobValue.value = '';
      return null;
    }
    dobValue.value = candidate;
    return candidate;
  };

  if (dobForm && dobYear && dobMonth && dobDay && dobValue) {
    let lastSavedDob = dobValue.value;
    let dobSaving = false;
    const saveDob = async () => {
      if (dobSaving) return;
      const nextDob = updateDobValue();
      if (nextDob === null) {
        setStatus('dob', 'Please select a valid date.', 'error');
        return;
      }
      if (nextDob === lastSavedDob) return;
      setStatus('dob', 'Saving date of birth…', 'working');
      dobSaving = true;
      const ok = await submitForm(dobForm);
      dobSaving = false;
      if (!ok) {
        setStatus('dob', 'Could not save date of birth.', 'error');
        return;
      }
      lastSavedDob = nextDob;
      setStatus('dob', nextDob ? 'Date of birth saved.' : 'Date of birth cleared.', 'success');
    };

    [dobYear, dobMonth, dobDay].forEach((field) => {
      field.addEventListener('change', () => {
        saveDob().catch(() => setStatus('dob', 'Could not save date of birth.', 'error'));
      });
    });
    dobForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    window.setInterval(() => {
      if (updateDobValue() !== lastSavedDob) {
        saveDob().catch(() => setStatus('dob', 'Could not save date of birth.', 'error'));
      }
    }, 1200);
  }
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileDetails(user)}${profilePageScript()}`;
  return appShell('profile', user, 'Your profile', 'Manage your profile details, password, and avatar.', content);
}
