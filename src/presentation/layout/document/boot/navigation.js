export const DOCUMENT_BOOT_NAVIGATION = `
  let navigationSequence = 0;
  let navigationController = null;

  const clearNavigationState = () => {
    document.body.classList.remove('app-navigating');
    document.documentElement.classList.remove('app-view-transitioning');
    document.documentElement.removeAttribute('data-nav-motion');
    document.documentElement.removeAttribute('data-nav-scope');
  };

  const replaceAppShell = (nextBody) => {
    const currentShell = document.body.querySelector('.app-shell');
    const nextShell = nextBody?.querySelector?.('.app-shell');
    if (!currentShell || !nextShell) {
      document.body.innerHTML = nextBody?.innerHTML || '';
      return;
    }
    const replacement = nextShell.cloneNode(true);
    currentShell.replaceWith(replacement);
  };

  const replacePage = async (nextDoc, motion = 'forward') => {
    const nextBody = nextDoc.body;
    const nextTitle = nextDoc.querySelector('title');
    const nextStyle = nextDoc.querySelector('head style');
    const nextPageScript = nextDoc.querySelector('script[data-app-page-script]')?.textContent || '';

    if (!nextBody || !nextTitle || !nextStyle) throw new Error('Incomplete page response.');

    const commit = () => {
      const preserveClasses = [];
      if (document.body.classList.contains('app-navigating')) preserveClasses.push('app-navigating');
      const styleEl = appStyle();
      const nextStyleText = String(nextStyle.textContent || '');
      if (styleEl && nextStyleText && nextStyleText !== styleEl.textContent) {
        styleEl.textContent = nextStyleText;
      }

      document.title = nextTitle.textContent || document.title;
      document.body.className = [String(nextBody.className || '').trim(), ...preserveClasses].filter(Boolean).join(' ');
      replaceAppShell(nextBody);
      syncTheme();
    };

    commit();

    window.__appPageScript = nextPageScript;
    runPageScript(nextPageScript);
  };

  const navigate = async (href, { push = true, motion = push ? 'forward' : 'back' } = {}) => {
    const targetHref = String(href || '').trim();
    if (!targetHref) return;

    const sequence = ++navigationSequence;
    if (navigationController) {
      navigationController.abort();
    }
    navigationController = new AbortController();
    document.body.classList.add('app-navigating');

    try {
      const response = await fetch(targetHref, {
        headers: { 'x-app-navigation': '1' },
        signal: navigationController.signal,
      });
      if (!response.ok) throw new Error('Navigation failed');
      const html = await response.text();
      if (sequence !== navigationSequence) return;
      const nextDoc = parser.parseFromString(html, 'text/html');
      if (push) window.history.pushState({ href: targetHref }, '', targetHref);
      await replacePage(nextDoc, motion);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      if (typeof window.__showAppStatus === 'function') window.__showAppStatus('Navigation failed. Retrying...', 'error', 1800);
      window.location.href = targetHref;
    } finally {
      if (sequence === navigationSequence) {
        navigationController = null;
        clearNavigationState();
      }
    }
  };

  window.__runPageScript = runPageScript;
  window.__registerCleanup = registerCleanup;
  window.__cleanupPageScripts = cleanupPageScripts;
  window.__appNavigate = navigate;

  const hasActiveSelectionRange = () => {
    try {
      const selection = window.getSelection?.();
      return Boolean(selection && !selection.isCollapsed && String(selection.toString() || '').trim());
    } catch {
      return false;
    }
  };

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#') || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  });

  window.addEventListener('popstate', () => {
    if (hasActiveSelectionRange()) {
      window.history.forward();
      return;
    }
    navigate(window.location.pathname + window.location.search + window.location.hash, { push: false, motion: 'back' });
  });
  const initialPageScript = getCurrentPageScript();
  runPageScript(initialPageScript);
})();
`;
