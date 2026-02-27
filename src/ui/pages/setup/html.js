import { APP_NAME } from "../../../config.js";
import { renderSiteLogo } from "../../layout/siteLogo.js";

export function setupHtml() {
  return `
    <main class="setup-page">
      <header class="auth-header">
        <h1>Initial admin setup</h1>
        <p class="auth-muted">Create the first administrator account for ${renderSiteLogo({ className: "site-logo site-logo--inline", label: APP_NAME })}.</p>
      </header>
      <section class="setup-card">
        <form id="setupForm" class="setup-form" method="post" action="/api/setup">
          <label>Name<input name="name" required maxlength="120" /></label>
          <label>Email<input name="email" type="email" required maxlength="190" /></label>
          <label>Password<input name="password" type="password" required minlength="8" maxlength="200" /></label>
          <button>Create first admin</button>
        </form>
        <p id="setupMsg" class="setup-muted" role="status" aria-live="polite"></p>
      </section>
      <footer class="auth-footer">Keep setup simple: one direct form with no modal interruptions.</footer>
    </main>
  `;
}
