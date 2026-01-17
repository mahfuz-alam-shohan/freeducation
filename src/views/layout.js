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

const liveUiScript = `
  <script>
    (() => {
      const body = document.body;
      const readyClass = () => body.classList.add("page-ready");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", readyClass);
      } else {
        readyClass();
      }

      document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (
          !link ||
          link.target === "_blank" ||
          link.hasAttribute("download") ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) {
          return;
        }
        body.classList.add("page-leave");
      });

      const refreshTargets = () =>
        Array.from(document.querySelectorAll(".pc-content, .phone-content"));

      const refreshIntervalMs = 60000;

      const refreshPage = async () => {
        const targets = refreshTargets();
        if (!targets.length) {
          return;
        }

        try {
          const response = await fetch(window.location.href, {
            headers: { "x-live-refresh": "1" },
          });

          if (!response.ok) {
            return;
          }

          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          targets.forEach((target) => {
            const selector = target.classList.contains("pc-content")
              ? ".pc-content"
              : ".phone-content";
            const updated = doc.querySelector(selector);
            if (!updated) {
              return;
            }
            target.innerHTML = updated.innerHTML;
          });
        } catch (error) {
          console.warn("Live refresh skipped.", error);
        }
      };

      window.setInterval(refreshPage, refreshIntervalMs);
    })();
  </script>
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
    ${liveUiScript}
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
