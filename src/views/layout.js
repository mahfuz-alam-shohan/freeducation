import { baseStyles } from "./shared/styles.js";
import { pcStyles } from "./pc/styles.js";
import { phoneStyles } from "./phone/styles.js";
import { adminShellPc } from "./pc/admin.js";
import { adminShellPhone } from "./phone/admin.js";

const viewportStyles = `
  .pc-only {
    display: block;
  }

  .phone-only {
    display: none;
  }

  @media (max-width: 900px) {
    .pc-only {
      display: none;
    }

    .phone-only {
      display: block;
    }
  }
`;

function renderPage({ title, body, extraHead = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      ${baseStyles}
      ${pcStyles}
      ${phoneStyles}
      ${viewportStyles}
    </style>
    ${extraHead}
  </head>
  <body>
    ${body}
  </body>
</html>`;
}

function renderViewports({ pc, phone }) {
  return `
    <div class="pc-only">
      ${pc}
    </div>
    <div class="phone-only">
      ${phone}
    </div>
  `;
}

function adminShell({ title, userName, active, content }) {
  return renderPage({
    title,
    body: renderViewports({
      pc: adminShellPc({ title, userName, active, content }),
      phone: adminShellPhone({ title, userName, active, content }),
    }),
  });
}

export { adminShell, renderPage, renderViewports };
