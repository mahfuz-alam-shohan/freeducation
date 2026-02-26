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
const logoutButton = document.getElementById('logout');

const imageUploadModal = document.getElementById('imageUploadModal');
const imageViewModal = document.getElementById('imageViewModal');
const imageModalTitle = document.getElementById('imageModalTitle');
const imageModalPreview = document.getElementById('imageModalPreview');
const imageModalEmpty = document.getElementById('imageModalEmpty');
const imageUploadInput = document.getElementById('imageUploadInput');
const closeImageModal = document.getElementById('closeImageModal');
const viewImageButton = document.getElementById('viewImageButton');
const closeViewModal = document.getElementById('closeViewModal');
const imageBigPreview = document.getElementById('imageBigPreview');

const avatarPanel = document.getElementById('avatarPanel');
const coverPanel = document.getElementById('coverPanel');
const avatarImage = document.getElementById('avatarImage');
const coverImage = document.getElementById('coverImage');
const avatarFallback = document.getElementById('avatarFallback');

const aboutEmail = document.getElementById('aboutEmail');
const aboutDob = document.getElementById('aboutDob');
const aboutGender = document.getElementById('aboutGender');
const aboutRole = document.getElementById('aboutRole');

if (!tabAbout || !tabSecurity || !panelAbout || !panelSecurity || !openPasswordForm || !passwordForm || !profileMsg || !logoutButton) return;

const controller = new AbortController();
const { signal } = controller;
if (typeof window.__registerCleanup === 'function') window.__registerCleanup(() => controller.abort());

let currentImageType = 'avatar';
const hasImage = { avatar: false, cover: false };

const showMessage = (message, isError = false) => {
  profileMsg.textContent = message;
  profileMsg.style.color = isError ? '#ff9ca1' : '';
  if (typeof window.__showAppStatus === 'function' && message) {
    window.__showAppStatus(message, isError ? 'error' : 'success');
  }
};

const switchTab = (showAbout) => {
  tabAbout.classList.toggle('is-active', showAbout);
  tabSecurity.classList.toggle('is-active', !showAbout);
  tabAbout.setAttribute('aria-selected', String(showAbout));
  tabSecurity.setAttribute('aria-selected', String(!showAbout));
  panelAbout.classList.toggle('is-active', showAbout);
  panelSecurity.classList.toggle('is-active', !showAbout);
  panelAbout.hidden = !showAbout;
  panelSecurity.hidden = showAbout;
};

tabAbout.addEventListener('click', () => switchTab(true), { signal });
tabSecurity.addEventListener('click', () => switchTab(false), { signal });

openPasswordForm.addEventListener('click', () => {
  const shouldOpen = passwordForm.hidden;
  passwordForm.hidden = !shouldOpen;
  openPasswordForm.textContent = shouldOpen ? 'Close password form' : 'Change password';
}, { signal });

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
  currentImageType = imageType;
  imageModalTitle.textContent = imageType === 'avatar' ? 'Profile photo' : 'Cover photo';
  const imageSrc = imageType === 'avatar' ? avatarImage.src : coverImage.src;
  const available = hasImage[imageType];
  imageModalPreview.hidden = !available;
  imageModalEmpty.hidden = available;
  viewImageButton.hidden = !available;
  if (available) {
    imageModalPreview.src = imageSrc;
  }
  imageUploadInput.value = '';
  imageUploadModal.showModal();
};

avatarPanel.addEventListener('click', () => openImageModal('avatar'), { signal });
coverPanel.addEventListener('click', () => openImageModal('cover'), { signal });
avatarPanel.addEventListener('keydown', (event) => { if (event.key === 'Enter') openImageModal('avatar'); }, { signal });
coverPanel.addEventListener('keydown', (event) => { if (event.key === 'Enter') openImageModal('cover'); }, { signal });

closeImageModal.addEventListener('click', () => imageUploadModal.close(), { signal });
closeViewModal.addEventListener('click', () => imageViewModal.close(), { signal });
viewImageButton.addEventListener('click', () => {
  const source = currentImageType === 'avatar' ? avatarImage.src : coverImage.src;
  imageBigPreview.src = source;
  imageViewModal.showModal();
}, { signal });

imageUploadInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    showMessage('Compressing image...');
    const imageData = await compressImageFile(file, currentImageType === 'avatar' ? 420 : 1280, 0.5);
    showMessage('Uploading image...');

    const response = await fetch('/api/admin/profile/image', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ imageType: currentImageType, imageData }),
      signal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Upload failed');

    showMessage('Image updated.');
    imageUploadModal.close();
    refreshImages();
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to upload image', true);
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
  try {
    const response = await fetch('/api/admin/profile', { signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load profile');
    const profile = data.profile || {};

    aboutEmail.textContent = profile.email || '-';
    aboutDob.textContent = formatDob(profile.date_of_birth);
    aboutGender.textContent = profile.gender || '-';
    aboutRole.textContent = profile.user_type || 'Administrator';
    refreshImages();
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to load profile', true);
  }
};

loadProfile();
})();
`;
}
