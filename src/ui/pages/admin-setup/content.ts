import { themeStyles } from "../../styles/theme";

const adminSetupStyles = `
  ${themeStyles}
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; min-height: 100vh; display: grid; place-items: center; }
  main { width: min(560px, 100%); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md); }
  h1 { margin-top: 0; font-family: var(--font-display); }
  label { display: block; margin-top: 16px; color: var(--color-text); }
  input { width: 100%; margin-top: 6px; }
  button { margin-top: 20px; }
  .note { margin-top: 12px; font-size: 14px; color: var(--color-text-muted); }
`;

export const renderAdminSetupPage = (csrfToken: string, requiresSetupToken: boolean): string => `<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="${csrfToken}" />
    <title>Admin Setup</title>
    <style>${adminSetupStyles}</style>
  </head>
  <body>
    <main>
      <h1>First Admin Setup</h1>
      <p>Set up the first admin account. This form is available only once.</p>
      <form method="post" action="/setup-admin">
        <input type="hidden" name="csrf_token" value="${csrfToken}" />
        <label>
          Full name
          <input name="name" autocomplete="name" required />
        </label>
        <label>
          Gmail address
          <input type="email" name="email" autocomplete="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" autocomplete="new-password" required minlength="8" />
        </label>
        <label>
          Date of birth
          <input type="date" name="dateOfBirth" required />
        </label>
        ${
          requiresSetupToken
            ? `
        <label>
          Setup key
          <input type="password" name="setupToken" autocomplete="one-time-code" required />
        </label>`
            : ""
        }
        <button type="submit">Create admin</button>
      </form>
      ${requiresSetupToken ? `<p class="note">Enter the setup key configured in your deployment secrets.</p>` : ""}
      <p class="note">Once the admin is created, this setup screen will be disabled.</p>
    </main>
  </body>
</html>`;

export const renderSetupDisabledPage = (): string => `<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Setup Complete</title>
    <style>${adminSetupStyles}</style>
  </head>
  <body>
    <main>
      <h1>Setup Complete</h1>
      <p>The admin account has already been created.</p>
    </main>
  </body>
</html>`;
