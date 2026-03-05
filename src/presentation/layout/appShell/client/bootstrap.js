export const APP_SHELL_CLIENT_BOOTSTRAP = `
(() => {
  const listenerController = new AbortController();
  const { signal } = listenerController;
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => listenerController.abort());
  }

  const body = document.body;
  const openButton = document.getElementById('appMenuOpen');
  const mobileMenuButton = document.getElementById('appMobileMenu');
  const closeButton = document.getElementById('appMenuClose');
  const overlay = document.getElementById('appMenuOverlay');
  const sidebar = document.getElementById('appSidebar');
  const notificationToggle = document.getElementById('appNotificationsToggle');
  const notificationOverlay = document.getElementById('appNotificationsOverlay');
  const notificationPanel = document.getElementById('appNotificationsPanel');
  const notificationClose = document.getElementById('appNotificationsClose');
  const notificationList = document.getElementById('appNotificationsList');
  const notificationLoading = document.getElementById('appNotificationsLoading');
  const notificationEmpty = document.getElementById('appNotificationsEmpty');
  const avatarButton = document.getElementById('appAvatar');
  const avatarImage = document.getElementById('appAvatarImage');
  const avatarFallback = document.getElementById('appAvatarFallback');
  const profilePanel = document.getElementById('appProfilePanel');
  const profileLogout = document.getElementById('profileLogout');
  const mainLogout = document.getElementById('logout');
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeToggleText');
  const themeChip = document.getElementById('themeToggleChip');
  const brandHome = document.getElementById('appBrandHome');
  const statusToast = document.getElementById('appStatusToast');
  const shellRoot = document.querySelector('.app-shell');

  const themeStorageKey = 'freeducation-theme';
  const avatarVersionStorageKey = 'freeducation-avatar-version';
  const canAnimateMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let themeSwitching = false;
  let activeAvatarVersion = '';
  let statusTimer;
  let navigationClearTimer = 0;
  let notificationsLoading = false;
  let notificationsLoadedAt = 0;
  let notificationsCache = [];

  const resolveApiBase = () => {
    const path = window.location.pathname || '';
    if (path.startsWith('/teacher') || path.startsWith('/api/teacher')) return '/api/teacher';
    if (path.startsWith('/student') || path.startsWith('/api/student')) return '/api/student';
    return '/api/workspace';
  };

  const apiBase = (shellRoot?.dataset?.apiBase || '').trim() || resolveApiBase();
  const sessionEntryKey = 'freeducation-session-entered';

  try {
    if (window.sessionStorage.getItem(sessionEntryKey)) {
      body.classList.remove('app-first-load');
    } else {
      body.classList.add('app-first-load');
      window.sessionStorage.setItem(sessionEntryKey, '1');
      window.setTimeout(() => body.classList.remove('app-first-load'), 650);
    }
  } catch {
    body.classList.add('app-first-load');
    window.setTimeout(() => body.classList.remove('app-first-load'), 650);
  }

  const applyTheme = (theme) => {
    const finalTheme = theme === 'light' ? 'light' : 'dark';
    body.setAttribute('data-theme', finalTheme);
    if (themeText) themeText.textContent = finalTheme === 'light' ? 'Light mode on' : 'Dark mode on';
    if (themeChip) themeChip.textContent = finalTheme === 'light' ? 'Light' : 'Dark';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', finalTheme === 'light' ? 'true' : 'false');
    return finalTheme;
  };

  const setThemeState = (state = 'idle') => {
    if (!themeToggle) return;
    const nextState = state === 'switching' ? 'switching' : 'idle';
    themeToggle.dataset.themeState = nextState;
    themeToggle.setAttribute('aria-busy', nextState === 'switching' ? 'true' : 'false');
  };

  const waitForThemeMotion = () => new Promise((resolve) => {
    if (!canAnimateMotion) {
      resolve();
      return;
    }
    window.setTimeout(resolve, 240);
  });

  const switchTheme = async (targetTheme) => {
    if (themeSwitching) return;
    const nextTheme = targetTheme === 'light' ? 'light' : 'dark';
    const currentTheme = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    if (currentTheme === nextTheme) return;

    themeSwitching = true;
    setThemeState('switching');

    const runUpdate = () => {
      applyTheme(nextTheme);
      window.localStorage.setItem(themeStorageKey, nextTheme);
    };

    try {
      if (document.startViewTransition && canAnimateMotion) {
        await document.startViewTransition(() => runUpdate()).finished.catch(() => {});
      } else {
        runUpdate();
      }
      await waitForThemeMotion();
    } finally {
      themeSwitching = false;
      setThemeState('idle');
    }
  };

  const setAvatarState = (state = 'fallback') => {
    if (!avatarButton) return;
    const nextState = state === 'image' || state === 'loading' ? state : 'fallback';
    avatarButton.classList.toggle('is-loading', nextState === 'loading');
    avatarButton.setAttribute('aria-busy', nextState === 'loading' ? 'true' : 'false');
    if (avatarImage) avatarImage.hidden = nextState !== 'image';
    if (avatarFallback) avatarFallback.hidden = nextState === 'image';
  };

  const loadAvatar = (version = '', persistVersion = false) => {
    if (!avatarImage || !avatarButton) return;
    const nextVersion = String(version || '').trim();
    activeAvatarVersion = nextVersion;
    if (!nextVersion) {
      avatarImage.removeAttribute('src');
      setAvatarState('fallback');
      return;
    }

    if (persistVersion) window.localStorage.setItem(avatarVersionStorageKey, nextVersion);
    avatarButton.dataset.avatarVersion = nextVersion;
    setAvatarState('loading');
    avatarImage.src = apiBase + '/profile/image/avatar?v=' + encodeURIComponent(nextVersion);
  };

  const setNotificationsOpen = (open) => {
    const nextOpen = Boolean(open);
    body.classList.toggle('notifications-open', nextOpen);
    if (notificationToggle) notificationToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    if (notificationOverlay) notificationOverlay.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    if (notificationPanel) notificationPanel.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
  };

  const setMenu = (open) => {
    const nextOpen = Boolean(open);
    body.classList.toggle('menu-open', nextOpen);
    if (openButton) openButton.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    if (overlay) overlay.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    if (nextOpen) {
      setProfile(false);
      setNotificationsOpen(false);
    }
  };

  const setProfile = (open) => {
    body.classList.toggle('profile-open', open);
    if (avatarButton) avatarButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (profilePanel) profilePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      setMenu(false);
      setNotificationsOpen(false);
    }
  };

  const clearNavigating = () => {
    body.classList.remove('app-navigating');
    if (navigationClearTimer) {
      window.clearTimeout(navigationClearTimer);
      navigationClearTimer = 0;
    }
  };

  const setNavigating = (autoClearMs = 0) => {
    body.classList.add('app-navigating');
    if (navigationClearTimer) {
      window.clearTimeout(navigationClearTimer);
      navigationClearTimer = 0;
    }

    if (autoClearMs > 0) {
      navigationClearTimer = window.setTimeout(() => {
        navigationClearTimer = 0;
        body.classList.remove('app-navigating');
      }, autoClearMs);
    }
  };
`;
