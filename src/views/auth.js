import { renderPage } from "./layout.js";

function setupPage() {
  return renderPage({
    title: "Create Admin",
    body: `
      <div class="auth-wrapper">
        <div class="auth-card">
          <h1>Create the first admin</h1>
          <p>This setup appears only once. After you create the first admin, this form is disabled.</p>
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
        </div>
      </div>
    `,
  });
}

function loginPage() {
  return renderPage({
    title: "Admin Login",
    body: `
      <div class="auth-wrapper">
        <div class="auth-card">
          <h1>Admin login</h1>
          <p>Use your admin credentials to access the control center.</p>
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
        </div>
      </div>
    `,
  });
}

function messagePage({ title, message, linkLabel, linkHref }) {
  return renderPage({
    title,
    body: `
      <div class="auth-wrapper">
        <div class="auth-card">
          <h1>${title}</h1>
          <p>${message}</p>
          <a class="message" href="${linkHref}">${linkLabel}</a>
        </div>
      </div>
    `,
  });
}

export { loginPage, messagePage, setupPage };
