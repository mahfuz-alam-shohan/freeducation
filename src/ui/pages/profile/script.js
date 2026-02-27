import { imageCompressionModule } from "./imageCompression.js";

export function profileScript() {
  return `
(() => {
${imageCompressionModule()}
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

let currentImageType = 'avatar';
const hasImage = { avatar: false, cover: false };
let isUploadingImage = false;
let tabSwitchTimer = null;
let activeEditField = null;
let isSavingInlineEdit = false;

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

const showMessage = (message, isError = false) => {
  profileMsg.textContent = message;
  profileMsg.style.color = isError ? '#ff9ca1' : '';
  if (typeof window.__showAppStatus === 'function' && message) {
    window.__showAppStatus(message, isError ? 'error' : 'success');
  }
};

const switchTab = (showAbout) => {
  if (profilePage.classList.contains('is-loading')) return;

  const incomingPanel = showAbout ? panelAbout : panelSecurity;
  const outgoingPanel = showAbout ? panelSecurity : panelAbout;

  tabAbout.classList.toggle('is-active', showAbout);
  tabSecurity.classList.toggle('is-active', !showAbout);
  tabAbout.setAttribute('aria-selected', String(showAbout));
  tabSecurity.setAttribute('aria-selected', String(!showAbout));
  profileTabIndicator.style.setProperty('--tab-index', showAbout ? '0' : '1');

  outgoingPanel.classList.remove('is-active');
  outgoingPanel.classList.add('is-leaving');
  incomingPanel.hidden = false;
  incomingPanel.classList.add('is-active');

  if (tabSwitchTimer) window.clearTimeout(tabSwitchTimer);
  tabSwitchTimer = window.setTimeout(() => {
    outgoingPanel.hidden = true;
    outgoingPanel.classList.remove('is-leaving');
    tabSwitchTimer = null;
  }, 150);

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

const closeInlineEdit = (field) => {
  const trigger = panelAbout.querySelector('[data-edit-trigger="' + field + '"]');
  const form = panelAbout.querySelector('[data-edit-form="' + field + '"]');
  const row = panelAbout.querySelector('[data-field="' + field + '"]');
  if (!trigger || !form || !row) return;

  form.hidden = true;
  form.classList.remove('is-visible');
  trigger.hidden = false;
  row.classList.remove('is-editing');
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

  const input = form.elements.value;
  if (!input) return;

  if (field === 'date_of_birth') {
    input.value = profileState.date_of_birth || '';
  } else if (field === 'gender') {
    input.value = profileState.gender && profileState.gender !== '-' ? profileState.gender : 'Prefer not to say';
  } else {
    input.value = profileState[field] && profileState[field] !== '-' ? profileState[field] : '';
  }

  trigger.hidden = true;
  form.hidden = false;
  row.classList.add('is-editing');

  requestAnimationFrame(() => {
    form.classList.add('is-visible');
    input.focus();
    if (typeof input.select === 'function' && input.type !== 'date') input.select();
  });

  activeEditField = field;
};

const setInlineEditBusy = (busy) => {
  isSavingInlineEdit = busy;
  editTriggers.forEach((button) => {
    button.disabled = busy;
  });
  editForms.forEach((form) => {
    const input = form.elements.value;
    if (input) input.disabled = busy;
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
    const response = await fetch('/api/admin/profile', {
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
    showMessage(error?.message || 'Unable to update profile', true);
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
    const input = form.elements.value;
    if (!field || !input) return;
    await saveInlineEdit(field, String(input.value || '').trim());
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

const closeImageMenu = () => {
  imageActionMenu.hidden = true;
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
};

const refreshImages = () => {
  const stamp = Date.now();
  avatarImage.src = '/api/admin/profile/image/avatar?t=' + stamp;
  coverImage.src = '/api/admin/profile/image/cover?t=' + stamp;
};

avatarImage.addEventListener('load', () => {
  hasImage.avatar = true;
  avatarImage.hidden = false;
  avatarFallback.hidden = true;
}, { signal });
avatarImage.addEventListener('error', () => {
  hasImage.avatar = false;
  avatarImage.hidden = true;
  avatarFallback.hidden = false;
}, { signal });
coverImage.addEventListener('load', () => {
  hasImage.cover = true;
  coverImage.hidden = false;
}, { signal });
coverImage.addEventListener('error', () => {
  hasImage.cover = false;
  coverImage.hidden = true;
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
  imageBigPreview.src = currentImageType === 'avatar' ? avatarImage.src : coverImage.src;
  closeImageMenu();
  imageViewModal.showModal();
}, { signal });

changeImageButton.addEventListener('click', () => {
  if (isUploadingImage) return;
  imageUploadInput.value = '';
  imageUploadInput.click();
}, { signal });

avatarPanel.addEventListener('click', () => {
  if (!hasImage.avatar || isUploadingImage) return;
  imageBigPreview.src = avatarImage.src;
  imageViewModal.showModal();
}, { signal });
coverPanel.addEventListener('click', () => {
  if (!hasImage.cover || isUploadingImage) return;
  imageBigPreview.src = coverImage.src;
  imageViewModal.showModal();
}, { signal });

closeViewModal.addEventListener('click', () => imageViewModal.close(), { signal });

document.addEventListener('click', (event) => {
  if (!imageActionMenu.hidden && !imageActionMenu.contains(event.target) && event.target !== avatarAction && event.target !== coverAction && !avatarAction.contains(event.target) && !coverAction.contains(event.target)) {
    closeImageMenu();
  }
}, { signal });

window.addEventListener('resize', closeImageMenu, { signal });

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

    const response = await fetch('/api/admin/profile/image', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ imageType: currentImageType, imageData }),
      signal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Upload failed');

    setUploadProgress(100, 'Upload complete. Refreshing preview...');
    showMessage('Image updated.');
    refreshImages();
    window.setTimeout(() => {
      closeImageMenu();
      resetUploadUi();
    }, 280);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to upload image', true);
  } finally {
    setUploadBusyState(false);
  }
}, { signal });

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(passwordForm));
  showMessage('Updating password...');

  try {
    const response = await fetch('/api/admin/change-password', {
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
    showMessage(error?.message || 'Unable to update password', true);
  }
}, { signal });

const loadProfile = async () => {
  setPageLoading(true);
  try {
    const response = await fetch('/api/admin/profile', { signal });
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
    showMessage(error?.message || 'Unable to load profile', true);
  } finally {
    setPageLoading(false);
  }
};

setPageLoading(true);
loadProfile();
resetUploadUi();
})();
`;
}
