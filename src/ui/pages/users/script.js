export function usersScript(adminId = 0) {
  return `
(() => {
const usersTableBody = document.getElementById('rows');
const addUserForm = document.getElementById('addUserForm');
const usersMsg = document.getElementById('usersMsg');
const logoutButton = document.getElementById('logout');
const userSearch = document.getElementById('userSearch');
const addUserPanel = document.getElementById('addUserPanel');
const toggleAddUser = document.getElementById('toggleAddUser');
const deleteDialog = document.getElementById('deleteUserDialog');
const deleteCancelButton = document.getElementById('deleteUserCancel');
const deleteConfirmButton = document.getElementById('deleteUserConfirm');
const deleteSummary = document.getElementById('deleteUserSummary');
const usersCard = document.querySelector('.users-card');
const CURRENT_ADMIN_ID = ${Number(adminId) || 0};

let allUsers = [];
let deleteTarget = null;
let lastTrigger = null;

if (!usersTableBody || !addUserForm || !usersMsg || !logoutButton || !userSearch || !addUserPanel || !toggleAddUser || !deleteDialog || !deleteCancelButton || !deleteConfirmButton || !deleteSummary || !usersCard) {
  return;
}

const controller = new AbortController();
const { signal } = controller;
if (typeof window.__registerCleanup === 'function') {
  window.__registerCleanup(() => controller.abort());
}

const showMessage = (message, isError = false) => {
  usersMsg.textContent = message;
  usersMsg.style.color = isError ? '#ff9ca1' : '';
  if (typeof window.__showAppStatus === 'function' && message) {
    window.__showAppStatus(message, isError ? 'error' : 'success');
  }
};

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const normalize = (value) => String(value || '').toLowerCase();

const filteredUsers = () => {
  const query = normalize(userSearch.value).trim();
  if (!query) return allUsers;

  return allUsers.filter((user) => {
    const type = user.user_type || 'Administrator';
    return normalize(user.name).includes(query) || normalize(user.email).includes(query) || normalize(type).includes(query);
  });
};

const renderRows = () => {
  const users = filteredUsers();
  usersTableBody.innerHTML = users.length
    ? users
      .map((user) => {
        const type = user.user_type || 'Administrator';
        const isCurrent = Number(user.id) === CURRENT_ADMIN_ID;
        const actionButtonLabel = isCurrent ? 'Current account' : 'Delete';
        return '<tr><td>' + escapeHtml(user.name) + '</td><td>' + escapeHtml(user.email) + '</td><td>' + escapeHtml(type) + '</td><td>' + new Date(user.created_at).toLocaleString() + '</td><td><button type="button" class="users-delete-btn" data-delete-user-id="' + user.id + '" data-delete-user-name="' + escapeHtml(user.name) + '" data-delete-user-email="' + escapeHtml(user.email) + '" aria-label="Delete user ' + escapeHtml(user.name) + '"' + (isCurrent ? ' disabled aria-disabled="true" title="You cannot delete the account you are currently using"' : '') + '>' + actionButtonLabel + '</button></td></tr>';
      })
      .join('')
    : '<tr><td colspan="5">No users found.</td></tr>';
};

const setLoading = (loading) => {
  usersCard.classList.toggle('is-loading', loading);
  if (loading) {
    usersTableBody.innerHTML = '<tr><td colspan="5">Loading users...</td></tr>';
  }
};

const renderUsers = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/admin/users', { signal });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to load users');
    }
    allUsers = Array.isArray(data.users) ? data.users : [];
    renderRows();
  } catch (error) {
    if (error?.name === 'AbortError') return;
    allUsers = [];
    usersTableBody.innerHTML = '<tr><td colspan="5">Unable to load users.</td></tr>';
    showMessage(error?.message || 'Unable to load users.', true);
  } finally {
    setLoading(false);
  }
};

const setPanelOpen = (open) => {
  addUserPanel.classList.toggle('is-open', open);
  toggleAddUser.classList.toggle('is-open', open);
  addUserPanel.setAttribute('aria-hidden', String(!open));
  toggleAddUser.setAttribute('aria-expanded', String(open));
  toggleAddUser.setAttribute('aria-label', open ? 'Close add user form' : 'Open add user form');
  if (open) {
    requestAnimationFrame(() => addUserForm.querySelector('input[name="name"]')?.focus());
  }
};

const setDeleteDialogOpen = (open, triggerButton = null) => {
  deleteDialog.classList.toggle('is-open', open);
  deleteDialog.setAttribute('aria-hidden', String(!open));
  if (open) {
    lastTrigger = triggerButton || document.activeElement;
    requestAnimationFrame(() => deleteConfirmButton.focus());
  } else {
    deleteTarget = null;
    deleteDialog.classList.remove('is-submitting');
    deleteConfirmButton.disabled = false;
    deleteConfirmButton.textContent = 'Delete user';
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }
};

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
    const response = await fetch('/api/admin/users/' + encodeURIComponent(deleteTarget.id), { method: 'DELETE', signal });
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
    const response = await fetch('/api/admin/users', {
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

logoutButton.addEventListener('click', async () => {
  showMessage('Signing out...');
  await fetch('/api/logout', { method: 'POST', signal });
  if (window.__appNavigate) { window.__appNavigate('/admin/login'); } else { location.href='/admin/login'; }
}, { signal });

renderUsers();
})();
`;
}
