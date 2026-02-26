export function loginHtml() {
  return `
    <main class="login-page">
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
        <p id="loginMsg" class="login-muted"></p>
      </section>
      <footer class="auth-footer">Use your administrator account credentials.</footer>
    </main>
  `;
}
