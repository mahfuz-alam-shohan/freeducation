export const renderAdminSetupPage = (): string => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Setup</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #1f1f1f; }
      main { max-width: 520px; }
      label { display: block; margin-top: 16px; }
      input { width: 100%; padding: 8px; font-size: 16px; margin-top: 6px; }
      button { margin-top: 24px; padding: 10px 16px; font-size: 16px; cursor: pointer; }
      .note { margin-top: 12px; font-size: 14px; color: #444; }
    </style>
  </head>
  <body>
    <main>
      <h1>First Admin Setup</h1>
      <p>Set up the first admin account. This form is available only once.</p>
      <form method="post" action="/setup-admin">
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
        <button type="submit">Create admin</button>
      </form>
      <p class="note">Once the admin is created, this setup screen will be disabled.</p>
    </main>
  </body>
</html>`;

export const renderSetupDisabledPage = (): string => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Setup Complete</title>
  </head>
  <body>
    <main>
      <h1>Setup Complete</h1>
      <p>The admin account has already been created.</p>
    </main>
  </body>
</html>`;
