import type { SubjectClassGroup, SubjectDetail } from "../../../features/admin/modules";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type SubjectDetailContentProps = {
  subject: SubjectDetail;
  classGroups: SubjectClassGroup[];
  selectedClassSubjectId?: number;
  successMessage?: string;
  errorMessage?: string;
};

const renderClassGroupLinks = (subjectId: number, classGroups: SubjectClassGroup[], selected?: number): string => {
  if (!classGroups.length) {
    return "<p class=\"helper-text\">No class groups assigned to this subject.</p>";
  }

  return `
    <div class="page-actions">
      ${classGroups
        .map((group) => {
          const active = group.classSubjectId === selected;
          return `
            <a class="button-link ${active ? "button-link--primary" : ""}" href="/admin/modules/subjects/${subjectId}?classSubjectId=${group.classSubjectId}">
              ${escapeValue(group.classGroupName)} (${escapeValue(group.classGroupSlug)})
            </a>`;
        })
        .join("")}
    </div>`;
};

export const renderSubjectDetailContent = ({
  subject,
  classGroups,
  selectedClassSubjectId,
  successMessage,
  errorMessage,
}: SubjectDetailContentProps): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">${escapeValue(subject.name)}</h1>
      <p class="page-subtitle">Select a class to continue.</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects">Back to subjects</a>
        <form method="post" action="/admin/modules/subjects/${subject.id}/delete" style="display:inline">
          <button type="submit" class="button-link button-link--danger">Delete subject</button>
        </form>
      </div>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <h2 class="section-title">Class selection</h2>
      ${renderClassGroupLinks(subject.id, classGroups, selectedClassSubjectId)}
    </section>
    <section class="page-section">
      <h2 class="section-title">Structure</h2>
      ${
        selectedClassSubjectId
          ? `<p class="helper-text">Structure setup is empty right now. This is ready for future database and R2-backed content.</p>`
          : `<p class="helper-text">Select a class to continue.</p>`
      }
    </section>
  </section>
`;
