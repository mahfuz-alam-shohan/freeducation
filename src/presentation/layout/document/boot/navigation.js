export const DOCUMENT_BOOT_NAVIGATION = `
  const replacePage = async (nextDoc, motion = 'forward') => {
    const nextBody = nextDoc.body;
    const nextTitle = nextDoc.querySelector('title');
    const nextStyle = nextDoc.querySelector('head style');
    const nextPageScript = nextDoc.querySelector('script[data-app-page-script]')?.textContent || '';

    if (!nextBody || !nextTitle || !nextStyle) throw new Error('Incomplete page response.');

    const commit = () => {
      document.title = nextTitle.textContent || document.title;
      document.body.className = nextBody.className;
      document.body.innerHTML = nextBody.innerHTML;

      const styleEl = appStyle();
      if (styleEl) styleEl.textContent = nextStyle.textContent || styleEl.textContent;

      window.__appPageScript = nextPageScript;
      runPageScript(nextPageScript);
      document.body.classList.remove('app-navigating');
      syncTheme();
    };

    if (document.startViewTransition) {
      document.documentElement.setAttribute('data-nav-motion', motion);
      document.body.classList.add('app-view-transitioning');
      await document.startViewTransition(() => commit()).finished.catch(() => {});
      document.body.classList.remove('app-view-transitioning');
      document.documentElement.removeAttribute('data-nav-motion');
    } else {
      commit();
    }
  };

  const navigate = async (href, { push = true, motion = push ? 'forward' : 'back' } = {}) => {
    document.body.classList.add('app-navigating');
    try {
      const response = await fetch(href, { headers: { 'x-app-navigation': '1' } });
      if (!response.ok) throw new Error('Navigation failed');
      const html = await response.text();
      const nextDoc = parser.parseFromString(html, 'text/html');
      if (push) window.history.pushState({ href }, '', href);
      await replacePage(nextDoc, motion);
    } catch {
      if (typeof window.__showAppStatus === 'function') window.__showAppStatus('Navigation failed. Retrying...', 'error', 1800);
      window.location.href = href;
    }
  };

  window.__runPageScript = runPageScript;
  window.__registerCleanup = registerCleanup;
  window.__cleanupPageScripts = cleanupPageScripts;
  window.__appNavigate = navigate;

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

  window.addEventListener('popstate', () => navigate(window.location.pathname + window.location.search + window.location.hash, { push: false, motion: 'back' }));
  const initialPageScript = getCurrentPageScript();
  runPageScript(initialPageScript);
})();
`;
