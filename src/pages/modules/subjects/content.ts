import type { SubjectListItem } from "../../../features/admin/modules";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderSubjectRows = (subjects: SubjectListItem[]): string => {
  if (!subjects.length) {
    return `
      <tr>
        <td colspan="6">No subjects yet. Add the first subject using the form below.</td>
      </tr>`;
  }

  return subjects
    .map((subject) => {
      const groups = subject.classGroups.length ? subject.classGroups.join(", ") : "-";
      const streams = subject.streams.length ? subject.streams.join(", ") : "-";
      return `
        <tr>
          <td>${escapeValue(subject.name)}</td>
          <td>${escapeValue(subject.slug)}</td>
          <td>${escapeValue(subject.templateSlug ?? "-")}</td>
          <td>${escapeValue(groups)}</td>
          <td>${escapeValue(streams)}</td>
          <td>
            <a class="button-link" href="/admin/modules/subjects/${subject.id}">Manage</a>
          </td>
        </tr>`;
    })
    .join("");
};

type SubjectsModuleContentProps = {
  subjects: SubjectListItem[];
  successMessage?: string;
  errorMessage?: string;
};

export const renderSubjectsModuleContent = ({
  subjects,
  successMessage,
  errorMessage,
}: SubjectsModuleContentProps): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Subjects module</h1>
      <p class="page-subtitle">Subjects are defined in code. Use this area to manage chapters, topics, and content.</p>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Slug</th>
              <th>Template</th>
              <th>Class groups</th>
              <th>Streams</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${renderSubjectRows(subjects)}
          </tbody>
        </table>
      </div>
    </section>
  </section>
`;
