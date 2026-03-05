import { APP_NAME } from "../../config/index.js";
import { DOCUMENT_BOOT_INTERACTION } from "./document/boot/interaction.js";
import { DOCUMENT_BOOT_NAVIGATION } from "./document/boot/navigation.js";
import { DOCUMENT_BOOT_PAGE_RUNTIME } from "./document/boot/pageRuntime.js";

export function renderDocument({ title, body, script = "", bodyClass = "", pageStyles = "" }) {
  const bootScript = `${DOCUMENT_BOOT_INTERACTION}${DOCUMENT_BOOT_PAGE_RUNTIME}${DOCUMENT_BOOT_NAVIGATION}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover, interactive-widget=resizes-content" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
  <title>${title} - ${APP_NAME}</title>
  <style>
  html{-webkit-text-size-adjust:100%;text-size-adjust:100%;touch-action:manipulation;overscroll-behavior-x:none}
  body{touch-action:manipulation;overscroll-behavior-x:none}
  input,select,textarea,button{font-size:16px}
  ${pageStyles}
  </style>
</head>
<body class="${bodyClass}">${body}<script>
window.__appPageScript = ${JSON.stringify(script || "")};
</script><script>${bootScript}</script><script type="application/x.app-page-script" data-app-page-script>${script}</script></body>
</html>`;
}
