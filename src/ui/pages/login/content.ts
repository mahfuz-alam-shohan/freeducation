export type LoginContentProps = {
  errorMessage?: string;
  csrfToken?: string;
};

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const renderLoginContent = ({ errorMessage, csrfToken }: LoginContentProps = {}): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Sign in</h1>
      <p class="page-subtitle">Use your Gmail account to access your freeducation profile.</p>
    </header>
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <form class="form-card form-grid" method="POST" action="/login">
      ${csrfToken ? `<input type="hidden" name="csrf_token" value="${escapeValue(csrfToken)}" />` : ""}
      <label class="form-field">
        <span>Email</span>
        <input type="email" name="email" placeholder="you@gmail.com" autocomplete="email" required />
      </label>
      <label class="form-field">
        <span>Password</span>
        <input type="password" name="password" autocomplete="current-password" required />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">Login</button>
      </div>
      <p class="helper-text">We currently support Gmail-only access for the admin account.</p>
      <p class="helper-text">New student? <a href="/signup">Create your account</a>.</p>
    </form>
  </section>
`;
