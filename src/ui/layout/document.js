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
<body class="${bodyClass}">${body}<script>(() => {
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
})();
${script}</script></body>
</html>`;
}
