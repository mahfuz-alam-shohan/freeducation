export function loginHtml() {
  return `
    <section class="login-page">
      <header class="auth-header">
        <h1>Admin login</h1>
        <p class="auth-muted">Sign in to manage content and administrators.</p>
      </header>
      <section class="login-card">
        <form id="loginForm" class="login-form" method="post" action="/api/login">
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" required /></label>
          <button>Login</button>
        </form>
        <p id="loginMsg" class="login-muted" role="status" aria-live="polite"></p>
      </section>
      <footer class="auth-footer">Direct form access keeps sign-in immediate and distraction-free.</footer>
    </section>
  `;
}
