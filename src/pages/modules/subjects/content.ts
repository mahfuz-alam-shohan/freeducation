import type { ClassGroup, SubjectListItem } from "../../../features/admin/modules";
import type { SubjectTemplate } from "../../../modules/subjects/types";

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

const renderClassGroupOptions = (classGroups: ClassGroup[]): string => {
  if (!classGroups.length) {
    return `<p class="helper-text">No class groups available. Create one first.</p>`;
  }

  return classGroups
    .map(
      (group) => `
      <label class="form-field">
        <span>
          <input type="checkbox" name="classGroupIds" value="${group.id}" />
          ${escapeValue(group.name)} (${escapeValue(group.slug)})
        </span>
      </label>`,
    )
    .join("");
};

const renderTemplateOptions = (templates: SubjectTemplate[]): string => {
  if (!templates.length) {
    return `<option value="">No templates available</option>`;
  }

  return templates
    .map((template) => `<option value="${escapeValue(template.slug)}">${escapeValue(template.name)}</option>`)
    .join("");
};

type SubjectsModuleContentProps = {
  subjects: SubjectListItem[];
  classGroups: ClassGroup[];
  templates: SubjectTemplate[];
  successMessage?: string;
  errorMessage?: string;
};

export const renderSubjectsModuleContent = ({
  subjects,
  classGroups,
  templates,
  successMessage,
  errorMessage,
}: SubjectsModuleContentProps): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Subjects module</h1>
      <p class="page-subtitle">Create subjects and assign them to class groups for module-based content.</p>
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
    <section class="page-section">
      <div class="form-card">
        <h2 class="section-title">Add class group</h2>
        <form class="form-grid" method="post" action="/admin/modules/subjects/class-groups">
          <label class="form-field">
            <span>Name</span>
            <input name="name" required />
          </label>
          <label class="form-field">
            <span>Slug</span>
            <input name="slug" required placeholder="e.g. 9-10" />
          </label>
          <label class="form-field">
            <span>Description</span>
            <input name="description" />
          </label>
          <div class="form-actions">
            <button type="submit" class="button-link">Add class group</button>
          </div>
        </form>
      </div>
    </section>
    <section class="page-section">
      <div class="form-card">
        <h2 class="section-title">Add subject</h2>
        <form class="form-grid" method="post" action="/admin/modules/subjects">
          <label class="form-field">
            <span>Name</span>
            <input name="name" required />
          </label>
          <label class="form-field">
            <span>Slug</span>
            <input name="slug" required placeholder="e.g. mathematics" />
          </label>
          <label class="form-field">
            <span>Template</span>
            <select name="templateSlug" required>
              ${renderTemplateOptions(templates)}
            </select>
          </label>
          <label class="form-field">
            <span>Description</span>
            <input name="description" />
          </label>
          <label class="form-field">
            <span>Stream</span>
            <select name="stream">
              <option value="core">Core</option>
              <option value="science">Science</option>
              <option value="business">Business</option>
              <option value="humanities">Humanities</option>
              <option value="optional">Optional</option>
            </select>
          </label>
          <label class="form-field">
            <span>Two paper subject</span>
            <select name="isTwoPaper">
              <option value="0" selected>No</option>
              <option value="1">Yes</option>
            </select>
          </label>
          <label class="form-field">
            <span>Optional subject</span>
            <select name="isOptional">
              <option value="0" selected>No</option>
              <option value="1">Yes</option>
            </select>
          </label>
          <div class="form-field">
            <span>Class groups</span>
            ${renderClassGroupOptions(classGroups)}
          </div>
          <div class="form-actions">
            <button type="submit" class="button-link button-link--primary">Create subject</button>
          </div>
        </form>
      </div>
    </section>
  </section>
`;
