import { adminShell } from "./layout.js";
import { themeOptions } from "../lib/site-settings.js";

function dashboardPage(userProfile, siteSettings, theme) {
  return adminShell({
    title: "Dashboard",
    active: "home",
    userProfile,
    siteName: siteSettings?.site_name,
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: `
      <div class="card">
        <h3 class="section-title">Welcome back</h3>
        <p class="small">Use the menu to manage users and guide new learning collections across the library.</p>
      </div>
      <div class="info-grid">
        <div class="info-card">
          <strong>Admin priorities</strong>
          <p class="small">Review new member requests and confirm assigned roles.</p>
        </div>
        <div class="info-card">
          <strong>Library checklist</strong>
          <p class="small">Confirm reading sets, update citations, and refresh staff notes.</p>
        </div>
        <div class="info-card">
          <strong>Support queue</strong>
          <p class="small">Answer questions from teachers and students within 24 hours.</p>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">Next steps</h3>
        <ul class="timeline">
          <li>Invite additional admins using the User Management page.</li>
          <li>Upload new modules to the content folders for review.</li>
          <li>Share weekly highlights with the teaching staff.</li>
        </ul>
      </div>
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
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: `
      <div class="card">
        <div class="section-header">
          <div>
            <h3 class="section-title">User list</h3>
            <p class="small">Filter by role and search by name or email. Create users in a dedicated form.</p>
          </div>
          <a class="button-link" href="/admin/users/new">Create user</a>
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
      </div>
    `,
  });
}

function createUserPage(userProfile, siteSettings, theme) {
  return adminShell({
    title: "Create User",
    active: "users",
    userProfile,
    siteName: siteSettings?.site_name,
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: `
      <div class="card">
        <h3 class="section-title">Create user</h3>
        <p class="small">Select a role, then provide the basic account details.</p>
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
            <a class="button-link secondary" href="/admin/users">Back to users</a>
          </div>
        </form>
      </div>
    `,
  });
}

function siteSettingsPage(settings, userProfile, theme) {
  return adminShell({
    title: "Site Settings",
    active: "settings",
    userProfile,
    siteName: settings?.site_name,
    theme,
    siteNameFont: settings?.site_name_font,
    content: `
      <div class="card">
        <h3 class="section-title">Site settings</h3>
        <p class="small">Manage the global theme, identity, and brand options for every page.</p>
        <div class="settings-list">
          <div class="settings-item">
            <div class="settings-meta">
              <h4>Site theme</h4>
              <p>Choose a site-wide theme and preview updates before saving.</p>
            </div>
            <a class="button-link" href="/admin/settings/theme">Open</a>
          </div>
          <div class="settings-item">
            <div class="settings-meta">
              <h4>Site identity</h4>
              <p>Set the site name, typography, and logo presentation.</p>
            </div>
            <a class="button-link" href="/admin/settings/identity">Open</a>
          </div>
        </div>
      </div>
      <div class="info-card">
        <strong>Current summary</strong>
        <p class="small">Theme: ${settings.theme_id}</p>
        <p class="small">Site name: ${settings.site_name}</p>
      </div>
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
    theme,
    siteNameFont: settings?.site_name_font,
    content: `
      <div class="card">
        <div class="section-header">
          <div>
            <h3 class="section-title">Site theme</h3>
            <p class="small">Choose a theme and preview it live before saving for the whole site.</p>
          </div>
          <a class="button-link secondary" href="/admin/settings">Back to settings</a>
        </div>
        ${saved ? `<span class="message">Theme saved.</span>` : ""}
        <form class="form-grid" method="post" action="/admin/settings/theme">
          <div class="theme-grid">
            ${themeCards}
          </div>
          <button type="submit">Save theme</button>
        </form>
      </div>
      <div class="card">
        <h3 class="section-title">Live preview</h3>
        <div class="theme-preview" data-theme-preview>
          <div class="theme-preview-card">
            <h4 class="preview-title">Freeducation</h4>
            <p class="preview-text">Preview how headings, buttons, and panels feel.</p>
            <button class="preview-button" type="button">Action</button>
          </div>
          <div class="theme-preview-card">
            <p class="preview-text">Buttons and cards update before you save.</p>
          </div>
        </div>
      </div>
      <script>
        (() => {
          const themes = ${JSON.stringify(themeOptions)};
          const preview = document.querySelector("[data-theme-preview]");
          const inputs = Array.from(document.querySelectorAll("input[name='theme']"));

          const applyTheme = (themeId) => {
            const selected = themes.find((theme) => theme.id === themeId);
            if (!selected || !preview) return;
            Object.entries(selected.palette).forEach(([key, value]) => {
              preview.style.setProperty(\`--\${key}\`, value);
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
    theme,
    siteNameFont: settings?.site_name_font,
    content: `
      <div class="card">
        <div class="section-header">
          <div>
            <h3 class="section-title">Site identity</h3>
            <p class="small">Update the site name, typography, and logo presentation with live updates.</p>
          </div>
          <a class="button-link secondary" href="/admin/settings">Back to settings</a>
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
      </div>
      <div class="card">
        <h3 class="section-title">Live preview</h3>
        <div class="identity-preview">
          <div class="identity-row">
            <div class="logo-preview" data-logo-preview></div>
            <div>
              <div class="identity-site-name" data-site-name-preview>${settings.site_name}</div>
              <div class="small" data-font-preview>Font: ${settings.site_name_font}</div>
            </div>
          </div>
        </div>
      </div>
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
            previewFont.textContent = \`Font: \${siteFontInput.value}\`;
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
              previewLogo.classList.add(\`logo-style-\${style}\`);
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
