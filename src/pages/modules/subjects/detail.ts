import type { SubjectClassGroup, SubjectDetail } from "../../../features/admin/modules";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type ClassOption = {
  label: string;
  classSubjectId: number;
};

const expandClassOptions = (classGroups: SubjectClassGroup[]): ClassOption[] => {
  const order = ["9-10", "11-12"];
  const sorted = [...classGroups].sort((a, b) => {
    const aIndex = order.indexOf(a.classGroupSlug);
    const bIndex = order.indexOf(b.classGroupSlug);
    if (aIndex === -1 && bIndex === -1) {
      return a.classGroupName.localeCompare(b.classGroupName);
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return sorted.flatMap((group) => {
    if (group.classGroupSlug === "9-10") {
      return [
        { label: "Class 9", classSubjectId: group.classSubjectId },
        { label: "Class 10", classSubjectId: group.classSubjectId },
      ];
    }

    if (group.classGroupSlug === "11-12") {
      return [
        { label: "Class 11", classSubjectId: group.classSubjectId },
        { label: "Class 12", classSubjectId: group.classSubjectId },
      ];
    }

    return [{ label: group.classGroupName, classSubjectId: group.classSubjectId }];
  });
};

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

  const options = expandClassOptions(classGroups);

  return `
    <div class="page-actions">
      ${options
        .map((option) => {
          const active = option.classSubjectId === selected;
          return `
            <a class="button-link ${active ? "button-link--primary" : ""}" href="/admin/modules/subjects/${subjectId}?classSubjectId=${option.classSubjectId}">
              ${escapeValue(option.label)}
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
      </div>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <h2 class="section-title">Class selection</h2>
      ${renderClassGroupLinks(subject.id, classGroups, selectedClassSubjectId)}
    </section>
  </section>
`;
