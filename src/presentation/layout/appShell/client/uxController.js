export const APP_SHELL_CLIENT_UX = `
  if (brandHome) {
    const homeHref = brandHome.dataset.home || '/';
    brandHome.addEventListener('click', () => {
      if (window.__appNavigate) window.__appNavigate(homeHref);
      else window.location.href = homeHref;
    }, { signal });
  }

  if (canAnimateMotion && sidebar) {
    const updatePointer = (event, element) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      body.style.setProperty('--pointer-x', Math.max(0, Math.min(100, x)).toFixed(2) + '%');
      body.style.setProperty('--pointer-y', Math.max(0, Math.min(100, y)).toFixed(2) + '%');
    };

    const resetPointer = () => {
      body.style.setProperty('--pointer-x', '50%');
      body.style.setProperty('--pointer-y', '12%');
    };

    sidebar.addEventListener('pointermove', (event) => updatePointer(event, sidebar), { signal });
    sidebar.addEventListener('pointerleave', resetPointer, { signal });
  }

  window.__showAppStatus = (message, kind = 'info', holdMs = 2600) => {
    if (!statusToast) return;
    statusToast.textContent = message || '';
    statusToast.dataset.status = kind;
    statusToast.classList.add('is-visible');
    if (desktopStatusMessage instanceof HTMLElement) {
      desktopStatusMessage.textContent = String(message || 'Ready');
      if (desktopStatusTimer) {
        window.clearTimeout(desktopStatusTimer);
        desktopStatusTimer = undefined;
      }
      if (holdMs > 0) {
        desktopStatusTimer = window.setTimeout(() => {
          desktopStatusTimer = undefined;
          if (desktopStatusMessage instanceof HTMLElement) desktopStatusMessage.textContent = 'Ready';
        }, holdMs);
      }
    }
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => statusToast.classList.remove('is-visible'), holdMs);
  };
`;
