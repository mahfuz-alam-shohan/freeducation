export function loginHtml() {
  return `
    <main class="login-page login-shell">
      <section class="login-card">
        <h1>Admin login</h1>
        <form id="loginForm" class="login-form">
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" required /></label>
          <button>Login</button>
        </form>
        <p id="loginMsg" class="login-muted"></p>
      </section>
    </main>
  `;
}
