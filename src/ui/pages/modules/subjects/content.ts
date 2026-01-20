export type SubjectTemplateRow = {
  name: string;
  manageUrl: string;
  manageLabel: string;
};

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderSubjectRows = (subjects: SubjectTemplateRow[]): string => {
  if (!subjects.length) {
    return `
      <tr>
        <td colspan="1">No subject templates have been registered yet.</td>
      </tr>`;
  }

  return subjects
    .map((subject) => {
      return `
        <tr>
          <td>
            <a class="table-row-link" href="${escapeValue(subject.manageUrl)}">
              <div style="font-weight: 500; margin-bottom: 2px;">${escapeValue(subject.name)}</div>
              <div class="table-meta">${escapeValue(subject.manageLabel)}</div>
            </a>
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
      <h1 class="page-title">Subjects</h1>
      <p class="page-subtitle">Select a subject to manage class-specific content.</p>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Subject</th>
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
