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
        <td colspan="3">No modules have been registered yet.</td>
      </tr>`;
  }

  return modules
    .map(
      (module) => `
      <tr>
        <td>${escapeValue(module.name)}</td>
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
      <p class="page-subtitle">Modules are defined in code and synced automatically.</p>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
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
  </section>
`;
