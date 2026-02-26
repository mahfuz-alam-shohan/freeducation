export const USERS_SCRIPT = `
const usersTableBody = document.getElementById('rows');
const addUserForm = document.getElementById('addUserForm');
const usersMsg = document.getElementById('usersMsg');
const logoutButton = document.getElementById('logout');

const showMessage = (message, isError = false) => {
  usersMsg.textContent = message;
  usersMsg.style.color = isError ? '#ff9ca1' : '';
};

const renderUsers = async () => {
  const response = await fetch('/api/admin/users');
  const data = await response.json();
  usersTableBody.innerHTML = data.users
    .map((user) => '<tr><td>' + user.name + '</td><td>' + user.email + '</td><td>' + new Date(user.created_at).toLocaleString() + '</td></tr>')
    .join('');
};

addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('');

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

  showMessage('Administrator added.');
  addUserForm.reset();
  await renderUsers();
});

logoutButton.onclick = async () => {
  await fetch('/api/logout', { method: 'POST' });
  location.href = '/admin/login';
};

renderUsers();
`;
