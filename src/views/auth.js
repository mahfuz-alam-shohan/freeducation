import { buildSiteIdentity, renderPage, renderViewports } from "./layout.js";
import { authCardPc } from "./pc/auth.js";
import { authCardPhone } from "./phone/auth.js";
import { topbar as pcTopbar } from "./pc/components/topbar.js";
import { topbar as phoneTopbar } from "./phone/components/topbar.js";
import { sidebar } from "./pc/components/sidebar.js";
import { getRoleNavigation } from "../lib/navigation.js";

const authTopbarConfig = {
  siteName: "Freeducation",
  authAction: { href: "/", label: "Front page" },
};

const authNavigation = getRoleNavigation("public", "browse");
const authSidebar = authNavigation ? sidebar({ navItems: authNavigation.navItems }) : "";

function setupPage({ siteSettings, theme } = {}) {
  const siteName = siteSettings?.site_name || authTopbarConfig.siteName;
  const siteIdentity = buildSiteIdentity(siteSettings) || { name: siteName };
  const body = `
    <form class="form-grid" method="post" action="/setup">
      <div>
        <label for="name">Full name</label>
        <input id="name" name="name" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required minlength="8" />
      </div>
      <button type="submit">Create admin</button>
    </form>
  `;

  return renderPage({
    title: "Create Admin",
    body: renderViewports({
      pc: authCardPc({
        title: "Create the first admin",
        description: "This setup appears only once. After you create the first admin, this form is disabled.",
        body,
        topbarSlot: pcTopbar({
          siteName,
          siteIdentity,
          authAction: authTopbarConfig.authAction,
        }),
        sidebarSlot: authSidebar,
      }),
      phone: authCardPhone({
        title: "Create the first admin",
        description: "This setup appears only once. After you create the first admin, this form is disabled.",
        body,
        topbarSlot: phoneTopbar({
          siteName,
          siteIdentity,
          authAction: authTopbarConfig.authAction,
        }),
      }),
    }),
    theme,
    siteNameFont: siteSettings?.site_name_font,
  });
}

function loginPage({ siteSettings, theme } = {}) {
  const siteName = siteSettings?.site_name || authTopbarConfig.siteName;
  const siteIdentity = buildSiteIdentity(siteSettings) || { name: siteName };
  const body = `
    <form class="form-grid" method="post" action="/login">
      <div>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button type="submit">Sign in</button>
    </form>
  `;

  return renderPage({
    title: "Login",
    body: renderViewports({
      pc: authCardPc({
        title: "Login header",
        description: "Use your credentials to continue.",
        body,
        topbarSlot: pcTopbar({
          siteName,
          siteIdentity,
          authAction: authTopbarConfig.authAction,
        }),
        sidebarSlot: authSidebar,
      }),
      phone: authCardPhone({
        title: "Login header",
        description: "Use your credentials to continue.",
        body,
        topbarSlot: phoneTopbar({
          siteName,
          siteIdentity,
          authAction: authTopbarConfig.authAction,
        }),
      }),
    }),
    theme,
    siteNameFont: siteSettings?.site_name_font,
  });
}

function messagePage({ title, message, linkLabel, linkHref }, { siteSettings, theme } = {}) {
  const siteName = siteSettings?.site_name || authTopbarConfig.siteName;
  const siteIdentity = buildSiteIdentity(siteSettings) || { name: siteName };
  const body = `<a class="message" href="${linkHref}">${linkLabel}</a>`;

  return renderPage({
    title,
    body: renderViewports({
      pc: authCardPc({
        title,
        description: message,
        body,
        topbarSlot: pcTopbar({
          siteName,
          siteIdentity,
          authAction: authTopbarConfig.authAction,
        }),
        sidebarSlot: authSidebar,
      }),
      phone: authCardPhone({
        title,
        description: message,
        body,
        topbarSlot: phoneTopbar({
          siteName,
          siteIdentity,
          authAction: authTopbarConfig.authAction,
        }),
      }),
    }),
    theme,
    siteNameFont: siteSettings?.site_name_font,
  });
}

export { loginPage, messagePage, setupPage };
