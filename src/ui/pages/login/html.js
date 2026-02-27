export function loginHtml() {
  return `
    <section class="login-page">
      <header class="auth-header">
        <div class="icon-row" aria-hidden="true">
          <span class="icon-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6.5h7.5c1.8 0 3.3 1.5 3.3 3.3V20H7.2C5.4 20 4 18.6 4 16.8z"/>
              <path d="M20 6.5h-7.5c-1.8 0-3.3 1.5-3.3 3.3V20h7.6c1.8 0 3.2-1.4 3.2-3.2z"/>
            </svg>
          </span>
          <span class="icon-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9.5L12 4l9 5.5-9 5.5z"/>
              <path d="M7.5 12.3v4.4c0 .8 2 2.3 4.5 2.3s4.5-1.5 4.5-2.3v-4.4"/>
            </svg>
          </span>
        </div>
        <p class="auth-quote">"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."</p>
        <p class="auth-muted">— Malcolm X</p>
      </header>

      <section class="shape-stage" aria-hidden="true">
        <span class="shape shape-circle"></span>
        <span class="shape shape-diamond"></span>
        <span class="shape shape-ring"></span>
      </section>

      <section class="login-card">
        <h2>Login</h2>
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
