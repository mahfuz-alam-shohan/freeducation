import { APP_NAME } from "../../../config.js";

export function setupHtml() {
  return `
    <main class="setup-page setup-shell">
      <section class="setup-card">
        <h1>Initial admin setup</h1>
        <p class="setup-muted">Create the first administrator account for ${APP_NAME}.</p>
        <form id="setupForm" class="setup-form">
          <label>Name<input name="name" required maxlength="120" /></label>
          <label>Email<input name="email" type="email" required maxlength="190" /></label>
          <label>Password<input name="password" type="password" required minlength="12" maxlength="200" /></label>
          <button>Create first admin</button>
        </form>
        <p id="setupMsg" class="setup-muted"></p>
      </section>
    </main>
  `;
}
