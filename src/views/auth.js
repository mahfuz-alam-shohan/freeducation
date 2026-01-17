import { renderPage, renderViewports } from "./layout.js";
import { authCardPc } from "./pc/auth.js";
import { authCardPhone } from "./phone/auth.js";

function setupPage() {
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
      }),
      phone: authCardPhone({
        title: "Create the first admin",
        description: "This setup appears only once. After you create the first admin, this form is disabled.",
        body,
      }),
    }),
  });
}

function loginPage() {
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
    title: "Admin Login",
    body: renderViewports({
      pc: authCardPc({
        title: "Admin login",
        description: "Use your admin credentials to access the control center.",
        body,
      }),
      phone: authCardPhone({
        title: "Admin login",
        description: "Use your admin credentials to access the control center.",
        body,
      }),
    }),
  });
}

function messagePage({ title, message, linkLabel, linkHref }) {
  const body = `<a class="message" href="${linkHref}">${linkLabel}</a>`;

  return renderPage({
    title,
    body: renderViewports({
      pc: authCardPc({ title, description: message, body }),
      phone: authCardPhone({ title, description: message, body }),
    }),
  });
}

export { loginPage, messagePage, setupPage };
