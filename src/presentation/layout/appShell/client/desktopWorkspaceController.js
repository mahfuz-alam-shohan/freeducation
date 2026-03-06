export const APP_SHELL_CLIENT_DESKTOP = `
  const desktopWorkspaceMedia = window.matchMedia('(min-width: 900px)');
  const isDesktopViewport = () => desktopWorkspaceMedia.matches;

  const escapeCommandHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const setDesktopStatus = (message = 'Ready', holdMs = 0) => {
    if (!(desktopStatusMessage instanceof HTMLElement)) return;
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
  };
  window.__setDesktopStatus = setDesktopStatus;

  const updateDesktopClock = () => {
    if (!(desktopStatusTime instanceof HTMLElement)) return;
    const now = new Date();
    desktopStatusTime.dateTime = now.toISOString();
    desktopStatusTime.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  if (desktopStatus) {
    updateDesktopClock();
    const desktopClockTimer = window.setInterval(updateDesktopClock, 30000);
    signal.addEventListener('abort', () => window.clearInterval(desktopClockTimer), { once: true });
  }

  body.classList.remove('app-sidebar-collapsed');

  const onDesktopModeChange = () => {
    if (isDesktopViewport()) return;
    body.classList.remove('app-sidebar-collapsed');
  };
  if (typeof desktopWorkspaceMedia.addEventListener === 'function') desktopWorkspaceMedia.addEventListener('change', onDesktopModeChange, { signal });
  else if (typeof desktopWorkspaceMedia.addListener === 'function') desktopWorkspaceMedia.addListener(onDesktopModeChange);

  const isEditableTarget = (target) => {
    if (!(target instanceof Element)) return false;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (target.getAttribute('contenteditable') === 'true' || target.isContentEditable) return true;
    return Boolean(target.closest('[contenteditable=\"true\"]'));
  };

  let commandItems = [];
  let filteredCommands = [];
  let activeCommandIndex = 0;

  const setCommandPaletteOpen = (open) => {
    if (!(commandPalette instanceof HTMLElement)) return;
    const next = Boolean(open);
    body.classList.toggle('command-open', next);
    commandPalette.hidden = !next;
    commandPalette.setAttribute('aria-hidden', next ? 'false' : 'true');
    if (next) {
      setMenu(false);
      setProfile(false);
      setNotificationsOpen(false);
      commandItems = buildCommandItems();
      filteredCommands = commandItems.slice();
      activeCommandIndex = 0;
      renderCommandList('');
      if (commandInput instanceof HTMLInputElement) {
        commandInput.value = '';
        commandInput.focus();
      }
      return;
    }
    filteredCommands = [];
    activeCommandIndex = 0;
    if (commandInput instanceof HTMLInputElement) commandInput.blur();
  };

  const buildCommandItems = () => {
    const byKey = new Map();
    const navLinks = Array.from(document.querySelectorAll('#appSidebar .app-nav-desktop .app-nav a[href]'));
    navLinks.forEach((link) => {
      const href = String(link.getAttribute('href') || '').trim();
      if (!href || href.startsWith('#')) return;
      const labelNode = link.querySelector('.app-nav-label');
      const label = String(labelNode?.textContent || link.textContent || href).trim();
      if (!label) return;
      const dedupeKey = 'link:' + label.toLowerCase() + ':' + href;
      if (byKey.has(dedupeKey)) return;
      byKey.set(dedupeKey, { type: 'link', label, hint: 'Navigate', href });
    });

    const profileHref = String(avatarButton?.getAttribute('data-avatar-href') || '').trim();
    if (profileHref) byKey.set('action:profile', { type: 'link', label: 'Open Profile', hint: 'Account', href: profileHref });
    if (themeToggle) byKey.set('action:theme', { type: 'action', label: 'Toggle Theme', hint: 'Appearance', action: 'theme' });
    if (notificationToggle) byKey.set('action:notifications', { type: 'action', label: 'Open Notifications', hint: 'Inbox', action: 'notifications' });
    if (mainLogout || profileLogout) byKey.set('action:logout', { type: 'action', label: 'Logout', hint: 'Session', action: 'logout' });

    return Array.from(byKey.values());
  };

  const syncActiveCommand = () => {
    if (!(commandList instanceof HTMLElement)) return;
    const nodes = Array.from(commandList.querySelectorAll('[data-cmd-index]'));
    nodes.forEach((node, index) => {
      const active = index === activeCommandIndex;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  const renderCommandList = (query = '') => {
    if (!(commandList instanceof HTMLElement)) return;
    const normalizedQuery = String(query || '').trim().toLowerCase();
    filteredCommands = !normalizedQuery
      ? commandItems.slice()
      : commandItems.filter((item) => {
        const bag = (item.label + ' ' + item.hint + ' ' + (item.href || '')).toLowerCase();
        return bag.includes(normalizedQuery);
      });

    if (!filteredCommands.length) {
      commandList.innerHTML = '<p class=\"app-command-empty\">No matching command.</p>';
      activeCommandIndex = 0;
      return;
    }

    if (activeCommandIndex >= filteredCommands.length) activeCommandIndex = filteredCommands.length - 1;
    if (activeCommandIndex < 0) activeCommandIndex = 0;
    commandList.innerHTML = filteredCommands.map((item, index) => '<button type=\"button\" class=\"app-command-item' + (index === activeCommandIndex ? ' is-active' : '') + '\" data-cmd-index=\"' + index + '\" role=\"option\" aria-selected=\"' + (index === activeCommandIndex ? 'true' : 'false') + '\"><span class=\"app-command-item-label\">' + escapeCommandHtml(item.label) + '</span><span class=\"app-command-item-hint\">' + escapeCommandHtml(item.hint || '') + '</span></button>').join('');
  };

  const runCommand = (item) => {
    if (!item) return;
    setCommandPaletteOpen(false);
    if (item.type === 'link') {
      setNavigating();
      if (typeof window.__appNavigate === 'function') window.__appNavigate(item.href);
      else window.location.href = item.href;
      setDesktopStatus('Opening ' + item.label, 1400);
      return;
    }
    if (item.action === 'theme' && themeToggle) {
      themeToggle.click();
      setDesktopStatus('Theme toggled', 1200);
      return;
    }
    if (item.action === 'notifications' && notificationToggle) {
      setNotificationsOpen(true);
      setDesktopStatus('Notifications opened', 1200);
      return;
    }
    if (item.action === 'logout') {
      const logoutButton = mainLogout || profileLogout;
      if (!logoutButton) return;
      logoutButton.click();
      return;
    }
  };

  if (commandClose) {
    commandClose.addEventListener('click', () => setCommandPaletteOpen(false), { signal });
  }
  if (commandPalette) {
    commandPalette.addEventListener('click', (event) => {
      if (event.target === commandPalette) setCommandPaletteOpen(false);
    }, { signal });
  }
  if (commandInput) {
    commandInput.addEventListener('input', () => renderCommandList(commandInput.value), { signal });
    commandInput.addEventListener('keydown', (event) => {
      if (!filteredCommands.length) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeCommandIndex = (activeCommandIndex + 1) % filteredCommands.length;
        syncActiveCommand();
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeCommandIndex = (activeCommandIndex - 1 + filteredCommands.length) % filteredCommands.length;
        syncActiveCommand();
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        runCommand(filteredCommands[activeCommandIndex]);
      }
    }, { signal });
  }
  if (commandList) {
    commandList.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('[data-cmd-index]');
      if (!button) return;
      const index = Number.parseInt(String(button.getAttribute('data-cmd-index') || '0'), 10);
      if (!Number.isInteger(index) || index < 0 || index >= filteredCommands.length) return;
      activeCommandIndex = index;
      runCommand(filteredCommands[index]);
    }, { signal });
  }

  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && String(event.key || '').toLowerCase() === 'k') {
      event.preventDefault();
      if (!isDesktopViewport()) return;
      setCommandPaletteOpen(!body.classList.contains('command-open'));
      return;
    }

    if (!isDesktopViewport()) return;
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !isEditableTarget(event.target) && !body.classList.contains('command-open')) {
      event.preventDefault();
      setCommandPaletteOpen(true);
      return;
    }

    if (event.key === 'Escape' && body.classList.contains('command-open')) {
      event.preventDefault();
      setCommandPaletteOpen(false);
    }
  }, { signal });
`;
