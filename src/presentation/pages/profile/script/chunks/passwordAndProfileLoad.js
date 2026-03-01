export const PROFILE_SCRIPT_PASSWORD_AND_PROFILE_LOAD = `
if (!PROFILE_READ_ONLY && passwordForm && openPasswordForm) {
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
}

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
    profileState.user_type = profile.user_type || 'User';

    hydrateAboutSection();
    refreshImages();
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to load profile', { type: 'error', inline: true });
  } finally {
    setPageLoading(false);
    switchTab(requestedProfileTab);
  }
};

setPageLoading(true);
clearInlineMessage();
loadProfile();
resetUploadUi();
if (activeTabKey === 'posts') ensureMyPostsLoaded();
`;
