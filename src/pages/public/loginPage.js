import { loginScript } from '../assets.js';
import { basePage } from '../templates/base.js';

export function loginPage() {
  return basePage(
    'Admin Login',
    `<div class="center-wrap"><section class="auth-card"><p class="badge badge-info">Secure Login</p><h1 class="page-title">Welcome back</h1><p class="page-subtitle">Access your workspace dashboard.</p><p id="error" class="error"></p><form id="login-form" class="form-grid">
      <label>Email</label><input required class="input" name="email" type="email" />
      <label>Password</label><input required class="input" name="password" type="password" />
      <button class="btn btn-primary" type="submit">Login</button></form></section></div>`,
    loginScript
  );
}
