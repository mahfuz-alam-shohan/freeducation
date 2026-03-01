export const APP_SHELL_CLIENT_NOTIFICATIONS = `
  const escapeNotificationHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const formatNotificationTime = (iso) => {
    if (!iso) return 'Just now';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return 'Just now';
    return parsed.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const profileInitial = (name) => {
    const normalized = String(name || '').trim();
    if (!normalized) return 'U';
    return normalized.slice(0, 1).toUpperCase();
  };

  const resolveNotificationHref = (entry) => {
    const explicit = String(entry?.url || '').trim();
    if (explicit) return explicit;
    const postId = Number.parseInt(String(entry?.postId || 0), 10);
    if (Number.isInteger(postId) && postId > 0) return '/social/post/' + postId;
    return '/social';
  };

  const renderNotificationItem = (entry) => {
    const actorName = String(entry?.actor?.name || 'User');
    const actorAvatarUrl = String(entry?.actor?.avatarUrl || '').trim();
    const href = resolveNotificationHref(entry);
    const text = String(entry?.message || '').trim() || (actorName + ' interacted with your post');
    const preview = String(entry?.preview || '').trim();

    const avatarMarkup = actorAvatarUrl
      ? '<span class="app-notification-avatar has-image"><img src="' + escapeNotificationHtml(actorAvatarUrl) + '" alt="' + escapeNotificationHtml(actorName) + ' avatar" loading="lazy"></span>'
      : '<span class="app-notification-avatar">' + escapeNotificationHtml(profileInitial(actorName)) + '</span>';

    return '<a class="app-notification-item" href="' + escapeNotificationHtml(href) + '">' +
      avatarMarkup +
      '<span class="app-notification-body">' +
        '<span class="app-notification-text">' + escapeNotificationHtml(text) + '</span>' +
        (preview ? '<span class="app-notification-preview">' + escapeNotificationHtml(preview) + '</span>' : '') +
        '<span class="app-notification-time">' + escapeNotificationHtml(formatNotificationTime(entry?.createdAt || '')) + '</span>' +
      '</span>' +
    '</a>';
  };

  const setNotificationLoadingState = (loading) => {
    if (notificationLoading) notificationLoading.hidden = !loading;
  };

  const renderNotifications = (items) => {
    if (!(notificationList instanceof HTMLElement)) return;
    const list = Array.isArray(items) ? items : [];
    if (!list.length) {
      notificationList.innerHTML = '';
      if (notificationEmpty) notificationEmpty.hidden = false;
      return;
    }
    if (notificationEmpty) notificationEmpty.hidden = true;
    notificationList.innerHTML = list.map((entry) => renderNotificationItem(entry)).join('');
  };

  const loadNotifications = async (options = {}) => {
    if (!(notificationPanel instanceof HTMLElement)) return [];
    const force = Boolean(options.force);
    const now = Date.now();
    if (!force && notificationsLoading) return notificationsCache;
    if (!force && notificationsCache.length && notificationsLoadedAt > 0 && (now - notificationsLoadedAt) < 12000) {
      renderNotifications(notificationsCache);
      return notificationsCache;
    }

    notificationsLoading = true;
    setNotificationLoadingState(true);
    try {
      const response = await fetch('/api/social/notifications?limit=40', {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to load notifications');
      notificationsCache = Array.isArray(payload?.notifications) ? payload.notifications : [];
      notificationsLoadedAt = Date.now();
      renderNotifications(notificationsCache);
      return notificationsCache;
    } catch (error) {
      if (error?.name === 'AbortError') return notificationsCache;
      notificationsCache = [];
      notificationsLoadedAt = 0;
      if (notificationEmpty) notificationEmpty.hidden = true;
      if (notificationList) {
        notificationList.innerHTML = '<p class="app-notifications-error">' + escapeNotificationHtml(error instanceof Error ? error.message : 'Unable to load notifications') + '</p>';
      }
      return [];
    } finally {
      notificationsLoading = false;
      setNotificationLoadingState(false);
    }
  };

  if (notificationToggle && notificationPanel) {
    notificationToggle.addEventListener('click', async (event) => {
      event.preventDefault();
      const nextOpen = !body.classList.contains('notifications-open');
      setNotificationsOpen(nextOpen);
      if (!nextOpen) return;
      await loadNotifications();
    }, { signal });
  }

  if (notificationClose) {
    notificationClose.addEventListener('click', () => setNotificationsOpen(false), { signal });
  }

  if (notificationOverlay) {
    notificationOverlay.addEventListener('click', () => setNotificationsOpen(false), { signal });
  }

  if (notificationList) {
    notificationList.addEventListener('click', () => {
      setNotificationsOpen(false);
    }, { signal });
  }

  window.addEventListener('focus', () => {
    if (!body.classList.contains('notifications-open')) return;
    loadNotifications({ force: true }).catch(() => {});
  }, { signal });
`;
