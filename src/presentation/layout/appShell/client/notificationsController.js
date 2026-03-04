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

  let notificationsUnreadCount = 0;
  let notificationsHasUnseen = false;
  let notificationsSeenAt = '';

  const deriveUnreadCount = (items) => {
    const list = Array.isArray(items) ? items : [];
    return list.reduce((total, entry) => total + (entry?.read ? 0 : 1), 0);
  };

  const setNotificationIndicator = (options = {}) => {
    if (!(notificationToggle instanceof HTMLElement)) return;
    const unreadCount = Math.max(0, Number(options?.unreadCount || 0));
    const hasUnseen = Boolean(options?.hasUnseen);
    const hasUnread = unreadCount > 0;
    const unreadLabel = unreadCount > 99 ? '99+' : String(unreadCount);
    notificationsUnreadCount = unreadCount;
    notificationsHasUnseen = hasUnseen;
    notificationToggle.classList.toggle('has-unseen', hasUnseen);
    notificationToggle.classList.toggle('has-unread', hasUnread);
    notificationToggle.dataset.unreadCount = String(unreadCount);
    notificationToggle.dataset.unreadLabel = hasUnread ? unreadLabel : '';
    const label = unreadCount > 0
      ? ('Open notifications (' + unreadCount + ' unread)')
      : 'Open notifications';
    notificationToggle.setAttribute('aria-label', label);
  };

  const renderNotificationItem = (entry) => {
    const actorName = String(entry?.actor?.name || 'User');
    const actorAvatarUrl = String(entry?.actor?.avatarUrl || '').trim();
    const href = resolveNotificationHref(entry);
    const text = String(entry?.message || '').trim() || (actorName + ' interacted with your post');
    const preview = String(entry?.preview || '').trim();
    const notificationId = String(entry?.id || '').trim();
    const isRead = Boolean(entry?.read);

    const avatarMarkup = actorAvatarUrl
      ? '<span class="app-notification-avatar has-image"><img src="' + escapeNotificationHtml(actorAvatarUrl) + '" alt="' + escapeNotificationHtml(actorName) + ' avatar" loading="lazy"></span>'
      : '<span class="app-notification-avatar">' + escapeNotificationHtml(profileInitial(actorName)) + '</span>';

    return '<a class="app-notification-item' + (isRead ? ' is-read' : ' is-unread') + '" data-notification-id="' + escapeNotificationHtml(notificationId) + '" href="' + escapeNotificationHtml(href) + '">' +
      avatarMarkup +
      '<span class="app-notification-body">' +
        '<span class="app-notification-text">' + escapeNotificationHtml(text) + '</span>' +
        (preview ? '<span class="app-notification-preview">' + escapeNotificationHtml(preview) + '</span>' : '') +
        '<span class="app-notification-time">' + escapeNotificationHtml(formatNotificationTime(entry?.createdAt || '')) + '</span>' +
      '</span>' +
      (isRead ? '' : '<span class="app-notification-unread-dot" aria-hidden="true"></span>') +
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

  const applyNotificationPayload = (payload, options = {}) => {
    const shouldRender = options?.render !== false;
    const list = Array.isArray(payload?.notifications) ? payload.notifications : [];
    notificationsCache = list;
    notificationsLoadedAt = Date.now();
    notificationsUnreadCount = Math.max(0, Number(payload?.unreadCount || deriveUnreadCount(list)));
    notificationsHasUnseen = Boolean(payload?.hasUnseen);
    notificationsSeenAt = String(payload?.seenAt || notificationsSeenAt || '');
    setNotificationIndicator({ unreadCount: notificationsUnreadCount, hasUnseen: notificationsHasUnseen });
    if (shouldRender) renderNotifications(notificationsCache);
    return notificationsCache;
  };

  const loadNotifications = async (options = {}) => {
    if (!(notificationPanel instanceof HTMLElement)) return [];
    const force = Boolean(options.force);
    const background = Boolean(options.background);
    const shouldRender = options?.render !== false;
    const now = Date.now();
    if (!force && notificationsLoading) return notificationsCache;
    if (!force && notificationsCache.length && notificationsLoadedAt > 0 && (now - notificationsLoadedAt) < 12000) {
      if (shouldRender) renderNotifications(notificationsCache);
      setNotificationIndicator({ unreadCount: notificationsUnreadCount, hasUnseen: notificationsHasUnseen });
      return notificationsCache;
    }

    notificationsLoading = true;
    if (!background) setNotificationLoadingState(true);
    try {
      const response = await fetch('/api/social/notifications?limit=40', {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to load notifications');
      return applyNotificationPayload(payload, { render: shouldRender });
    } catch (error) {
      if (error?.name === 'AbortError') return notificationsCache;
      notificationsCache = [];
      notificationsLoadedAt = 0;
      notificationsUnreadCount = 0;
      notificationsHasUnseen = false;
      setNotificationIndicator({ unreadCount: 0, hasUnseen: false });
      if (notificationEmpty) notificationEmpty.hidden = true;
      if (shouldRender && notificationList) {
        notificationList.innerHTML = '<p class="app-notifications-error">' + escapeNotificationHtml(error instanceof Error ? error.message : 'Unable to load notifications') + '</p>';
      }
      return [];
    } finally {
      notificationsLoading = false;
      if (!background) setNotificationLoadingState(false);
    }
  };

  const markNotificationsSeen = async () => {
    setNotificationIndicator({ unreadCount: notificationsUnreadCount, hasUnseen: false });
    try {
      const response = await fetch('/api/social/notifications/seen', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
        keepalive: true,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to update notifications');
      notificationsSeenAt = String(payload?.seenAt || notificationsSeenAt || '');
      notificationsHasUnseen = false;
      setNotificationIndicator({ unreadCount: notificationsUnreadCount, hasUnseen: false });
    } catch {
      loadNotifications({
        force: true,
        background: !body.classList.contains('notifications-open'),
        render: body.classList.contains('notifications-open'),
      }).catch(() => {});
    }
  };

  const setNotificationReadInCache = (notificationId) => {
    const safeNotificationId = String(notificationId || '').trim();
    if (!safeNotificationId || !Array.isArray(notificationsCache) || !notificationsCache.length) return false;
    let changed = false;
    notificationsCache = notificationsCache.map((entry) => {
      if (String(entry?.id || '') !== safeNotificationId) return entry;
      if (entry?.read) return entry;
      changed = true;
      return { ...entry, read: true, unread: false };
    });
    if (!changed) return false;
    notificationsUnreadCount = deriveUnreadCount(notificationsCache);
    setNotificationIndicator({ unreadCount: notificationsUnreadCount, hasUnseen: notificationsHasUnseen });
    return true;
  };

  const markNotificationRead = (notificationId) => {
    const safeNotificationId = String(notificationId || '').trim();
    if (!safeNotificationId) return;
    const changed = setNotificationReadInCache(safeNotificationId);
    if (changed && body.classList.contains('notifications-open')) {
      renderNotifications(notificationsCache);
    }
    fetch('/api/social/notifications/read', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: safeNotificationId }),
      keepalive: true,
    }).catch(() => {
      loadNotifications({
        force: true,
        background: !body.classList.contains('notifications-open'),
        render: body.classList.contains('notifications-open'),
      }).catch(() => {});
    });
  };

  if (notificationToggle && notificationPanel) {
    notificationToggle.addEventListener('click', async (event) => {
      event.preventDefault();
      const nextOpen = !body.classList.contains('notifications-open');
      setNotificationsOpen(nextOpen);
      if (!nextOpen) return;
      void markNotificationsSeen();
      await loadNotifications({ force: true, render: true });
    }, { signal });

    loadNotifications({ force: true, background: true, render: false }).catch(() => {});
  }

  if (notificationClose) {
    notificationClose.addEventListener('click', () => setNotificationsOpen(false), { signal });
  }

  if (notificationOverlay) {
    notificationOverlay.addEventListener('click', () => setNotificationsOpen(false), { signal });
  }

  if (notificationList) {
    notificationList.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const item = target.closest('.app-notification-item');
      if (!item) return;
      markNotificationRead(item.getAttribute('data-notification-id'));
      setNotificationsOpen(false);
    }, { signal });
  }

  const refreshNotifications = (options = {}) => {
    loadNotifications({
      force: Boolean(options.force),
      background: !body.classList.contains('notifications-open'),
      render: body.classList.contains('notifications-open'),
    }).catch(() => {});
  };

  window.addEventListener('focus', () => refreshNotifications({ force: true }), { signal });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    refreshNotifications({ force: true });
  }, { signal });

  const notificationPollTimer = window.setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    refreshNotifications({ force: false });
  }, 45000);
  signal.addEventListener('abort', () => window.clearInterval(notificationPollTimer), { once: true });
`;
