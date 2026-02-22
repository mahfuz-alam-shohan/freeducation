import { basePage } from "../../templates/base.js";
import { forbiddenStyles } from "./forbiddenStyles.js";

export function forbiddenPage() {
  return basePage(
    "Forbidden",
    `<main class="container forbidden-container">
      <section class="card">
        <p class="badge badge-warn">403</p>
        <h1 class="page-title">Access denied</h1>
        <p class="page-subtitle">Your account does not have permission to open this page.</p>
        <a class="btn btn-primary forbidden-back-btn" href="/dashboard">Back to workspace</a>
      </section>
    </main>`,
    "",
    forbiddenStyles,
  );
}
