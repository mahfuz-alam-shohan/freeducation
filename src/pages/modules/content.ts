import type { ModuleListItem } from "../../features/admin/modules";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type ModulesContentProps = {
  modules: ModuleListItem[];
  successMessage?: string;
  errorMessage?: string;
};

const renderModuleRows = (modules: ModuleListItem[]): string => {
  if (!modules.length) {
    return `
      <tr>
        <td colspan="5">No modules have been registered yet.</td>
      </tr>`;
  }

  return modules
    .map(
      (module) => `
      <tr>
        <td>${escapeValue(module.name)}</td>
        <td>${escapeValue(module.slug)}</td>
        <td>${escapeValue(module.description ?? "")}</td>
        <td>${module.isActive ? "Active" : "Inactive"}</td>
        <td>
          ${
            module.isActive
              ? `<a class="button-link" href="/admin/modules/${escapeValue(module.slug)}">Open</a>`
              : ""
          }
        </td>
      </tr>`,
    )
    .join("");
};

export const renderModulesContent = ({ modules, successMessage, errorMessage }: ModulesContentProps): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Modules</h1>
      <p class="page-subtitle">Enable and manage admin modules without changing core code.</p>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${renderModuleRows(modules)}
          </tbody>
        </table>
      </div>
    </section>
    <section class="page-section">
      <div class="form-card">
        <h2 class="section-title">Add module</h2>
        <form class="form-grid" method="post" action="/admin/modules">
          <label class="form-field">
            <span>Name</span>
            <input name="name" required />
          </label>
          <label class="form-field">
            <span>Slug</span>
            <input name="slug" required placeholder="e.g. subjects" />
          </label>
          <label class="form-field">
            <span>Description</span>
            <input name="description" />
          </label>
          <label class="form-field">
            <span>Status</span>
            <select name="isActive">
              <option value="1" selected>Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>
          <div class="form-actions">
            <button type="submit" class="button-link button-link--primary">Create module</button>
          </div>
        </form>
      </div>
    </section>
  </section>
`;
