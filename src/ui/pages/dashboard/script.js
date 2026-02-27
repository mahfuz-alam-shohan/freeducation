export const DASHBOARD_SCRIPT = `
(() => {
const totalAdmins = document.getElementById('totalAdmins');
const activeSessions = document.getElementById('activeSessions');
const dashboardGrid = document.querySelector('.dash-grid');
const logoutButton = document.getElementById('logout');
const dashboardCards = Array.from(document.querySelectorAll('.dash-card'));

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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (dashboardCards.length && !reducedMotion.matches) {
  dashboardCards.forEach((card) => {
    card.classList.add('is-interactive');

    const spring = {
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      active: false,
      raf: 0,
    };

    const updateCard = () => {
      const stiffness = 0.12;
      const damping = 0.82;

      spring.vx += (spring.tx - spring.x) * stiffness;
      spring.vy += (spring.ty - spring.y) * stiffness;
      spring.vx *= damping;
      spring.vy *= damping;
      spring.x += spring.vx;
      spring.y += spring.vy;

      card.style.setProperty('--mx', `${spring.x * 0.35}px`);
      card.style.setProperty('--my', `${spring.y * 0.35}px`);
      card.style.setProperty('--ry', `${spring.x * 0.8}deg`);
      card.style.setProperty('--rx', `${-spring.y * 0.8}deg`);

      if (!spring.active && Math.abs(spring.x) < 0.03 && Math.abs(spring.y) < 0.03 && Math.abs(spring.vx) < 0.03 && Math.abs(spring.vy) < 0.03) {
        spring.raf = 0;
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
        card.style.removeProperty('--glow');
        return;
      }

      spring.raf = window.requestAnimationFrame(updateCard);
    };

    const start = () => {
      if (!spring.raf) spring.raf = window.requestAnimationFrame(updateCard);
    };

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      spring.tx = (px - 0.5) * 5;
      spring.ty = (py - 0.5) * 5;
      spring.active = true;
      card.style.setProperty('--gx', `${(px * 100).toFixed(2)}%`);
      card.style.setProperty('--gy', `${(py * 100).toFixed(2)}%`);
      card.style.setProperty('--glow', '1');
      start();
    }, { signal: controller.signal });

    card.addEventListener('pointerleave', () => {
      spring.tx = 0;
      spring.ty = 0;
      spring.active = false;
      card.style.setProperty('--glow', '0');
      start();
    }, { signal: controller.signal });
  });
}
})();
`;
