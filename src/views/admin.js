import { adminShell, buildSiteIdentity } from "./layout.js";
import { themeOptions } from "../lib/site-settings.js";

function dashboardPage(userProfile, siteSettings, theme) {
  return adminShell({
    title: "Dashboard",
    active: "home",
    userProfile,
    siteName: siteSettings?.site_name,
    siteIdentity: buildSiteIdentity(siteSettings),
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Admin overview</div>
            <h1 class="page-title">Manage users, learning content, and updates.</h1>
            <p class="page-subtitle">
              Keep the reading library organized and make sure every class has clear guidance.
            </p>
          </div>
        </div>
      </section>
      <section class="panel-grid">
        <div class="panel compact">
          <h2 class="section-title">Today’s priorities</h2>
          <ul class="list">
            <li>Approve new accounts and confirm class assignments.</li>
            <li>Review lesson updates before they go live.</li>
            <li>Scan the support queue for urgent questions.</li>
          </ul>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Library hygiene</h2>
          <p class="small">Ensure readings include citations, author names, and clean file naming.</p>
          <div class="chip-group">
            <span class="chip">Citations</span>
            <span class="chip">Tags</span>
            <span class="chip">Version notes</span>
          </div>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Support coverage</h2>
          <p class="small">Keep response time under 24 hours for teachers and students.</p>
          <div class="note">Coordinate with teachers when a student needs extra reading support.</div>
        </div>
      </section>
    `,
  });
}

function userManagementPage({ users, role, search }, userProfile, siteSettings, theme) {
  const rows = users.results
    .map(
      (user) => `
        <tr>
          <td>${user.display_name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
        </tr>
      `
    )
    .join("");

  return adminShell({
    title: "User Management",
    active: "users",
    userProfile,
    siteName: siteSettings?.site_name,
    siteIdentity: buildSiteIdentity(siteSettings),
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Users</div>
            <h1 class="page-title">Manage access for admins, teachers, and students.</h1>
            <p class="page-subtitle">Create accounts with the right role and keep the list clean.</p>
          </div>
          <div class="page-actions">
            <a class="button-link" href="/admin/users/new">Create user</a>
          </div>
        </div>
        <form class="filters-bar" method="get" action="/admin/users">
          <div class="field">
            <label for="role">User type</label>
            <select id="role" name="role">
              <option value="all" ${role === "all" ? "selected" : ""}>All types</option>
              <option value="admin" ${role === "admin" ? "selected" : ""}>Admin</option>
              <option value="teacher" ${role === "teacher" ? "selected" : ""}>Teacher</option>
              <option value="student" ${role === "student" ? "selected" : ""}>Student</option>
            </select>
          </div>
          <div class="field grow">
            <label for="search">Search</label>
            <input
              id="search"
              name="search"
              type="search"
              value="${search || ""}"
            />
          </div>
          <button type="submit">Filter</button>
        </form>
      </section>
      <section class="panel">
        <h2 class="section-title">Current users</h2>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="4">No users found.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `,
  });
}

function createUserPage(userProfile, siteSettings, theme) {
  return adminShell({
    title: "Create User",
    active: "users",
    userProfile,
    siteName: siteSettings?.site_name,
    siteIdentity: buildSiteIdentity(siteSettings),
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">New account</div>
            <h1 class="page-title">Create a new user</h1>
            <p class="page-subtitle">Assign a role and share a temporary password.</p>
          </div>
          <div class="page-actions">
            <a class="button-link secondary" href="/admin/users">Back to users</a>
          </div>
        </div>
        <form class="form-grid" method="post" action="/admin/users">
          <div>
            <label for="role">User type</label>
            <select id="role" name="role" required>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label for="name">Full name</label>
            <input id="name" name="name" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div>
            <label for="password">Temporary password</label>
            <input id="password" name="password" type="password" required minlength="8" />
          </div>
          <div class="form-actions">
            <button type="submit">Create user</button>
            <span class="note">Share credentials through a secure channel.</span>
          </div>
        </form>
      </section>
    `,
  });
}

function siteSettingsPage(settings, userProfile, theme) {
  return adminShell({
    title: "Site Settings",
    active: "settings",
    userProfile,
    siteName: settings?.site_name,
    siteIdentity: buildSiteIdentity(settings),
    theme,
    siteNameFont: settings?.site_name_font,
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Site settings</div>
            <h1 class="page-title">Maintain the global identity and theme.</h1>
            <p class="page-subtitle">Changes here update every page in the platform.</p>
          </div>
        </div>
        <div class="settings-list">
          <a class="settings-item" href="/admin/settings/theme">
            <div class="settings-meta">
              <h4>Site theme</h4>
              <p>Pick the palette for background, accents, and surfaces.</p>
            </div>
            <div class="settings-action">
              <span>Open</span>
              <span class="settings-chevron">›</span>
            </div>
          </a>
          <a class="settings-item" href="/admin/settings/identity">
            <div class="settings-meta">
              <h4>Site identity</h4>
              <p>Update the name, logo, and display font.</p>
            </div>
            <div class="settings-action">
              <span>Open</span>
              <span class="settings-chevron">›</span>
            </div>
          </a>
        </div>
      </section>
      <section class="panel compact">
        <h2 class="section-title">Current settings</h2>
        <p class="small">Theme: ${settings.theme_id}</p>
        <p class="small">Site name: ${settings.site_name}</p>
      </section>
    `,
  });
}

function siteThemePage(settings, userProfile, theme, { saved } = {}) {
  const themeCards = themeOptions
    .map(
      (theme) => `
        <div class="theme-option">
          <label>
            <input
              type="radio"
              name="theme"
              value="${theme.id}"
              ${settings.theme_id === theme.id ? "checked" : ""}
            />
            ${theme.name}
          </label>
          <div class="small">${theme.description}</div>
          <div class="theme-swatches">
            ${Object.values(theme.palette)
              .slice(0, 4)
              .map((color) => `<span class="theme-swatch" style="background:${color};"></span>`)
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  return adminShell({
    title: "Site Theme",
    active: "settings",
    userProfile,
    siteName: settings?.site_name,
    siteIdentity: buildSiteIdentity(settings),
    theme,
    siteNameFont: settings?.site_name_font,
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Theme</div>
            <h1 class="page-title">Choose a palette for the whole site.</h1>
            <p class="page-subtitle">Preview colors before you save changes.</p>
          </div>
          <div class="page-actions">
            <a class="button-link secondary" href="/admin/settings">Back to settings</a>
          </div>
        </div>
        ${saved ? `<span class="message">Theme saved.</span>` : ""}
        <form class="form-grid" method="post" action="/admin/settings/theme">
          <div class="theme-grid">
            ${themeCards}
          </div>
          <button type="submit">Save theme</button>
        </form>
      </section>
      <section class="panel compact">
        <h2 class="section-title">Live preview</h2>
        <div class="theme-preview" data-theme-preview>
          <div class="theme-preview-card">
            <h4 class="preview-title">Reading dashboard</h4>
            <p class="preview-text">Cards, buttons, and text update instantly.</p>
            <button class="preview-button" type="button">Action</button>
          </div>
          <div class="theme-preview-card">
            <p class="preview-text">Use calm, readable palettes for long sessions.</p>
          </div>
        </div>
      </section>
      <script>
        (() => {
          const themes = ${JSON.stringify(themeOptions)};
          const preview = document.querySelector("[data-theme-preview]");
          const inputs = Array.from(document.querySelectorAll("input[name='theme']"));

          const applyTheme = (themeId) => {
            const selected = themes.find((theme) => theme.id === themeId);
            if (!selected || !preview) return;
            Object.entries(selected.palette).forEach(([key, value]) => {
              preview.style.setProperty(`--${key}`, value);
            });
          };

          const current = inputs.find((input) => input.checked)?.value || themes[0]?.id;
          if (current) {
            applyTheme(current);
          }

          inputs.forEach((input) => {
            input.addEventListener("change", (event) => applyTheme(event.target.value));
          });
        })();
      </script>
    `,
  });
}

function siteIdentityPage(settings, userProfile, theme, { saved } = {}) {
  const fontOptions = [
    "Playfair Display",
    "Inter",
    "Georgia",
    "Times New Roman",
    "Trebuchet MS",
  ];

  const logoStyles = [
    { id: "badge", label: "Badge", className: "logo-style-badge" },
    { id: "stamp", label: "Stamp", className: "logo-style-stamp" },
    { id: "block", label: "Block", className: "logo-style-block" },
    { id: "script", label: "Script", className: "logo-style-script" },
  ];

  const fontOptionsHtml = fontOptions
    .map(
      (font) => `<option value="${font}" ${settings.site_name_font === font ? "selected" : ""}>${font}</option>`
    )
    .join("");

  const logoStyleHtml = logoStyles
    .map(
      (style) => `
        <label class="logo-style-option">
          <input type="radio" name="logoStyle" value="${style.id}" ${
        settings.logo_style === style.id ? "checked" : ""
      } />
          <span class="logo-chip ${style.className}" data-logo-chip="${style.id}">${settings.logo_text}</span>
          ${style.label}
        </label>
      `
    )
    .join("");

  return adminShell({
    title: "Site Identity",
    active: "settings",
    userProfile,
    siteName: settings?.site_name,
    siteIdentity: buildSiteIdentity(settings),
    theme,
    siteNameFont: settings?.site_name_font,
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Identity</div>
            <h1 class="page-title">Set the name and logo students will recognize.</h1>
            <p class="page-subtitle">Keep the logo simple so it stays readable on every device.</p>
          </div>
          <div class="page-actions">
            <a class="button-link secondary" href="/admin/settings">Back to settings</a>
          </div>
        </div>
        ${saved ? `<span class="message">Identity saved.</span>` : ""}
        <form class="form-grid" method="post" action="/admin/settings/identity">
          <div>
            <label for="siteName">Site name</label>
            <input id="siteName" name="siteName" value="${settings.site_name}" required />
          </div>
          <div>
            <label for="siteFont">Site name font</label>
            <select id="siteFont" name="siteNameFont">
              ${fontOptionsHtml}
            </select>
          </div>
          <div>
            <label for="logoSource">Logo source</label>
            <select id="logoSource" name="logoSource">
              <option value="text" ${settings.logo_source === "text" ? "selected" : ""}>Use site name</option>
              <option value="upload" ${settings.logo_source === "upload" ? "selected" : ""}>Use image URL</option>
            </select>
          </div>
          <div>
            <label for="logoText">Logo text (used when logo comes from site name)</label>
            <input id="logoText" name="logoText" value="${settings.logo_text}" />
          </div>
          <div>
            <label for="logoUrl">Logo image URL (store in R2 and paste here)</label>
            <input id="logoUrl" name="logoUrl" type="url" value="${settings.logo_url}" />
          </div>
          <div>
            <span class="small">Logo styles</span>
            <div class="logo-style-grid">
              ${logoStyleHtml}
            </div>
          </div>
          <button type="submit">Save identity</button>
        </form>
      </section>
      <section class="panel compact">
        <h2 class="section-title">Live preview</h2>
        <div class="identity-preview">
          <div class="identity-row">
            <div class="logo-preview" data-logo-preview></div>
            <div>
              <div class="identity-site-name" data-site-name-preview>${settings.site_name}</div>
              <div class="small" data-font-preview>Font: ${settings.site_name_font}</div>
            </div>
          </div>
        </div>
      </section>
      <script>
        (() => {
          const siteNameInput = document.querySelector("#siteName");
          const siteFontInput = document.querySelector("#siteFont");
          const logoSourceInput = document.querySelector("#logoSource");
          const logoTextInput = document.querySelector("#logoText");
          const logoUrlInput = document.querySelector("#logoUrl");
          const logoStyleInputs = Array.from(document.querySelectorAll("input[name='logoStyle']"));
          const previewName = document.querySelector("[data-site-name-preview]");
          const previewFont = document.querySelector("[data-font-preview]");
          const previewLogo = document.querySelector("[data-logo-preview]");

          const logoStyleClasses = ["logo-style-badge", "logo-style-stamp", "logo-style-block", "logo-style-script"];

          const updateName = () => {
            const name = siteNameInput.value.trim() || "Site";
            previewName.textContent = name;
            previewName.style.fontFamily = siteFontInput.value;
            previewFont.textContent = `Font: ${siteFontInput.value}`;
          };

          const updateLogo = () => {
            const source = logoSourceInput.value;
            const style = logoStyleInputs.find((input) => input.checked)?.value || "badge";
            const text = (logoTextInput.value.trim() || siteNameInput.value.trim() || "Site").slice(0, 8);
            const url = logoUrlInput.value.trim();

            previewLogo.classList.remove(...logoStyleClasses);
            previewLogo.innerHTML = "";

            if (source === "upload" && url) {
              const img = document.createElement("img");
              img.src = url;
              img.alt = "Site logo";
              previewLogo.appendChild(img);
            } else {
              previewLogo.textContent = text;
              previewLogo.classList.add(`logo-style-${style}`);
            }
          };

          const syncLogoChips = () => {
            const labelText = logoTextInput.value.trim() || siteNameInput.value.trim() || "Site";
            document.querySelectorAll("[data-logo-chip]").forEach((chip) => {
              chip.textContent = labelText;
            });
          };

          [siteNameInput, siteFontInput].forEach((input) => input.addEventListener("input", updateName));
          [logoSourceInput, logoTextInput, logoUrlInput].forEach((input) => input.addEventListener("input", () => {
            updateLogo();
            syncLogoChips();
          }));
          logoStyleInputs.forEach((input) => input.addEventListener("change", updateLogo));

          updateName();
          updateLogo();
          syncLogoChips();
        })();
      </script>
    `,
  });
}

export {
  createUserPage,
  dashboardPage,
  siteIdentityPage,
  siteSettingsPage,
  siteThemePage,
  userManagementPage,
};
