import { basePage } from "../../templates/base.js";

export function forbiddenPage() {
  return basePage(
    "Forbidden",
    `<main class="container" style="padding-top:24px;">
      <section class="card">
        <p class="badge badge-warn">403</p>
        <h1 class="page-title">Access denied</h1>
        <p class="page-subtitle">Your account does not have permission to open this page.</p>
        <a class="btn btn-primary" href="/dashboard" style="margin-top:12px; display:inline-flex; align-items:center;">Back to workspace</a>
      </section>
    </main>`,
  );
}
