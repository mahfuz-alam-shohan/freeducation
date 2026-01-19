type SignupContentProps = {
  errorMessage?: string;
  values?: {
    name?: string;
    email?: string;
    dateOfBirth?: string;
  };
};

type VerifyContentProps = {
  errorMessage?: string;
  email?: string;
};

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const renderSignupContent = ({ errorMessage, values }: SignupContentProps = {}): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Student signup</h1>
      <p class="page-subtitle">Create your student account with a Gmail address.</p>
    </header>
    ${errorMessage ? `<div class="alert alert--error">${errorMessage}</div>` : ""}
    <form class="form-card form-grid" method="POST" action="/signup">
      <label class="form-field">
        <span>Full name</span>
        <input name="name" autocomplete="name" required value="${values?.name ? escapeValue(values.name) : ""}" />
      </label>
      <label class="form-field">
        <span>Date of birth</span>
        <input type="date" name="dateOfBirth" required value="${values?.dateOfBirth ? escapeValue(values.dateOfBirth) : ""}" />
      </label>
      <label class="form-field">
        <span>Gmail address</span>
        <input type="email" name="email" placeholder="you@gmail.com" autocomplete="email" required value="${values?.email ? escapeValue(values.email) : ""}" />
      </label>
      <label class="form-field">
        <span>Password</span>
        <input type="password" name="password" autocomplete="new-password" required minlength="8" />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">Verify</button>
      </div>
      <p class="helper-text">We will email a verification code to complete your signup.</p>
    </form>
  </section>
`;

export const renderSignupVerificationContent = ({ errorMessage, email }: VerifyContentProps = {}): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Verify your email</h1>
      <p class="page-subtitle">Enter the 6-digit code sent to your Gmail address.</p>
    </header>
    ${errorMessage ? `<div class="alert alert--error">${errorMessage}</div>` : ""}
    <form class="form-card form-grid" method="POST" action="/signup/verify">
      <label class="form-field">
        <span>Gmail address</span>
        <input type="email" name="email" readonly required value="${email ? escapeValue(email) : ""}" />
      </label>
      <label class="form-field">
        <span>Verification code</span>
        <input name="code" inputmode="numeric" autocomplete="one-time-code" required />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">Confirm</button>
      </div>
      <p class="helper-text">If the code expires, return to signup to request a new one.</p>
    </form>
  </section>
`;

export const renderSignupConfirmationContent = (): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Signup complete</h1>
      <p class="page-subtitle">Your student account is verified. You can now sign in when student login is available.</p>
    </header>
    <div class="form-card">
      <p class="helper-text">Thank you for joining Freeducation.</p>
      <div class="form-actions">
        <a class="button-link button-link--primary" href="/login">Go to sign in</a>
      </div>
    </div>
  </section>
`;
