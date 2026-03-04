export const DOCUMENT_BOOT_INTERACTION = `
(() => {
  const getCurrentPageScript = () => {
    const fromTag = document.querySelector('script[data-app-page-script]')?.textContent || '';
    if (fromTag && fromTag.trim()) return fromTag;
    return String(window.__appPageScript || '');
  };

  if (window.__appShellBooted) {
    if (typeof window.__runPageScript === 'function') {
      window.__runPageScript(getCurrentPageScript());
    }
    return;
  }
  window.__appShellBooted = true;
  const blockZoomKeys = new Set(['+', '-', '=', '_', '0']);

  document.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  }, { passive: false });

  document.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (blockZoomKeys.has(event.key) || event.code === 'NumpadAdd' || event.code === 'NumpadSubtract' || event.code === 'Digit0' || event.code === 'Numpad0') {
      event.preventDefault();
    }
  });

  document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (event) => event.preventDefault(), { passive: false });

  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const viewportStatic = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover, interactive-widget=resizes-content';
  const viewportFocus = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover, interactive-widget=resizes-content';
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
  window.addEventListener('orientationchange', resetViewport);
  window.addEventListener('resize', resetViewport);

  let singleTouch = false;
  let lastTouchEnd = 0;
  document.addEventListener('touchstart', (event) => {
    singleTouch = event.touches.length === 1;
  }, { passive: false });
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 1 || !singleTouch) event.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', (event) => {
    if (event.touches.length > 0 || event.changedTouches.length !== 1) return;
    const now = Date.now();
    if (now - lastTouchEnd <= 320) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  const parser = new DOMParser();
  const appStyle = () => document.querySelector('head style');
  const syncTheme = () => {
    const theme = document.body.getAttribute('data-theme');
    if (theme) window.localStorage.setItem('freeducation-theme', theme);
  };
`;
