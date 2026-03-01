export function usersScriptBootstrap(userIdLiteral) {
  return `
(() => {
const usersTableBody = document.getElementById('rows');
const addUserForm = document.getElementById('addUserForm');
const usersMsg = document.getElementById('usersMsg');
const userSearch = document.getElementById('userSearch');
const addUserPanel = document.getElementById('addUserPanel');
const toggleAddUser = document.getElementById('toggleAddUser');
const deleteDialog = document.getElementById('deleteUserDialog');
const deleteCancelButton = document.getElementById('deleteUserCancel');
const deleteConfirmButton = document.getElementById('deleteUserConfirm');
const deleteSummary = document.getElementById('deleteUserSummary');
const usersCard = document.querySelector('.users-card');
const logoutButton = document.getElementById('logout');
const CURRENT_USER_ID = ${userIdLiteral};

let allUsers = [];
let deleteTarget = null;
let lastTrigger = null;

if (!usersTableBody || !addUserForm || !usersMsg || !userSearch || !addUserPanel || !toggleAddUser || !deleteDialog || !deleteCancelButton || !deleteConfirmButton || !deleteSummary || !usersCard) {
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
        const isCurrent = Number(user.id) === CURRENT_USER_ID;
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
`;
}
