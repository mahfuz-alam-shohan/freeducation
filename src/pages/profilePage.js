import { appShell } from './templates/shell.js';

export function profilePage(user) {
  const content = `<section class="card">
      <h3 class="card-title">Profile</h3>
      <p class="muted">Name: ${user.name}</p>
      <p class="muted">Email: ${user.email}</p>
      <p class="muted">Role: ${user.role}</p>
    </section>`;

  return appShell('profile', user, 'Your profile', 'Account details and access role.', content);
}
