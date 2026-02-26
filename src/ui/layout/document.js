import { APP_NAME } from "../../config.js";

export function renderDocument({ title, body, script = "", bodyClass = "", pageStyles = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
  <title>${title} - ${APP_NAME}</title>
  <style>${pageStyles}</style>
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
