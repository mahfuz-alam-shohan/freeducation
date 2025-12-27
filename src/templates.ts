import { appConfig } from "./config";
import { baseStyles } from "./styles";

export const layout = (title: string, body: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | ${appConfig.siteName}</title>
    <style>${baseStyles}</style>
  </head>
  <body>
    ${body}
  </body>
</html>`;

export const header = (subtitle: string) => `
<header>
  <div class="container">
    <span class="badge">${appConfig.siteName}</span>
    <h2>${subtitle}</h2>
  </div>
</header>
`;
