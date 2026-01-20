import type { SubjectClassGroup, SubjectDetail } from "../../../features/admin/modules";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type ClassOption = {
  label: string;
  classSubjectId: number;
  classGroupSlug: string;
};

const expandClassOptions = (classGroups: SubjectClassGroup[], splitCombined: boolean): ClassOption[] => {
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
    if (splitCombined && group.classGroupSlug === "9-10") {
      return [
        { label: "Class 9", classSubjectId: group.classSubjectId, classGroupSlug: group.classGroupSlug },
        { label: "Class 10", classSubjectId: group.classSubjectId, classGroupSlug: group.classGroupSlug },
      ];
    }

    if (splitCombined && group.classGroupSlug === "11-12") {
      return [
        { label: "Class 11", classSubjectId: group.classSubjectId, classGroupSlug: group.classGroupSlug },
        { label: "Class 12", classSubjectId: group.classSubjectId, classGroupSlug: group.classGroupSlug },
      ];
    }

    return [{ label: group.classGroupName, classSubjectId: group.classSubjectId, classGroupSlug: group.classGroupSlug }];
  });
};

type SubjectDetailContentProps = {
  subject: SubjectDetail;
  classGroups: SubjectClassGroup[];
  selectedClassSubjectId?: number;
  successMessage?: string;
  errorMessage?: string;
};

const renderClassGroupLinks = (
  subjectId: number,
  classGroups: SubjectClassGroup[],
  subjectSlug: string,
  selected?: number,
): string => {
  if (!classGroups.length) {
    return "<p class=\"helper-text\">No class groups assigned to this subject.</p>";
  }

  const options = expandClassOptions(classGroups, subjectSlug !== "bangla");

  return `
    <div class="card-grid">
      ${options
        .map((option) => {
          const active = option.classSubjectId === selected;
          const path =
            subjectSlug === "bangla" && (option.classGroupSlug === "9-10" || option.classGroupSlug === "11-12")
              ? `/admin/modules/subjects/bangla/${option.classGroupSlug}`
              : `/admin/modules/subjects/${subjectId}?classSubjectId=${option.classSubjectId}`;
          return `
            <a class="card-link ${active ? "card-link--active" : ""}" href="${path}">
              <span class="card-title">${escapeValue(option.label)}</span>
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
      ${renderClassGroupLinks(subject.id, classGroups, subject.slug, selectedClassSubjectId)}
    </section>
  </section>
`;
