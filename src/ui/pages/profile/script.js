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

const imageUploadModal = document.getElementById('imageUploadModal');
const imageViewModal = document.getElementById('imageViewModal');
const imageModalTitle = document.getElementById('imageModalTitle');
const imageModalPreview = document.getElementById('imageModalPreview');
const imageModalEmpty = document.getElementById('imageModalEmpty');
const imageUploadInput = document.getElementById('imageUploadInput');
const uploadProgressWrap = document.getElementById('uploadProgressWrap');
const uploadProgressText = document.getElementById('uploadProgressText');
const uploadProgressBar = document.getElementById('uploadProgressBar');
const closeImageModal = document.getElementById('closeImageModal');
const viewImageButton = document.getElementById('viewImageButton');
const closeViewModal = document.getElementById('closeViewModal');
const imageBigPreview = document.getElementById('imageBigPreview');

const avatarPanel = document.getElementById('avatarPanel');
const coverPanel = document.getElementById('coverPanel');
const avatarAction = document.getElementById('avatarAction');
const coverAction = document.getElementById('coverAction');
const avatarImage = document.getElementById('avatarImage');
const coverImage = document.getElementById('coverImage');
const avatarFallback = document.getElementById('avatarFallback');

const aboutEmail = document.getElementById('aboutEmail');
const aboutDob = document.getElementById('aboutDob');
const aboutGender = document.getElementById('aboutGender');
const aboutRole = document.getElementById('aboutRole');

if (!tabAbout || !tabSecurity || !panelAbout || !panelSecurity || !openPasswordForm || !passwordForm || !profileMsg || !imageUploadModal || !imageViewModal || !avatarPanel || !coverPanel || !avatarAction || !coverAction || !imageUploadInput || !profilePage || !profilePageLoader) return;

const controller = new AbortController();
const { signal } = controller;
if (typeof window.__registerCleanup === 'function') window.__registerCleanup(() => controller.abort());

let currentImageType = 'avatar';
const hasImage = { avatar: false, cover: false };
let isUploadingImage = false;

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
  if (viewImageButton) viewImageButton.hidden = true;
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

  tabAbout.classList.toggle('is-active', showAbout);
  tabSecurity.classList.toggle('is-active', !showAbout);
  tabAbout.setAttribute('aria-selected', String(showAbout));
  tabSecurity.setAttribute('aria-selected', String(!showAbout));
  panelAbout.classList.toggle('is-active', showAbout);
  panelSecurity.classList.toggle('is-active', !showAbout);
  panelAbout.hidden = !showAbout;
  panelSecurity.hidden = showAbout;
  if (showAbout) {
    passwordForm.hidden = true;
    openPasswordForm.textContent = 'Change password';
  }
};

const focusTab = (tab) => {
  if (tab && typeof tab.focus === 'function') tab.focus();
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

const setUploadProgress = (value, label) => {
  if (!uploadProgressWrap || !uploadProgressBar || !uploadProgressText) return;
  uploadProgressWrap.hidden = false;
  uploadProgressBar.value = value;
  uploadProgressText.textContent = label;
};

const setUploadBusyState = (busy) => {
  isUploadingImage = busy;
  imageUploadInput.disabled = busy;
  closeImageModal.disabled = busy;
  viewImageButton.disabled = busy;
};

const formatDob = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
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

const openImageModal = (imageType) => {
  if (isUploadingImage) return;
  if (imageViewModal.open) imageViewModal.close();
  currentImageType = imageType;
  imageModalTitle.textContent = imageType === 'avatar' ? 'Profile photo' : 'Cover photo';
  const imageSrc = imageType === 'avatar' ? avatarImage.src : coverImage.src;
  const available = hasImage[imageType];
  imageModalPreview.hidden = !available;
  imageModalEmpty.hidden = available;
  viewImageButton.hidden = true;
  if (available) imageModalPreview.src = imageSrc;
  imageUploadInput.value = '';
  setUploadBusyState(false);
  resetUploadUi();
  imageUploadModal.showModal();
};

avatarAction.addEventListener('click', (event) => {
  event.stopPropagation();
  openImageModal('avatar');
}, { signal });
coverAction.addEventListener('click', (event) => {
  event.stopPropagation();
  openImageModal('cover');
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

closeImageModal.addEventListener('click', () => {
  if (!isUploadingImage) imageUploadModal.close();
}, { signal });
closeViewModal.addEventListener('click', () => imageViewModal.close(), { signal });
viewImageButton.addEventListener('click', () => {
  if (isUploadingImage) return;
  const source = currentImageType === 'avatar' ? avatarImage.src : coverImage.src;
  imageBigPreview.src = source;
  imageUploadModal.close();
  imageViewModal.showModal();
}, { signal });

imageModalPreview.addEventListener('click', () => {
  if (isUploadingImage || imageModalPreview.hidden) return;
  imageBigPreview.src = imageModalPreview.src;
  imageUploadModal.close();
  imageViewModal.showModal();
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
    setTimeout(() => {
      if (imageUploadModal.open) imageUploadModal.close();
    }, 280);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to upload image', true);
  } finally {
    setUploadBusyState(false);
    resetUploadUi();
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

    aboutEmail.textContent = profile.email || '-';
    aboutDob.textContent = formatDob(profile.date_of_birth);
    aboutGender.textContent = profile.gender || '-';
    aboutRole.textContent = profile.user_type || 'Administrator';
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
