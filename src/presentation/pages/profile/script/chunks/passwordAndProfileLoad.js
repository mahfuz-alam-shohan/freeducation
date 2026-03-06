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

if (!PROFILE_READ_ONLY && profileLogoutButton) {
  profileLogoutButton.addEventListener('click', async () => {
    if (profileLogoutButton.disabled) return;
    profileLogoutButton.disabled = true;
    showMessage('Logging out...');

    try {
      await fetch('/api/logout', { method: 'POST', signal });
      if (window.__appNavigate) window.__appNavigate('/login');
      else window.location.href = '/login';
    } catch (error) {
      if (error?.name === 'AbortError') return;
      profileLogoutButton.disabled = false;
      showMessage(error?.message || 'Unable to logout', { type: 'error', inline: true });
    }
  }, { signal });
}

const shouldEnableMateAction = Boolean(
  PROFILE_READ_ONLY
  && PROFILE_CAN_INTERACT
  && PROFILE_VIEWER_ID > 0
  && PROFILE_USER_ID > 0
  && PROFILE_VIEWER_ID !== PROFILE_USER_ID
  && profileMateActionWrap instanceof HTMLElement
);

const renderMateActionUi = () => {
  if (!(profileMateActionWrap instanceof HTMLElement)) return;
  if (!shouldEnableMateAction) {
    profileMateActionWrap.hidden = true;
    return;
  }

  profileMateActionWrap.hidden = false;
  if (profileMateAddButton instanceof HTMLButtonElement) {
    profileMateAddButton.hidden = true;
    profileMateAddButton.disabled = profileMateBusy;
    profileMateAddButton.textContent = 'Add Mate';
  }
  if (profileMateIncomingActions instanceof HTMLElement) {
    profileMateIncomingActions.hidden = true;
  }
  if (profileMateOutgoingActions instanceof HTMLElement) {
    profileMateOutgoingActions.hidden = true;
  }
  if (profileMateConnectedActions instanceof HTMLElement) {
    profileMateConnectedActions.hidden = true;
  }
  if (profileMateAcceptButton instanceof HTMLButtonElement) profileMateAcceptButton.disabled = profileMateBusy;
  if (profileMateDeclineButton instanceof HTMLButtonElement) profileMateDeclineButton.disabled = profileMateBusy;
  if (profileMateCancelButton instanceof HTMLButtonElement) profileMateCancelButton.disabled = profileMateBusy;
  if (profileMateFollowToggleButton instanceof HTMLButtonElement) profileMateFollowToggleButton.disabled = profileMateBusy;
  if (profileMateRemoveButton instanceof HTMLButtonElement) profileMateRemoveButton.disabled = profileMateBusy;
  if (profileMateStateLabel instanceof HTMLElement) {
    profileMateStateLabel.hidden = true;
    profileMateStateLabel.textContent = '';
  }

  const status = String(profileMateStatus?.status || 'none').toLowerCase();
  if (status === 'pending_incoming') {
    if (profileMateIncomingActions instanceof HTMLElement) profileMateIncomingActions.hidden = false;
    if (profileMateStateLabel instanceof HTMLElement) {
      profileMateStateLabel.hidden = false;
      profileMateStateLabel.textContent = 'Requested you to be mates';
    }
    return;
  }

  if (status === 'pending_outgoing') {
    if (profileMateOutgoingActions instanceof HTMLElement) profileMateOutgoingActions.hidden = false;
    if (profileMateStateLabel instanceof HTMLElement) {
      profileMateStateLabel.hidden = false;
      profileMateStateLabel.textContent = 'Mate request sent';
    }
    return;
  }

  if (status === 'mates') {
    if (profileMateConnectedActions instanceof HTMLElement) profileMateConnectedActions.hidden = false;
    if (profileMateFollowToggleButton instanceof HTMLButtonElement) {
      profileMateFollowToggleButton.textContent = profileMateStatus?.followingByViewer ? 'Unfollow Mate' : 'Follow Mate';
      profileMateFollowToggleButton.setAttribute('data-follow-next', profileMateStatus?.followingByViewer ? '0' : '1');
    }
    if (profileMateStateLabel instanceof HTMLElement) {
      profileMateStateLabel.hidden = false;
      profileMateStateLabel.textContent = profileMateStatus?.followingByViewer ? 'You are mates - following updates' : 'You are mates - updates unfollowed';
    }
    return;
  }

  if (profileMateAddButton instanceof HTMLButtonElement) {
    profileMateAddButton.hidden = false;
  }
};

const loadMateStatus = async () => {
  if (!shouldEnableMateAction) return;
  profileMateBusy = false;
  renderMateActionUi();
  try {
    const response = await fetch('/api/social/mates/status/' + encodeURIComponent(String(PROFILE_USER_ID)), {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to load mate status');
    profileMateStatus = {
      status: String(payload?.status || 'none'),
      requestId: Number.parseInt(String(payload?.requestId || 0), 10) || 0,
      relationId: Number.parseInt(String(payload?.relationId || payload?.requestId || 0), 10) || 0,
      followingByViewer: Boolean(payload?.followingByViewer),
    };
  } catch (error) {
    if (error?.name === 'AbortError') return;
    profileMateStatus = { status: 'none', requestId: 0, relationId: 0, followingByViewer: false };
    showMessage(error?.message || 'Unable to load mate status', { type: 'error', inline: true });
  } finally {
    profileMateBusy = false;
    renderMateActionUi();
  }
};

const sendMateRequest = async () => {
  if (!shouldEnableMateAction || profileMateBusy) return;
  profileMateBusy = true;
  renderMateActionUi();
  showMessage('Sending mate request...');
  try {
    const response = await fetch('/api/social/mates/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ targetUserId: PROFILE_USER_ID }),
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to send mate request');
    profileMateStatus = {
      status: String(payload?.status || 'pending_outgoing'),
      requestId: Number.parseInt(String(payload?.requestId || 0), 10) || 0,
      relationId: Number.parseInt(String(payload?.relationId || payload?.requestId || 0), 10) || 0,
      followingByViewer: Boolean(payload?.followingByViewer),
    };
    if (profileMateStatus.status === 'mates') {
      showMessage('You are already mates.');
    } else if (profileMateStatus.status === 'pending_incoming') {
      showMessage('This user already sent you a mate request.');
    } else {
      showMessage('Mate request sent.');
    }
  } catch (error) {
    if (error?.name !== 'AbortError') {
      showMessage(error?.message || 'Unable to send mate request', { type: 'error', inline: true });
    }
  } finally {
    profileMateBusy = false;
    renderMateActionUi();
  }
};

const respondMateRequest = async (action) => {
  if (!shouldEnableMateAction || profileMateBusy) return;
  const safeAction = String(action || '').trim().toLowerCase();
  if (!['accept', 'decline'].includes(safeAction)) return;
  const safeRequestId = Number.parseInt(String(profileMateStatus?.requestId || 0), 10);
  if (!Number.isInteger(safeRequestId) || safeRequestId <= 0) return;

  profileMateBusy = true;
  renderMateActionUi();
  showMessage(safeAction === 'accept' ? 'Accepting mate request...' : 'Declining mate request...');
  try {
    const response = await fetch('/api/social/mates/requests/' + encodeURIComponent(String(safeRequestId)) + '/respond', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: safeAction }),
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to update mate request');
    profileMateStatus = {
      status: String(payload?.status || (safeAction === 'accept' ? 'mates' : 'none')),
      requestId: Number.parseInt(String(payload?.requestId || 0), 10) || 0,
      relationId: Number.parseInt(String(payload?.relationId || payload?.requestId || 0), 10) || 0,
      followingByViewer: Boolean(payload?.followingByViewer),
    };
    showMessage(safeAction === 'accept' ? 'You are now mates.' : 'Mate request declined.');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      showMessage(error?.message || 'Unable to update mate request', { type: 'error', inline: true });
    }
  } finally {
    profileMateBusy = false;
    renderMateActionUi();
  }
};

const cancelMateRequest = async () => {
  if (!shouldEnableMateAction || profileMateBusy) return;
  const safeRequestId = Number.parseInt(String(profileMateStatus?.requestId || 0), 10);
  if (!Number.isInteger(safeRequestId) || safeRequestId <= 0) return;
  profileMateBusy = true;
  renderMateActionUi();
  showMessage('Cancelling mate request...');
  try {
    const response = await fetch('/api/social/mates/requests/' + encodeURIComponent(String(safeRequestId)) + '/cancel', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to cancel mate request');
    profileMateStatus = {
      status: String(payload?.status || 'none'),
      requestId: 0,
      relationId: 0,
      followingByViewer: false,
    };
    showMessage('Mate request cancelled.');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      showMessage(error?.message || 'Unable to cancel mate request', { type: 'error', inline: true });
    }
  } finally {
    profileMateBusy = false;
    renderMateActionUi();
  }
};

const toggleMateFollow = async (follow) => {
  if (!shouldEnableMateAction || profileMateBusy) return;
  const safeRelationId = Number.parseInt(String(profileMateStatus?.relationId || 0), 10);
  if (!Number.isInteger(safeRelationId) || safeRelationId <= 0) return;
  profileMateBusy = true;
  renderMateActionUi();
  const nextFollow = Boolean(follow);
  showMessage(nextFollow ? 'Following mate updates...' : 'Unfollowing mate updates...');
  try {
    const response = await fetch('/api/social/mates/' + encodeURIComponent(String(safeRelationId)) + '/follow', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ follow: nextFollow }),
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to update mate follow');
    profileMateStatus = {
      status: String(payload?.status || 'mates'),
      requestId: Number.parseInt(String(profileMateStatus?.requestId || 0), 10) || 0,
      relationId: safeRelationId,
      followingByViewer: Boolean(payload?.followingByViewer),
    };
    showMessage(profileMateStatus.followingByViewer ? 'Now following mate updates.' : 'Mate updates unfollowed.');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      showMessage(error?.message || 'Unable to update mate follow', { type: 'error', inline: true });
    }
  } finally {
    profileMateBusy = false;
    renderMateActionUi();
  }
};

const removeMateAction = async () => {
  if (!shouldEnableMateAction || profileMateBusy) return;
  const safeRelationId = Number.parseInt(String(profileMateStatus?.relationId || 0), 10);
  if (!Number.isInteger(safeRelationId) || safeRelationId <= 0) return;
  if (!window.confirm('Remove this mate?')) return;
  profileMateBusy = true;
  renderMateActionUi();
  showMessage('Removing mate...');
  try {
    const response = await fetch('/api/social/mates/' + encodeURIComponent(String(safeRelationId)) + '/remove', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to remove mate');
    profileMateStatus = {
      status: String(payload?.status || 'none'),
      requestId: 0,
      relationId: 0,
      followingByViewer: false,
    };
    showMessage('Mate removed.');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      showMessage(error?.message || 'Unable to remove mate', { type: 'error', inline: true });
    }
  } finally {
    profileMateBusy = false;
    renderMateActionUi();
  }
};

if (shouldEnableMateAction) {
  if (profileMateAddButton instanceof HTMLButtonElement) {
    profileMateAddButton.addEventListener('click', () => {
      sendMateRequest().catch(() => {});
    }, { signal });
  }
  if (profileMateAcceptButton instanceof HTMLButtonElement) {
    profileMateAcceptButton.addEventListener('click', () => {
      respondMateRequest('accept').catch(() => {});
    }, { signal });
  }
  if (profileMateDeclineButton instanceof HTMLButtonElement) {
    profileMateDeclineButton.addEventListener('click', () => {
      respondMateRequest('decline').catch(() => {});
    }, { signal });
  }
  if (profileMateCancelButton instanceof HTMLButtonElement) {
    profileMateCancelButton.addEventListener('click', () => {
      cancelMateRequest().catch(() => {});
    }, { signal });
  }
  if (profileMateFollowToggleButton instanceof HTMLButtonElement) {
    profileMateFollowToggleButton.addEventListener('click', () => {
      const nextFollow = String(profileMateFollowToggleButton.getAttribute('data-follow-next') || '').trim() === '1';
      toggleMateFollow(nextFollow).catch(() => {});
    }, { signal });
  }
  if (profileMateRemoveButton instanceof HTMLButtonElement) {
    profileMateRemoveButton.addEventListener('click', () => {
      removeMateAction().catch(() => {});
    }, { signal });
  }
  renderMateActionUi();
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
if (shouldEnableMateAction) loadMateStatus();
resetUploadUi();
if (activeTabKey === 'posts') ensureMyPostsLoaded();
`;
