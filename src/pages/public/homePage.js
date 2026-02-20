import { basePage } from '../templates/base.js';

export function publicHomePage(user = null) {
  const authActions = user
    ? `<a class="btn btn-primary" href="/dashboard">Open workspace</a> <a class="btn btn-ghost" href="/profile">Profile</a>`
    : `<a class="btn btn-primary" href="/login">Login</a>`;

  return basePage(
    'Freeducation',
    `<main class="container section-gap-sm">
      <section class="card section-stack">
        <p class="badge badge-info">Public page</p>
        <h1 class="page-title">Freeducation</h1>
        <p class="page-subtitle">A content-first workspace with role-based access. This page stays public for everyone.</p>
        <div class="inline-actions">${authActions}</div>
      </section>
    </main>`
  );
}
