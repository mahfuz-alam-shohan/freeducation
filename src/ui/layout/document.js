import { APP_NAME } from "../../config.js";

export function renderDocument({ title, body, script = "", bodyClass = "", pageStyles = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} - ${APP_NAME}</title>
  <style>${pageStyles}</style>
</head>
<body class="${bodyClass}">${body}<script>${script}</script></body>
</html>`;
}
