export const PROFILE_SCRIPT_IMAGE_EVENTS = `
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

if (!PROFILE_READ_ONLY && avatarAction && coverAction) {
  avatarAction.addEventListener('click', (event) => {
    event.stopPropagation();
    openImageMenu('avatar', avatarAction);
  }, { signal });
  coverAction.addEventListener('click', (event) => {
    event.stopPropagation();
    openImageMenu('cover', coverAction);
  }, { signal });
}

if (!PROFILE_READ_ONLY && viewImageButton && changeImageButton && imageUploadInput) {
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
}

avatarPanel.addEventListener('click', (event) => {
  if (avatarAction && avatarAction.contains(event.target)) return;
  if (!hasImage.avatar || isUploadingImage) return;
  openImagePreview(avatarImage.src);
}, { signal });
coverPanel.addEventListener('click', (event) => {
  if (coverAction && coverAction.contains(event.target)) return;
  if (!hasImage.cover || isUploadingImage) return;
  openImagePreview(coverImage.src);
}, { signal });

if (closeViewModal) closeViewModal.addEventListener('click', closeImagePreview, { signal });
if (imageViewModal) {
  imageViewModal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeImagePreview();
  }, { signal });
  imageViewModal.addEventListener('click', (event) => {
    if (event.target === imageViewModal) closeImagePreview();
  }, { signal });
}

if (!PROFILE_READ_ONLY && imageActionMenu && avatarAction && coverAction) {
  document.addEventListener('click', (event) => {
    if (!imageActionMenu.hidden && !imageActionMenu.contains(event.target) && event.target !== avatarAction && event.target !== coverAction && !avatarAction.contains(event.target) && !coverAction.contains(event.target)) {
      closeImageMenu();
    }
  }, { signal });
}

window.addEventListener('resize', () => closeImageMenu(false), { signal });
window.addEventListener('resize', () => {
  const activeTab = document.querySelector('.profile-tab.is-active');
  updateTabIndicator(activeTab);
}, { signal });

if (!PROFILE_READ_ONLY && imageUploadInput) {
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
}
`;
