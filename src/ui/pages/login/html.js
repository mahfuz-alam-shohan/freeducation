export function loginHtml() {
  return `
    <section class="login-page">
      <header class="auth-header">
        <h1>Education login</h1>
        <p class="auth-muted">Learning resources, lessons, and progress tools are organized here.</p>
      </header>

      <section class="learning-strip" aria-label="Learning highlights">
        <span>📘 Reading</span>
        <span>🧪 Science</span>
        <span>🧮 Math</span>
        <span>🎨 Arts</span>
        <span>🌍 Geography</span>
      </section>

      <section class="login-card">
        <h2>Access for administrators</h2>
        <form id="loginForm" class="login-form" method="post" action="/api/login">
          <label>Email<input name="email" type="email" autocomplete="email" required /></label>
          <label>Password<input name="password" type="password" autocomplete="current-password" required /></label>
          <button type="submit">Open account</button>
        </form>
        <p id="loginMsg" class="login-muted" role="status" aria-live="polite"></p>
      </section>

      <footer class="auth-footer">Learning grows one step at a time.</footer>
    </section>
  `;
}
