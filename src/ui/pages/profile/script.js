import { imageCompressionModule } from "./imageCompression.js";

export function profileScript(apiBase = "/api/admin") {
  return `
(() => {
${imageCompressionModule()}
const API_BASE = ${JSON.stringify("" + apiBase)};
const tabAbout = document.getElementById('tabAbout');
const tabSecurity = document.getElementById('tabSecurity');
const panelAbout = document.getElementById('panelAbout');
const panelSecurity = document.getElementById('panelSecurity');
const openPasswordForm = document.getElementById('openPasswordForm');
const passwordForm = document.getElementById('passwordForm');
const profileMsg = document.getElementById('profileMsg');
const profilePage = document.querySelector('.profile-page');
const profilePageLoader = document.getElementById('profilePageLoader');
const profileTabIndicator = document.getElementById('profileTabIndicator');

const imageActionMenu = document.getElementById('imageActionMenu');
const imageUploadInput = document.getElementById('imageUploadInput');
const changeImageButton = document.getElementById('changeImageButton');
const viewImageButton = document.getElementById('viewImageButton');
const uploadProgressWrap = document.getElementById('uploadProgressWrap');
const uploadProgressText = document.getElementById('uploadProgressText');
const uploadProgressBar = document.getElementById('uploadProgressBar');

const imageViewModal = document.getElementById('imageViewModal');
const closeViewModal = document.getElementById('closeViewModal');
const imageBigPreview = document.getElementById('imageBigPreview');

const avatarPanel = document.getElementById('avatarPanel');
const coverPanel = document.getElementById('coverPanel');
const avatarAction = document.getElementById('avatarAction');
const coverAction = document.getElementById('coverAction');
const avatarImage = document.getElementById('avatarImage');
const coverImage = document.getElementById('coverImage');
const avatarFallback = document.getElementById('avatarFallback');

const profileTitleName = document.getElementById('profileTitleName');
const aboutName = document.getElementById('aboutName');
const aboutEmail = document.getElementById('aboutEmail');
const aboutDob = document.getElementById('aboutDob');
const aboutGender = document.getElementById('aboutGender');
const aboutRole = document.getElementById('aboutRole');

const editTriggers = Array.from(document.querySelectorAll('[data-edit-trigger]'));
const editForms = Array.from(document.querySelectorAll('[data-edit-form]'));
const editCancels = Array.from(document.querySelectorAll('[data-edit-cancel]'));

if (!tabAbout || !tabSecurity || !panelAbout || !panelSecurity || !openPasswordForm || !passwordForm || !profileMsg || !imageActionMenu || !imageUploadInput || !changeImageButton || !viewImageButton || !imageViewModal || !avatarPanel || !coverPanel || !avatarAction || !coverAction || !profilePage || !profilePageLoader || !profileTabIndicator || !aboutName || !profileTitleName) return;

const controller = new AbortController();
const { signal } = controller;
if (typeof window.__registerCleanup === 'function') window.__registerCleanup(() => controller.abort());
const avatarVersionStorageKey = 'freeducation-avatar-version';

let currentImageType = 'avatar';
const hasImage = { avatar: false, cover: false };
let isUploadingImage = false;
let tabSwitchTimer = null;
let activeEditField = null;
let isSavingInlineEdit = false;
const editAnimationTimers = new Map();
let imageMenuCloseTimer = null;
let imageModalCloseTimer = null;

const profileState = {
  name: '-',
  email: '-',
  date_of_birth: '',
  gender: '-',
  user_type: 'Administrator',
};

const setPageLoading = (loading) => {
  profilePage.classList.toggle('is-loading', loading);
  profilePage.setAttribute('aria-busy', loading ? 'true' : 'false');
  profilePageLoader.setAttribute('aria-busy', loading ? 'true' : 'false');
  profilePageLoader.hidden = !loading;
};

const resetUploadUi = () => {
  if (uploadProgressWrap) uploadProgressWrap.hidden = true;
  if (uploadProgressBar) uploadProgressBar.value = 0;
  if (uploadProgressText) uploadProgressText.textContent = 'Preparing upload...';
};

const clearInlineMessage = () => {
  profileMsg.hidden = true;
  profileMsg.textContent = '';
  profileMsg.style.color = '';
};

const showMessage = (message, options = {}) => {
  const { type = 'success', inline = false } = options;

  if (inline && message) {
    profileMsg.hidden = false;
    profileMsg.textContent = message;
    profileMsg.style.color = type === 'error' ? '#ff9ca1' : '';
  } else {
    clearInlineMessage();
  }

  if (typeof window.__showAppStatus === 'function' && message) {
    window.__showAppStatus(message, type === 'error' ? 'error' : 'success');
  }
};

const updateTabIndicator = (activeTab) => {
  if (!activeTab || !profileTabIndicator) return;
  const tabsWrap = profileTabIndicator.parentElement;
  if (!tabsWrap) return;

  const wrapRect = tabsWrap.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();
  profileTabIndicator.style.width = tabRect.width + 'px';
  profileTabIndicator.style.transform = 'translateX(' + (tabRect.left - wrapRect.left) + 'px)';
};

const switchTab = (showAbout) => {
  if (profilePage.classList.contains('is-loading')) return;

  const incomingPanel = showAbout ? panelAbout : panelSecurity;
  const outgoingPanel = showAbout ? panelSecurity : panelAbout;

  tabAbout.classList.toggle('is-active', showAbout);
  tabSecurity.classList.toggle('is-active', !showAbout);
  tabAbout.setAttribute('aria-selected', String(showAbout));
  tabSecurity.setAttribute('aria-selected', String(!showAbout));
  updateTabIndicator(showAbout ? tabAbout : tabSecurity);

  outgoingPanel.classList.remove('is-active');
  outgoingPanel.classList.add('is-leaving');
  incomingPanel.hidden = false;
  incomingPanel.classList.add('is-active');

  if (tabSwitchTimer) window.clearTimeout(tabSwitchTimer);
  tabSwitchTimer = window.setTimeout(() => {
    outgoingPanel.hidden = true;
    outgoingPanel.classList.remove('is-leaving');
    tabSwitchTimer = null;
  }, 280);

  if (showAbout) {
    passwordForm.hidden = true;
    openPasswordForm.textContent = 'Change password';
  }
};

const focusTab = (tab) => {
  if (tab && typeof tab.focus === 'function') tab.focus();
};

const formatDob = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

const hydrateAboutSection = () => {
  aboutName.textContent = profileState.name || '-';
  aboutEmail.textContent = profileState.email || '-';
  aboutDob.textContent = formatDob(profileState.date_of_birth);
  aboutGender.textContent = profileState.gender || '-';
  aboutRole.textContent = profileState.user_type || 'Administrator';
  profileTitleName.textContent = profileState.name || 'Administrator';
  avatarFallback.textContent = (profileState.name || 'A').slice(0, 2).toUpperCase();
};

const getFieldFormControls = (field, form) => {
  if (field === 'date_of_birth') {
    return {
      dayInput: form.elements.day,
      monthInput: form.elements.month,
      yearInput: form.elements.year,
    };
  }

  return { valueInput: form.elements.value };
};

const closeInlineEdit = (field) => {
  const trigger = panelAbout.querySelector('[data-edit-trigger="' + field + '"]');
  const form = panelAbout.querySelector('[data-edit-form="' + field + '"]');
  const row = panelAbout.querySelector('[data-field="' + field + '"]');
  if (!trigger || !form || !row) return;

  const existingTimer = editAnimationTimers.get(field);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    editAnimationTimers.delete(field);
  }

  form.classList.remove('is-visible');
  const hideTimer = window.setTimeout(() => {
    form.hidden = true;
    trigger.hidden = false;
    row.classList.remove('is-editing');
    editAnimationTimers.delete(field);
  }, 380);
  editAnimationTimers.set(field, hideTimer);

  if (activeEditField === field) activeEditField = null;
};

const openInlineEdit = (field) => {
  if (isSavingInlineEdit) return;
  if (activeEditField && activeEditField !== field) {
    closeInlineEdit(activeEditField);
  }

  const trigger = panelAbout.querySelector('[data-edit-trigger="' + field + '"]');
  const form = panelAbout.querySelector('[data-edit-form="' + field + '"]');
  const row = panelAbout.querySelector('[data-field="' + field + '"]');
  if (!trigger || !form || !row) return;

  const existingTimer = editAnimationTimers.get(field);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    editAnimationTimers.delete(field);
  }

  const { valueInput, dayInput, monthInput, yearInput } = getFieldFormControls(field, form);

  if (field === 'date_of_birth') {
    const parts = (profileState.date_of_birth || '').split('-');
    if (dayInput) dayInput.value = parts[2] ? String(Number(parts[2])) : '';
    if (monthInput) monthInput.value = parts[1] || '';
    if (yearInput) yearInput.value = parts[0] || '';
  } else if (field === 'gender' && valueInput) {
    valueInput.value = profileState.gender && profileState.gender !== '-' ? profileState.gender : 'Prefer not to say';
  } else if (valueInput) {
    valueInput.value = profileState[field] && profileState[field] !== '-' ? profileState[field] : '';
  }

  trigger.hidden = true;
  form.hidden = false;
  row.classList.add('is-editing');

  requestAnimationFrame(() => {
    form.classList.add('is-visible');
    const focusTarget = dayInput || valueInput;
    if (!focusTarget) return;
    focusTarget.focus();
    if (typeof focusTarget.select === 'function' && focusTarget.type !== 'date') focusTarget.select();
  });

  activeEditField = field;
};

const setInlineEditBusy = (busy) => {
  isSavingInlineEdit = busy;
  editTriggers.forEach((button) => {
    button.disabled = busy;
  });
  editForms.forEach((form) => {
    const field = form.getAttribute('data-edit-form');
    if (!field) return;
    const { valueInput, dayInput, monthInput, yearInput } = getFieldFormControls(field, form);
    if (valueInput) valueInput.disabled = busy;
    if (dayInput) dayInput.disabled = busy;
    if (monthInput) monthInput.disabled = busy;
    if (yearInput) yearInput.disabled = busy;
    const submit = form.querySelector('button[type="submit"]');
    const cancel = form.querySelector('[data-edit-cancel]');
    if (submit) submit.disabled = busy;
    if (cancel) cancel.disabled = busy;
  });
};

const saveInlineEdit = async (field, value) => {
  setInlineEditBusy(true);
  showMessage('Updating profile...');

  try {
    const response = await fetch(API_BASE + '/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ field, value }),
      signal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to update profile');

    const profile = result.profile || {};
    profileState.name = profile.name || '-';
    profileState.email = profile.email || '-';
    profileState.date_of_birth = profile.date_of_birth || '';
    profileState.gender = profile.gender || '-';
    profileState.user_type = profile.user_type || 'Administrator';

    hydrateAboutSection();
    closeInlineEdit(field);
    showMessage('Profile updated.');
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to update profile', { type: 'error', inline: true });
  } finally {
    setInlineEditBusy(false);
  }
};

tabAbout.addEventListener('click', () => switchTab(true), { signal });
tabSecurity.addEventListener('click', () => switchTab(false), { signal });
tabAbout.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    switchTab(false);
    focusTab(tabSecurity);
  }
}, { signal });
tabSecurity.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    switchTab(true);
    focusTab(tabAbout);
  }
}, { signal });

openPasswordForm.addEventListener('click', () => {
  if (profilePage.classList.contains('is-loading')) return;

  const shouldOpen = passwordForm.hidden;
  passwordForm.hidden = !shouldOpen;
  openPasswordForm.textContent = shouldOpen ? 'Close password form' : 'Change password';
}, { signal });

editTriggers.forEach((button) => {
  button.addEventListener('click', () => {
    const field = button.getAttribute('data-edit-trigger');
    if (!field) return;
    openInlineEdit(field);
  }, { signal });
});

editCancels.forEach((button) => {
  button.addEventListener('click', () => {
    const field = button.getAttribute('data-edit-cancel');
    if (!field) return;
    closeInlineEdit(field);
  }, { signal });
});

editForms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSavingInlineEdit) return;

    const field = form.getAttribute('data-edit-form');
    if (!field) return;

    const { valueInput, dayInput, monthInput, yearInput } = getFieldFormControls(field, form);

    if (field === 'date_of_birth') {
      const day = String(dayInput?.value || '').trim();
      const month = String(monthInput?.value || '').trim();
      const year = String(yearInput?.value || '').trim();
      if (!day || !month || !year) {
        showMessage('Enter day, month, and year for date of birth.', { type: 'error', inline: true });
        return;
      }

      const dobValue = year.padStart(4, '0') + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
      const parsedDob = new Date(dobValue);
      if (Number.isNaN(parsedDob.getTime()) || parsedDob.toISOString().slice(0, 10) !== dobValue) {
        showMessage('Enter a valid date of birth.', { type: 'error', inline: true });
        return;
      }

      await saveInlineEdit(field, dobValue);
      return;
    }

    if (!valueInput) return;
    await saveInlineEdit(field, String(valueInput.value || '').trim());
  }, { signal });
});

const setUploadProgress = (value, label) => {
  if (!uploadProgressWrap || !uploadProgressBar || !uploadProgressText) return;
  uploadProgressWrap.hidden = false;
  uploadProgressBar.value = value;
  uploadProgressText.textContent = label;
};

const setUploadBusyState = (busy) => {
  isUploadingImage = busy;
  imageUploadInput.disabled = busy;
  changeImageButton.disabled = busy;
  viewImageButton.disabled = busy;
};

const openImagePreview = (src) => {
  if (!src || isUploadingImage) return;
  imageBigPreview.src = src;
  if (!imageViewModal.open) imageViewModal.showModal();

  if (imageModalCloseTimer) {
    window.clearTimeout(imageModalCloseTimer);
    imageModalCloseTimer = null;
  }
  imageViewModal.classList.remove('is-closing');
  requestAnimationFrame(() => {
    imageViewModal.classList.add('is-open');
  });
};

const closeImagePreview = () => {
  if (!imageViewModal.open) return;
  imageViewModal.classList.remove('is-open');
  imageViewModal.classList.add('is-closing');

  if (imageModalCloseTimer) window.clearTimeout(imageModalCloseTimer);
  imageModalCloseTimer = window.setTimeout(() => {
    imageViewModal.classList.remove('is-closing');
    imageViewModal.close();
    imageModalCloseTimer = null;
  }, 460);
};

const closeImageMenu = (animated = true) => {
  if (imageActionMenu.hidden) return;

  if (imageMenuCloseTimer) {
    window.clearTimeout(imageMenuCloseTimer);
    imageMenuCloseTimer = null;
  }

  if (!animated) {
    imageActionMenu.classList.remove('is-open', 'is-closing');
    imageActionMenu.hidden = true;
    return;
  }

  imageActionMenu.classList.remove('is-open');
  imageActionMenu.classList.add('is-closing');
  imageMenuCloseTimer = window.setTimeout(() => {
    imageActionMenu.hidden = true;
    imageActionMenu.classList.remove('is-closing');
    imageMenuCloseTimer = null;
  }, 400);
};

const openImageMenu = (imageType, anchor) => {
  if (isUploadingImage) return;
  currentImageType = imageType;
  const available = hasImage[imageType];

  viewImageButton.hidden = !available;
  changeImageButton.textContent = available
    ? (imageType === 'avatar' ? 'Change avatar' : 'Change cover')
    : 'Upload picture';

  const anchorRect = anchor.getBoundingClientRect();
  const heroRect = coverPanel.closest('.profile-hero').getBoundingClientRect();
  imageActionMenu.style.top = (anchorRect.bottom - heroRect.top + 6) + 'px';
  imageActionMenu.style.left = Math.max(8, anchorRect.right - heroRect.left - 180) + 'px';
  imageActionMenu.hidden = false;
  imageActionMenu.classList.remove('is-closing');
  requestAnimationFrame(() => imageActionMenu.classList.add('is-open'));
};

const setImageLoadingState = (imageType, loading) => {
  const panel = imageType === 'avatar' ? avatarPanel : coverPanel;
  const image = imageType === 'avatar' ? avatarImage : coverImage;
  panel.classList.toggle('is-loading-media', loading);
  if (loading) image.classList.remove('is-ready');
};

const refreshImages = () => {
  const stamp = Date.now();
  setImageLoadingState('avatar', true);
  setImageLoadingState('cover', true);
  avatarImage.src = API_BASE + '/profile/image/avatar?t=' + stamp;
  coverImage.src = API_BASE + '/profile/image/cover?t=' + stamp;
};

avatarImage.addEventListener('load', () => {
  hasImage.avatar = true;
  avatarImage.hidden = false;
  avatarFallback.hidden = true;
  setImageLoadingState('avatar', false);
  requestAnimationFrame(() => avatarImage.classList.add('is-ready'));
}, { signal });
avatarImage.addEventListener('error', () => {
  hasImage.avatar = false;
  avatarImage.hidden = true;
  avatarFallback.hidden = false;
  setImageLoadingState('avatar', false);
  avatarImage.classList.remove('is-ready');
}, { signal });
coverImage.addEventListener('load', () => {
  hasImage.cover = true;
  coverImage.hidden = false;
  setImageLoadingState('cover', false);
  requestAnimationFrame(() => coverImage.classList.add('is-ready'));
}, { signal });
coverImage.addEventListener('error', () => {
  hasImage.cover = false;
  coverImage.hidden = true;
  setImageLoadingState('cover', false);
  coverImage.classList.remove('is-ready');
}, { signal });

avatarAction.addEventListener('click', (event) => {
  event.stopPropagation();
  openImageMenu('avatar', avatarAction);
}, { signal });
coverAction.addEventListener('click', (event) => {
  event.stopPropagation();
  openImageMenu('cover', coverAction);
}, { signal });

viewImageButton.addEventListener('click', () => {
  if (isUploadingImage || !hasImage[currentImageType]) return;
  closeImageMenu();
  openImagePreview(currentImageType === 'avatar' ? avatarImage.src : coverImage.src);
}, { signal });

changeImageButton.addEventListener('click', () => {
  if (isUploadingImage) return;
  imageUploadInput.value = '';
  imageUploadInput.click();
}, { signal });

avatarPanel.addEventListener('click', (event) => {
  if (avatarAction.contains(event.target)) return;
  if (!hasImage.avatar || isUploadingImage) return;
  openImagePreview(avatarImage.src);
}, { signal });
coverPanel.addEventListener('click', (event) => {
  if (coverAction.contains(event.target)) return;
  if (!hasImage.cover || isUploadingImage) return;
  openImagePreview(coverImage.src);
}, { signal });

closeViewModal.addEventListener('click', closeImagePreview, { signal });
imageViewModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeImagePreview();
}, { signal });
imageViewModal.addEventListener('click', (event) => {
  if (event.target === imageViewModal) closeImagePreview();
}, { signal });

document.addEventListener('click', (event) => {
  if (!imageActionMenu.hidden && !imageActionMenu.contains(event.target) && event.target !== avatarAction && event.target !== coverAction && !avatarAction.contains(event.target) && !coverAction.contains(event.target)) {
    closeImageMenu();
  }
}, { signal });

window.addEventListener('resize', () => closeImageMenu(false), { signal });
window.addEventListener('resize', () => {
  updateTabIndicator(tabAbout.classList.contains('is-active') ? tabAbout : tabSecurity);
}, { signal });

imageUploadInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setUploadBusyState(true);
    setUploadProgress(10, 'Preparing image...');
    showMessage('Compressing image...');
    const imageData = await compressImageFile(file, currentImageType === 'avatar' ? 420 : 1280, 0.5);
    setUploadProgress(55, 'Compression done. Uploading...');
    showMessage('Uploading image...');

    const response = await fetch(API_BASE + '/profile/image', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ imageType: currentImageType, imageData }),
      signal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Upload failed');

    if (currentImageType === 'avatar') {
      const avatarVersion = String(result.key || Date.now());
      window.localStorage.setItem(avatarVersionStorageKey, avatarVersion);
      window.dispatchEvent(new CustomEvent('freeducation:avatar-updated', { detail: { version: avatarVersion } }));
    }

    setUploadProgress(100, 'Upload complete. Refreshing preview...');
    showMessage('Image updated.');
    refreshImages();
    window.setTimeout(() => {
      closeImageMenu();
      resetUploadUi();
    }, 480);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to upload image', { type: 'error', inline: true });
  } finally {
    setUploadBusyState(false);
  }
}, { signal });

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(passwordForm));
  showMessage('Updating password...');

  try {
    const response = await fetch(API_BASE + '/change-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to update password');
    showMessage('Password updated successfully.');
    passwordForm.reset();
    passwordForm.hidden = true;
    openPasswordForm.textContent = 'Change password';
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to update password', { type: 'error', inline: true });
  }
}, { signal });

const loadProfile = async () => {
  setPageLoading(true);
  try {
    const response = await fetch(API_BASE + '/profile', { signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load profile');
    const profile = data.profile || {};

    profileState.name = profile.name || '-';
    profileState.email = profile.email || '-';
    profileState.date_of_birth = profile.date_of_birth || '';
    profileState.gender = profile.gender || '-';
    profileState.user_type = profile.user_type || 'Administrator';

    hydrateAboutSection();
    switchTab(true);
    refreshImages();
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to load profile', { type: 'error', inline: true });
  } finally {
    setPageLoading(false);
  }
};

setPageLoading(true);
clearInlineMessage();
loadProfile();
resetUploadUi();
})();
`;
}
