export const USERS_SCRIPT_ACTIONS = `
toggleAddUser.addEventListener('click', (event) => {
  event.preventDefault();
  const open = !addUserPanel.classList.contains('is-open');
  setPanelOpen(open);
}, { signal });

userSearch.addEventListener('input', renderRows, { signal });

usersTableBody.addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-user-id]');
  if (!button || button.disabled) return;
  deleteTarget = {
    id: button.dataset.deleteUserId,
    name: button.dataset.deleteUserName,
    email: button.dataset.deleteUserEmail,
  };
  deleteSummary.textContent = deleteTarget.name + ' (' + deleteTarget.email + ')';
  setDeleteDialogOpen(true, button);
}, { signal });

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && deleteDialog.classList.contains('is-open')) {
    setDeleteDialogOpen(false);
  }
}, { signal });

deleteCancelButton.addEventListener('click', () => setDeleteDialogOpen(false), { signal });

deleteConfirmButton.addEventListener('click', async () => {
  if (!deleteTarget) return;
  showMessage('Deleting user...');
  deleteDialog.classList.add('is-submitting');
  deleteConfirmButton.disabled = true;
  deleteConfirmButton.textContent = 'Deleting...';

  try {
    const response = await fetch('/api/workspace/users/' + encodeURIComponent(deleteTarget.id), { method: 'DELETE', signal });
    const result = await response.json();
    if (!response.ok) {
      showMessage(result.error || 'Unable to delete user', true);
      return;
    }
    showMessage('User deleted successfully.');
    await renderUsers();
    setDeleteDialogOpen(false);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Network error', true);
  } finally {
    deleteDialog.classList.remove('is-submitting');
    deleteConfirmButton.disabled = false;
    deleteConfirmButton.textContent = 'Delete user';
  }
}, { signal });

addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Saving user...');
  addUserForm.classList.add('is-submitting');

  const submitBtn = addUserForm.querySelector('button[type="submit"],button:not([type])');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
  }

  try {
    const payload = Object.fromEntries(new FormData(addUserForm));
    const response = await fetch('/api/workspace/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    const result = await response.json();
    if (!response.ok) {
      showMessage(result.error || 'Request failed', true);
      return;
    }

    showMessage('User added successfully.');
    addUserForm.reset();
    await renderUsers();
    setPanelOpen(false);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Network error', true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add user';
    }
    addUserForm.classList.remove('is-submitting');
  }
}, { signal });

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    showMessage('Signing out...');
    await fetch('/api/logout', { method: 'POST', signal });
    if (window.__appNavigate) {
      window.__appNavigate('/login');
    } else {
      location.href = '/login';
    }
  }, { signal });
}

renderUsers();
})();
`;
