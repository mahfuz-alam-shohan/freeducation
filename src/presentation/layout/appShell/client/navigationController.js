export const APP_SHELL_CLIENT_NAVIGATION = `
  if (!overlay || !sidebar || (!openButton && !mobileMenuButton)) {
    clearNavigating();
    return;
  }

  if (openButton) {
    openButton.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')), { signal });
  }
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')), { signal });
  }
  if (closeButton) closeButton.addEventListener('click', () => setMenu(false), { signal });
  overlay.addEventListener('click', () => setMenu(false), { signal });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      setProfile(false);
      setNotificationsOpen(false);
    }
  }, { signal });

  const desktopMedia = window.matchMedia('(min-width: 900px)');
  if (typeof desktopMedia.addEventListener === 'function') {
    desktopMedia.addEventListener('change', () => setMenu(false), { signal });
  } else if (typeof desktopMedia.addListener === 'function') {
    desktopMedia.addListener(() => setMenu(false));
  }

  if (avatarButton) {
    avatarButton.addEventListener('click', () => {
      const avatarHref = String(avatarButton.getAttribute('data-avatar-href') || '').trim();
      if (avatarHref) {
        setMenu(false);
        setProfile(false);
        setNotificationsOpen(false);
        setNavigating(1800);
        if (window.__appNavigate) window.__appNavigate(avatarHref);
        else window.location.href = avatarHref;
        return;
      }

      if (profilePanel) {
        setProfile(!body.classList.contains('profile-open'));
      }
    }, { signal });

    if (profilePanel) {
      document.addEventListener('click', (event) => {
        if (!body.classList.contains('profile-open')) return;
        if (profilePanel.contains(event.target) || avatarButton.contains(event.target)) return;
        setProfile(false);
      }, { signal });
    }
  }

  if (mainLogout) {
    mainLogout.addEventListener('click', async () => {
      setProfile(false);
      setNavigating(1800);
      await fetch('/api/logout', { method: 'POST', signal });
      if (window.__appNavigate) window.__appNavigate('/');
      else window.location.href = '/';
    }, { signal });
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => setNavigating(1800), { signal });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) return;
    setMenu(false);
    setProfile(false);
    setNotificationsOpen(false);
    setNavigating();
  }, { signal });

  window.addEventListener('pageshow', clearNavigating, { signal });

  clearNavigating();
  setMenu(false);
  setProfile(false);
  setNotificationsOpen(false);
})();
`;
