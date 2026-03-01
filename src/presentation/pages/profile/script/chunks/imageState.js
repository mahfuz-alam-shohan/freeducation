export const PROFILE_SCRIPT_IMAGE_STATE = `
const setUploadProgress = (value, label, imageType = currentImageType) => {
  const isAvatar = imageType === 'avatar';
  const activeWrap = isAvatar ? avatarUploadProgress : coverUploadProgress;
  const activeText = isAvatar ? avatarUploadText : coverUploadText;
  const activeBar = isAvatar ? avatarUploadBar : coverUploadBar;
  const otherWrap = isAvatar ? coverUploadProgress : avatarUploadProgress;

  if (otherWrap) otherWrap.hidden = true;
  if (!activeWrap || !activeText || !activeBar) return;

  activeWrap.hidden = false;
  activeText.textContent = label;
  activeBar.style.width = Math.max(0, Math.min(100, value)) + '%';
};

const setUploadBusyState = (busy) => {
  isUploadingImage = busy;
  if (imageUploadInput) imageUploadInput.disabled = busy;
  if (changeImageButton) changeImageButton.disabled = busy;
  if (viewImageButton) viewImageButton.disabled = busy;
};

const openImagePreview = (src) => {
  if (!src || isUploadingImage || !imageBigPreview || !imageViewModal) return;
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
  if (!imageViewModal) return;
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
  if (!imageActionMenu) return;
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
  if (!imageActionMenu || !viewImageButton || !changeImageButton || !coverPanel || !anchor) return;
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
  if (!panel || !image) return;
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
`;
