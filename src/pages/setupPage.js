import { setupScript } from './assets.js';
import { basePage } from './templates/base.js';

export function setupPage() {
  return basePage(
    'Create Admin',
    `<div class="center-wrap"><section class="auth-card"><p class="badge badge-info">Bootstrap</p><h1 class="page-title">Create admin account</h1><p class="page-subtitle">Initialize your workspace once, then invite your team.</p><p id="error" class="error"></p><form id="setup-form" class="form-grid">
      <label>Name</label><input required class="input" name="name" maxlength="100" />
      <label>Email</label><input required class="input" name="email" type="email" maxlength="190" />
      <label>Password</label><input required class="input" name="password" type="password" minlength="8" maxlength="120" />
      <label>Profile picture</label><input id="image" class="input" name="image" type="file" accept="image/*" />
      <button class="btn btn-primary" type="submit">Create admin</button></form></section></div>`,
    setupScript
  );
}
