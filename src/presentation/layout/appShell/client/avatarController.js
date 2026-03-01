export const APP_SHELL_CLIENT_AVATAR = `
  if (avatarImage) {
    avatarImage.addEventListener('load', () => {
      const currentVersion = (avatarButton?.dataset.avatarVersion || '').trim();
      if (!currentVersion || currentVersion !== activeAvatarVersion) return;
      setAvatarState('image');
    }, { signal });

    avatarImage.addEventListener('error', () => setAvatarState('fallback'), { signal });
  }

  const initialAvatarVersion = (avatarButton?.dataset.avatarVersion || '').trim() || (window.localStorage.getItem(avatarVersionStorageKey) || '').trim();
  if (initialAvatarVersion) {
    loadAvatar(initialAvatarVersion, true);
  } else {
    setAvatarState('fallback');
  }

  window.addEventListener('freeducation:avatar-updated', (event) => {
    const nextVersion = String(event?.detail?.version || Date.now());
    loadAvatar(nextVersion, true);
  }, { signal });

  window.addEventListener('storage', (event) => {
    if (event.key !== avatarVersionStorageKey) return;
    const nextVersion = String(event.newValue || '').trim();
    if (!nextVersion) {
      loadAvatar('', false);
      return;
    }
    loadAvatar(nextVersion, false);
  }, { signal });
`;
