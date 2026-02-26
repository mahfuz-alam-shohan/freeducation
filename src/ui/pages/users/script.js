export const USERS_SCRIPT = `
const usersTableBody = document.getElementById('rows');
const addUserForm = document.getElementById('addUserForm');
const usersMsg = document.getElementById('usersMsg');
const logoutButton = document.getElementById('logout');
const userSearch = document.getElementById('userSearch');
const addUserPanel = document.getElementById('addUserPanel');
const toggleAddUser = document.getElementById('toggleAddUser');
const closeAddUser = document.getElementById('closeAddUser');

let allUsers = [];

const showMessage = (message, isError = false) => {
  usersMsg.textContent = message;
  usersMsg.style.color = isError ? '#ff9ca1' : '';
};

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
        return '<tr><td>' + user.name + '</td><td>' + user.email + '</td><td>' + type + '</td><td>' + new Date(user.created_at).toLocaleString() + '</td></tr>';
      })
      .join('')
    : '<tr><td colspan="4">No users found.</td></tr>';
};

const renderUsers = async () => {
  const response = await fetch('/api/admin/users');
  const data = await response.json();
  allUsers = Array.isArray(data.users) ? data.users : [];
  renderRows();
};

const setPanelOpen = (open) => {
  addUserPanel.classList.toggle('is-open', open);
  addUserPanel.setAttribute('aria-hidden', String(!open));
  toggleAddUser.setAttribute('aria-expanded', String(open));
  if (open) {
    requestAnimationFrame(() => addUserForm.querySelector('input[name="name"]')?.focus());
  }
};

toggleAddUser.addEventListener('click', () => {
  const open = !addUserPanel.classList.contains('is-open');
  setPanelOpen(open);
});

closeAddUser.addEventListener('click', () => setPanelOpen(false));

userSearch.addEventListener('input', renderRows);

addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Saving...');

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
    });

    const result = await response.json();
    if (!response.ok) {
      showMessage(result.error || 'Request failed', true);
      return;
    }

    showMessage('User added.');
    addUserForm.reset();
    await renderUsers();
    setPanelOpen(false);
  } catch (error) {
    showMessage(error?.message || 'Network error', true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add user';
    }
  }
});

logoutButton.onclick = async () => {
  showMessage('Signing out...');
  await fetch('/api/logout', { method: 'POST' });
  location.href = '/admin/login';
};

renderUsers();
`;
