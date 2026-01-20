export type SubjectTemplateRow = {
  name: string;
  slug: string;
  structure: string;
  classGroups: string;
  streams: string;
  manageUrl: string;
  manageLabel: string;
};

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderSubjectRows = (subjects: SubjectTemplateRow[]): string => {
  if (!subjects.length) {
    return `
      <tr>
        <td colspan="6">No subject templates have been registered yet.</td>
      </tr>`;
  }

  return subjects
    .map((subject) => {
      return `
        <tr>
          <td>${escapeValue(subject.name)}</td>
          <td>${escapeValue(subject.slug)}</td>
          <td>${escapeValue(subject.structure)}</td>
          <td>${escapeValue(subject.classGroups)}</td>
          <td>${escapeValue(subject.streams)}</td>
          <td>
            <a class="button-link" href="${escapeValue(subject.manageUrl)}">${escapeValue(subject.manageLabel)}</a>
          </td>
        </tr>`;
    })
    .join("");
};

type SubjectsModuleContentProps = {
  subjects: SubjectTemplateRow[];
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
      <p class="page-subtitle">Select a subject template to manage classes, chapters, and content.</p>
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
              <th>Structure</th>
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
