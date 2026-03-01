export const USERS_SCRIPT_API = `
const renderUsers = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/workspace/users', { signal });
    if (response.status === 401) {
      showMessage('Session expired. Please sign in again.', true);
      if (window.__appNavigate) {
        window.__appNavigate('/login');
      } else {
        location.href = '/login';
      }
      return;
    }

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
`;
