import { basePage } from '../templates/base.js';

export function publicHomePage(user = null) {
  const authActions = user
    ? `<a class="btn btn-primary" href="/dashboard">Open workspace</a> <a class="btn btn-ghost" href="/profile">Profile</a>`
    : `<a class="btn btn-primary" href="/login">Login</a>`;

  return basePage(
    'Freeducation',
    `<main class="container" style="padding-top:24px;">
      <section class="card">
        <p class="badge badge-info">Public page</p>
        <h1 class="page-title">Freeducation</h1>
        <p class="page-subtitle">A content-first workspace with role-based access. This page stays public for everyone.</p>
        <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">${authActions}</div>
      </section>
    </main>`
  );
}
