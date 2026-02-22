import { styles } from "../assets.js";

const noZoomScript = `
(() => {
  const prevent = (event) => event.preventDefault();

  document.addEventListener('gesturestart', prevent, { passive: false });
  document.addEventListener('gesturechange', prevent, { passive: false });
  document.addEventListener('gestureend', prevent, { passive: false });

  document.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
  }, { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
})();
`;

export function basePage(title, body, script = "", pageStyles = "") {
  const mergedScript = `${noZoomScript}\n${script || ""}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover,interactive-widget=resizes-content"/><title>${title}</title><style>${styles}\n${pageStyles}</style></head><body>${body}<script>${mergedScript}</script></body></html>`;
}
