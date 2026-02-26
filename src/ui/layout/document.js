import { APP_NAME } from "../../config.js";

export function renderDocument({ title, body, script = "", bodyClass = "", pageStyles = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
  <title>${title} - ${APP_NAME}</title>
  <style>
  html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
  input,select,textarea,button{font-size:16px}
  ${pageStyles}
  </style>
</head>
<body class="${bodyClass}">${body}<script>
window.__appPageScript = ${JSON.stringify(script || "")};
</script><script>(() => {
  if (window.__appShellBooted) {
    if (typeof window.__runPageScript === 'function') window.__runPageScript(window.__appPageScript || '');
    return;
  }
  window.__appShellBooted = true;
  const blockZoomKeys = new Set(['+', '-', '=', '_']);

  document.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  }, { passive: false });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && blockZoomKeys.has(event.key)) event.preventDefault();
  });

  document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (event) => event.preventDefault(), { passive: false });

  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const viewportStatic = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content';
  const viewportFocus = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content';
  const lockViewport = () => {
    if (viewportMeta) viewportMeta.setAttribute('content', viewportFocus);
  };
  const resetViewport = () => {
    if (viewportMeta) viewportMeta.setAttribute('content', viewportStatic);
  };

  document.addEventListener('focusin', (event) => {
    if (event.target && event.target.matches('input, textarea, select')) lockViewport();
  });
  document.addEventListener('focusout', resetViewport);

  let singleTouch = false;
  document.addEventListener('touchstart', (event) => {
    singleTouch = event.touches.length === 1;
  }, { passive: false });
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 1 || !singleTouch) event.preventDefault();
  }, { passive: false });

  const parser = new DOMParser();
  const appStyle = () => document.querySelector('head style');
  const syncTheme = () => {
    const theme = document.body.getAttribute('data-theme');
    if (theme) window.localStorage.setItem('freeducation-theme', theme);
  };

  const runPageScript = (source) => {
    if (!source || !source.trim()) return;
    const scriptTag = document.createElement('script');
    scriptTag.textContent = source;
    document.body.appendChild(scriptTag);
    scriptTag.remove();
  };

  const replacePage = (nextDoc) => {
    const nextBody = nextDoc.body;
    const nextTitle = nextDoc.querySelector('title');
    const nextStyle = nextDoc.querySelector('head style');
    const nextPageScript = nextDoc.querySelector('script[data-app-page-script]')?.textContent || '';

    if (!nextBody || !nextTitle || !nextStyle) throw new Error('Incomplete page response.');

    document.title = nextTitle.textContent || document.title;
    document.body.className = nextBody.className;
    document.body.innerHTML = nextBody.innerHTML;

    const styleEl = appStyle();
    if (styleEl) styleEl.textContent = nextStyle.textContent || styleEl.textContent;

    runPageScript(nextPageScript);
    document.body.classList.remove('app-navigating');
    syncTheme();
  };

  const navigate = async (href, { push = true } = {}) => {
    document.body.classList.add('app-navigating');
    try {
      const response = await fetch(href, { headers: { 'x-app-navigation': '1' } });
      if (!response.ok) throw new Error('Navigation failed');
      const html = await response.text();
      const nextDoc = parser.parseFromString(html, 'text/html');
      replacePage(nextDoc);
      if (push) window.history.pushState({ href }, '', href);
    } catch {
      window.location.href = href;
    }
  };

  window.__runPageScript = runPageScript;
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

  window.addEventListener('popstate', () => navigate(window.location.pathname + window.location.search + window.location.hash, { push: false }));
  runPageScript(window.__appPageScript || '');
})();
</script><script type="application/x.app-page-script" data-app-page-script>${script}</script></body>
</html>`;
}
