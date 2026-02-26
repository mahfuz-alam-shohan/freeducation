export const DASHBOARD_SCRIPT = `
(() => {
const totalAdmins = document.getElementById('totalAdmins');
const activeSessions = document.getElementById('activeSessions');
const dashboardGrid = document.querySelector('.dash-grid');
const logoutButton = document.getElementById('logout');

if (!totalAdmins || !activeSessions || !dashboardGrid) return;

const controller = new AbortController();
if (typeof window.__registerCleanup === 'function') {
  window.__registerCleanup(() => controller.abort());
}

const setLoading = (loading) => {
  dashboardGrid.classList.toggle('is-loading', loading);
  if (loading) {
    totalAdmins.textContent = 'Loading...';
    activeSessions.textContent = 'Loading...';
  }
};

const renderFallback = () => {
  totalAdmins.textContent = '-';
  activeSessions.textContent = '-';
};

setLoading(true);

fetch('/api/admin/overview', { signal: controller.signal })
  .then((response) => response.json())
  .then((data) => {
    totalAdmins.textContent = data.totalAdmins ?? '-';
    activeSessions.textContent = data.activeSessions ?? '-';
  })
  .catch((error) => {
    if (error?.name === 'AbortError') return;
    renderFallback();
  })
  .finally(() => setLoading(false));

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    document.body.classList.add('app-navigating');
    await fetch('/api/logout', { method: 'POST' });
    if (window.__appNavigate) { window.__appNavigate('/admin/login'); } else { location.href = '/admin/login'; }
  }, { signal: controller.signal });
}
})();
`;
