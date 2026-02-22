import { appShell } from "../../templates/shell.js";
import { profileStyles } from "./profileStyles.js";
import { imageUrlFromKey } from "../../imageUrl.js";

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const iconCamera = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5a2 2 0 0 1 2-2h2.05c.46 0 .9-.22 1.18-.6l.8-1.09A2 2 0 0 1 11.14 4h1.72a2 2 0 0 1 1.61.81l.8 1.09c.28.38.72.6 1.18.6h2.05a2 2 0 0 1 2 2v8.75a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.75"/><path d="M17.35 10.25h.01"/></svg>`;
const iconEdit = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h5.2a2 2 0 0 0 1.42-.59L20 10.03a1.9 1.9 0 0 0 0-2.69l-3.32-3.32a1.9 1.9 0 0 0-2.69 0L3.59 14.42A2 2 0 0 0 3 15.84z"/><path d="m12.6 5.4 6 6"/></svg>`;

function initialsForUser(user) {
  return (user.name || user.email || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatDate(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate || ""))) return "Not set";
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return "Not set";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function formatJoined(isoDateTime) {
  const date = new Date(String(isoDateTime || ""));
  if (!Number.isFinite(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function photoMenu(type, hasImage) {
  const target = type === "cover" ? "Cover image" : "Profile picture";
  const fileId = `${type}-upload`;
  return `<div class="profile-photo-actions" data-profile-photo-actions="${type}">
    <button type="button" class="profile-photo-action" data-profile-view="${type}" ${hasImage ? "" : "disabled"}>See ${target}</button>
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
        ${photoMenu("cover", Boolean(coverUrl))}
        <form method="post" action="/api/profile/cover" enctype="multipart/form-data" data-profile-upload-form="cover">
          <input id="cover-upload" name="cover" type="file" accept="image/png,image/jpeg,image/webp" class="profile-file-input" />
        </form>
      </div>
      <div class="profile-avatar-row">
        <div class="profile-avatar-shell" data-profile-avatar>${avatarUrl ? `<img src="${avatarUrl}" alt="${h(user.name)} avatar" loading="lazy" decoding="async" />` : h(initials || "U")}</div>
        <div class="profile-photo-control profile-avatar-control">
          <button class="btn btn-secondary profile-photo-icon-btn" type="button" data-profile-photo-menu-toggle="avatar" aria-expanded="false" aria-haspopup="true"><span class="icon">${iconCamera}</span></button>
          ${photoMenu("avatar", Boolean(avatarUrl))}
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
  const dobValue = /^\d{4}-\d{2}-\d{2}$/.test(String(user.dateOfBirth || "")) ? String(user.dateOfBirth) : "";
  const dobYearValue = dobValue ? Number(dobValue.slice(0, 4)) : "";
  const dobMonthValue = dobValue ? Number(dobValue.slice(5, 7)) : "";
  const dobDayValue = dobValue ? Number(dobValue.slice(8, 10)) : "";
  const maxDob = new Date().toISOString().slice(0, 10);
  const maxYear = Number(maxDob.slice(0, 4));
  const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => `<option value="${index + 1}" ${dobMonthValue === index + 1 ? "selected" : ""}>${month}</option>`).join("");
  const dayOptions = Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    return `<option value="${day}" ${dobDayValue === day ? "selected" : ""}>${day}</option>`;
  }).join("");
  const yearOptions = Array.from({ length: maxYear - 1899 }, (_, index) => {
    const year = maxYear - index;
    return `<option value="${year}" ${dobYearValue === year ? "selected" : ""}>${year}</option>`;
  }).join("");

  return `<section class="profile-body-flat">
    <div class="profile-snapshot" aria-label="Profile overview">
      <article class="profile-snapshot-item">
        <p class="profile-snapshot-label">Email</p>
        <p class="profile-snapshot-value">${h(user.email)}</p>
      </article>
      <article class="profile-snapshot-item">
        <p class="profile-snapshot-label">Role</p>
        <p class="profile-snapshot-value">${h(user.role || "user")}</p>
      </article>
      <article class="profile-snapshot-item">
        <p class="profile-snapshot-label">Joined</p>
        <p class="profile-snapshot-value">${h(formatJoined(user.createdAt))}</p>
      </article>
    </div>

    <nav class="profile-tabs" aria-label="Profile sections" role="tablist">
      <button type="button" class="profile-tab is-active" role="tab" aria-selected="true" aria-controls="profile-about-panel" id="profile-about-tab" data-profile-tab="about">About Me</button>
      <button type="button" class="profile-tab" role="tab" aria-selected="false" aria-controls="profile-security-panel" id="profile-security-tab" data-profile-tab="security">Security</button>
    </nav>

    <div class="profile-tab-panel" id="profile-about-panel" role="tabpanel" aria-labelledby="profile-about-tab" data-profile-panel="about">
      <div class="profile-bio" data-profile-about-view>
        <p class="profile-panel-title">Personal details</p>
        <div class="profile-readonly-row" data-profile-inline-field="name">
          <div class="profile-field-head">
            <p class="profile-bio-label" id="profile-name-label">Name</p>
            <button type="button" class="profile-inline-edit-btn" data-profile-inline-toggle="name" aria-expanded="false" aria-controls="profile-name-editor" aria-label="Edit name"><span class="icon">${iconEdit}</span></button>
          </div>
          <p class="profile-fixed-value" data-profile-name-value>${h(user.name)}</p>
          <form id="profile-name-editor" class="profile-inline-editor" data-profile-inline-editor="name" method="post" action="/api/profile/name" hidden>
            <label for="profile-name" class="profile-field-label">Name</label>
            <input id="profile-name" class="input profile-inline-input" name="name" maxlength="100" required value="${h(user.name)}" autocomplete="name" />
            <div class="profile-inline-actions">
              <button class="btn btn-primary" type="submit">Save</button>
              <button class="btn btn-secondary" type="button" data-profile-inline-cancel="name">Cancel</button>
            </div>
          </form>
          <p class="muted profile-inline-status" data-profile-status="name" aria-live="polite"></p>
        </div>
        <div class="profile-readonly-row" data-profile-inline-field="dob">
          <div class="profile-field-head">
            <p class="profile-bio-label" id="profile-dob-label">Date of birth</p>
            <button type="button" class="profile-inline-edit-btn" data-profile-inline-toggle="dob" aria-expanded="false" aria-controls="profile-dob-editor" aria-label="Edit date of birth"><span class="icon">${iconEdit}</span></button>
          </div>
          <p class="profile-fixed-value" data-profile-dob-text>${h(formatDate(user.dateOfBirth))}</p>
          <form id="profile-dob-editor" class="profile-inline-editor" data-profile-inline-editor="dob" method="post" action="/api/profile/dob" hidden>
            <label for="profile-dob-day" class="profile-field-label">Date of birth</label>
            <input id="profile-dob" type="hidden" name="dateOfBirth" value="${h(dobValue)}" />
            <div class="profile-dob-grid">
              <select id="profile-dob-day" class="input profile-inline-input" name="dobDay" data-profile-dob-day aria-label="Day of birth">
                <option value="">Day</option>${dayOptions}
              </select>
              <select id="profile-dob-month" class="input profile-inline-input" name="dobMonth" data-profile-dob-month aria-label="Month of birth">
                <option value="">Month</option>${monthOptions}
              </select>
              <select id="profile-dob-year" class="input profile-inline-input" name="dobYear" data-profile-dob-year aria-label="Year of birth">
                <option value="">Year</option>${yearOptions}
              </select>
            </div>
            <div class="profile-inline-actions">
              <button class="btn btn-primary" type="submit">Save</button>
              <button class="btn btn-secondary" type="button" data-profile-inline-cancel="dob">Cancel</button>
            </div>
          </form>
          <p class="muted profile-inline-status" data-profile-status="dob" aria-live="polite"></p>
        </div>
      </div>
    </div>

    <div class="profile-tab-panel" id="profile-security-panel" role="tabpanel" aria-labelledby="profile-security-tab" data-profile-panel="security" hidden>
      <p class="profile-panel-title">Password</p>
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

  const nameInput = document.getElementById('profile-name');
  const dobInput = document.getElementById('profile-dob');
  const dobDayInput = document.querySelector('[data-profile-dob-day]');
  const dobMonthInput = document.querySelector('[data-profile-dob-month]');
  const dobYearInput = document.querySelector('[data-profile-dob-year]');
  const nameTitle = document.querySelector('[data-profile-name-title]');
  const nameValue = document.querySelector('[data-profile-name-value]');
  const dobText = document.querySelector('[data-profile-dob-text]');

  let lastSavedName = String(nameInput?.value || '').trim();
  let lastSavedDob = String(dobInput?.value || '');

  const setEditorOpen = (key, open) => {
    document.querySelectorAll('[data-profile-inline-editor]').forEach((editorNode) => {
      const editorKey = editorNode.getAttribute('data-profile-inline-editor');
      const active = open && editorKey === key;
      editorNode.hidden = !active;
      const toggleNode = document.querySelector('[data-profile-inline-toggle="' + editorKey + '"]');
      if (toggleNode) {
        toggleNode.setAttribute('aria-expanded', String(active));
        toggleNode.classList.toggle('is-open', active);
      }
      const valueNode = editorKey === 'name' ? nameValue : dobText;
      if (valueNode) valueNode.hidden = active;
    });

    if (!open) return;
    if (key === 'dob') {
      dobDayInput?.focus();
      return;
    }
    document.querySelector('[data-profile-inline-editor="' + key + '"] input')?.focus();
  };

  const syncDobSelectors = (isoDate) => {
    if (!dobDayInput || !dobMonthInput || !dobYearInput) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate || ''))) {
      dobDayInput.value = '';
      dobMonthInput.value = '';
      dobYearInput.value = '';
      return;
    }
    dobYearInput.value = String(Number(isoDate.slice(0, 4)));
    dobMonthInput.value = String(Number(isoDate.slice(5, 7)));
    dobDayInput.value = String(Number(isoDate.slice(8, 10)));
  };

  const updateDobValue = () => {
    if (!dobInput) return '';
    const year = String(dobYearInput?.value || '').trim();
    const month = String(dobMonthInput?.value || '').trim();
    const day = String(dobDayInput?.value || '').trim();
    if (!year && !month && !day) {
      dobInput.value = '';
      return '';
    }
    if (!year || !month || !day) return null;
    const candidate = year.padStart(4, '0') + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;
    const date = new Date(candidate + 'T00:00:00.000Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== candidate) return null;
    const today = new Date();
    const max = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (date.getUTCFullYear() < 1900 || date > max) return null;
    dobInput.value = candidate;
    return candidate;
  };

  document.querySelectorAll('[data-profile-inline-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-profile-inline-toggle');
      if (!key) return;
      const editor = document.querySelector('[data-profile-inline-editor="' + key + '"]');
      const opening = Boolean(editor?.hidden);
      setEditorOpen(key, opening);
      setFieldStatus(key, '', 'idle');
      if (!opening && key === 'name' && nameInput) nameInput.value = lastSavedName;
      if (!opening && key === 'dob' && dobInput) {
        dobInput.value = lastSavedDob;
        syncDobSelectors(lastSavedDob);
      }
    });
  });

  document.querySelectorAll('[data-profile-inline-cancel]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-profile-inline-cancel');
      if (!key) return;
      if (key === 'name' && nameInput) nameInput.value = lastSavedName;
      if (key === 'dob' && dobInput) {
        dobInput.value = lastSavedDob;
        syncDobSelectors(lastSavedDob);
      }
      setFieldStatus(key, '', 'idle');
      setEditorOpen(key, false);
    });
  });

  const submitName = async (event) => {
    event.preventDefault();
    const nextName = String(nameInput?.value || '').trim();
    if (!nextName || nextName.length > 100) {
      setFieldStatus('name', 'Name must be between 1 and 100 characters.', 'error');
      return;
    }
    if (nextName === lastSavedName) {
      setFieldStatus('name', 'No changes to save.', 'idle');
      setEditorOpen('name', false);
      return;
    }
    setFieldStatus('name', 'Saving…', 'working');
    const payload = new FormData();
    payload.set('name', nextName);
    const response = await fetch('/api/profile/name', { method: 'POST', body: payload, credentials: 'same-origin' }).catch(() => null);
    if (!response?.ok) {
      setFieldStatus('name', 'Could not save name.', 'error');
      return;
    }
    lastSavedName = nextName;
    if (nameTitle) nameTitle.textContent = nextName;
    if (nameValue) nameValue.textContent = nextName;
    setFieldStatus('name', 'Saved.', 'success');
    setEditorOpen('name', false);
    setTimeout(() => setFieldStatus('name', '', 'idle'), 1200);
  };

  const submitDob = async (event) => {
    event.preventDefault();
    const nextDob = updateDobValue();
    if (nextDob === null) {
      setFieldStatus('dob', 'Please select a valid date of birth.', 'error');
      return;
    }
    if ((nextDob || '') === lastSavedDob) {
      setFieldStatus('dob', 'No changes to save.', 'idle');
      setEditorOpen('dob', false);
      return;
    }
    setFieldStatus('dob', 'Saving…', 'working');
    const payload = new FormData();
    payload.set('dateOfBirth', nextDob || '');
    const response = await fetch('/api/profile/dob', { method: 'POST', body: payload, credentials: 'same-origin' }).catch(() => null);
    if (!response?.ok) {
      setFieldStatus('dob', 'Could not save date of birth.', 'error');
      return;
    }
    lastSavedDob = nextDob || '';
    if (dobText) dobText.textContent = nextDob
      ? new Date(nextDob + 'T00:00:00.000Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
      : 'Not set';
    setFieldStatus('dob', 'Saved.', 'success');
    setEditorOpen('dob', false);
    setTimeout(() => setFieldStatus('dob', '', 'idle'), 1200);
  };

  syncDobSelectors(lastSavedDob);
  setEditorOpen('', false);
  [dobDayInput, dobMonthInput, dobYearInput].forEach((input) => {
    input?.addEventListener('change', () => setFieldStatus('dob', '', 'idle'));
  });

  document.querySelector('[data-profile-inline-editor="name"]')?.addEventListener('submit', submitName);
  document.querySelector('[data-profile-inline-editor="dob"]')?.addEventListener('submit', submitDob);
})();
</script>`;
}

export function profilePage(user) {
  const content = `${profileHeader(user)}${profileMain(user)}${profilePageScript()}`;
  return appShell("profile", user, "Profile", "", content, { hidePageHead: true, pageStyles: profileStyles });
}
