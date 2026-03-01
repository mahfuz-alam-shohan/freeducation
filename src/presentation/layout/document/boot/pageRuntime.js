export const DOCUMENT_BOOT_PAGE_RUNTIME = `
  const runPageScript = (source) => {
    if (typeof window.__cleanupPageScripts === 'function') {
      window.__cleanupPageScripts();
    }
    if (!source || !source.trim()) return;
    try {
      const executePageScript = new Function(source);
      executePageScript();
    } catch (error) {
      console.error('Page script execution failed', error);
      if (typeof window.__showAppStatus === 'function') {
        window.__showAppStatus('Some page actions failed to initialize. Please retry.', 'error', 2800);
      }
    }
  };

  const registerCleanup = (cleanupFn) => {
    if (typeof cleanupFn !== 'function') return;
    if (!Array.isArray(window.__appPageCleanups)) window.__appPageCleanups = [];
    window.__appPageCleanups.push(cleanupFn);
  };

  const cleanupPageScripts = () => {
    if (!Array.isArray(window.__appPageCleanups)) {
      window.__appPageCleanups = [];
      return;
    }

    while (window.__appPageCleanups.length) {
      const cleanupFn = window.__appPageCleanups.pop();
      try {
        cleanupFn();
      } catch (error) {
        console.error('Page cleanup failed', error);
      }
    }
  };
`;
