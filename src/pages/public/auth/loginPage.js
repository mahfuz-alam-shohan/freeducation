import { loginScript } from "../../assets.js";
import { publicShell } from "../../templates/publicShell.js";
import { loginPageStyles } from "./loginPageStyles.js";

export function loginPage() {
  return publicShell(
    "login",
    null,
    "Login",
    `<section class="public-login-shell"><section class="auth-card public-auth-card"><h1 class="page-title">Login</h1><p class="page-subtitle">Access your workspace.</p><p id="error" class="error"></p><form id="login-form" class="form-grid">
      <label>Email</label><input required class="input" name="email" type="email" />
      <label>Password</label><input required class="input" name="password" type="password" />
      <button class="btn btn-primary" type="submit">Login</button></form></section></section>`,
    loginScript,
    loginPageStyles,
  );
}
