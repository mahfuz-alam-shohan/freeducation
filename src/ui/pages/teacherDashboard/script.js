export const TEACHER_DASHBOARD_SCRIPT = `
(() => {
  const logoutButton = document.getElementById('logout');
  if (!logoutButton) return;
  const controller = new AbortController();
  const { signal } = controller;
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }
  logoutButton.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST', signal });
    if (window.__appNavigate) window.__appNavigate('/admin/login');
    else window.location.href = '/admin/login';
  }, { signal });
})();
`;
