import type { ModuleListItem } from "../../features/admin/modules";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type ModulesContentProps = {
  modules: ModuleListItem[];
  subjectModules: SubjectModuleRow[];
  successMessage?: string;
  errorMessage?: string;
};

type SubjectModuleRow = {
  name: string;
  slug: string;
  structure: string;
  classGroups: string;
  streams: string;
  manageUrl: string;
  manageLabel: string;
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

const renderSubjectModuleRows = (subjectModules: SubjectModuleRow[]): string => {
  if (!subjectModules.length) {
    return `
      <tr>
        <td colspan="6">No subject templates have been registered yet.</td>
      </tr>`;
  }

  return subjectModules
    .map(
      (module) => `
      <tr>
        <td>${escapeValue(module.name)}</td>
        <td>${escapeValue(module.slug)}</td>
        <td>${escapeValue(module.structure)}</td>
        <td>${escapeValue(module.classGroups)}</td>
        <td>${escapeValue(module.streams)}</td>
        <td>
          <a class="button-link" href="${escapeValue(module.manageUrl)}">${escapeValue(module.manageLabel)}</a>
        </td>
      </tr>`,
    )
    .join("");
};

export const renderModulesContent = ({ modules, subjectModules, successMessage, errorMessage }: ModulesContentProps): string => `
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
      <h2 class="section-title">Subject templates</h2>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Slug</th>
              <th>Structure</th>
              <th>Class groups</th>
              <th>Streams</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${renderSubjectModuleRows(subjectModules)}
          </tbody>
        </table>
      </div>
    </section>
  </section>
`;
