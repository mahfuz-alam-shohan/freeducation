import { baseStyles } from "./shared/styles.js";
import { pcStyles } from "./pc/styles.js";
import { phoneStyles } from "./phone/styles.js";
import { dashboardShellPc } from "./pc/dashboard.js";
import { dashboardShellPhone } from "./phone/dashboard.js";
import { getRoleNavigation } from "../lib/navigation.js";

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

function dashboardShell({
  title,
  contextLabel,
  navItems,
  bottomNavItems,
  sidebarTitle,
  userProfile,
  content,
}) {
  return renderPage({
    title,
    body: renderViewports({
      pc: dashboardShellPc({
        title,
        contextLabel,
        navItems,
        siteName: sidebarTitle,
        userProfile,
        content,
      }),
      phone: dashboardShellPhone({
        title,
        contextLabel,
        siteName: sidebarTitle,
        userProfile,
        bottomNavItems,
        content,
      }),
    }),
  });
}

function adminShell({ title, active, userProfile, content }) {
  const navigation = getRoleNavigation("admin", active);

  return dashboardShell({
    title,
    contextLabel: navigation.contextLabel,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    sidebarTitle: navigation.sidebarTitle,
    userProfile,
    content,
  });
}

export { adminShell, dashboardShell, renderPage, renderViewports };
