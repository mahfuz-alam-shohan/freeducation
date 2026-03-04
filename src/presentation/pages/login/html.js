export function loginHtml() {
  return `
    <section class="login-page">
      <header class="auth-header">
        <p class="auth-kicker">Welcome back</p>
        <h1>Login to continue learning.</h1>
        <p class="auth-muted">Simple, focused access for all role-based accounts.</p>
      </header>

      <section class="login-card">
        <h2>Account Login</h2>
        <form id="loginForm" class="login-form" method="post" action="/api/login">
          <label>Email<input name="email" type="email" autocomplete="email" required /></label>
          <label>Password<input name="password" type="password" autocomplete="current-password" required /></label>
          <button type="submit">Sign in</button>
        </form>
        <p id="loginMsg" class="login-muted" role="status" aria-live="polite"></p>
      </section>
    </section>
  `;
}
