import { appConfig, hierarchyLabels } from "./config";
import { layout, header } from "./templates";

type Hierarchy = {
  classes: Array<{ id: number; name: string; has_groups: number; is_merged: number }>;
  groups: Array<{ id: number; class_id: number; name: string }>;
  subjects: Array<{ id: number; class_id: number; group_id: number | null; name: string }>;
  chapters: Array<{ id: number; subject_id: number; name: string; position: number }>;
  subchapters: Array<{ id: number; chapter_id: number; name: string; position: number }>;
};

type QuestionRow = {
  id: number;
  prompt: string;
  sourceYear: string;
  questionType: string;
  chapter: string;
  subject: string;
  sourceEntity: string;
};

export const renderStudentHome = (hierarchy: Hierarchy) => {
  const classCards = hierarchy.classes.length
    ? hierarchy.classes
        .map(
          (item) => `
      <div class="card">
        <h3>${item.name}</h3>
        <p>${item.has_groups ? "Group-based subjects" : "Direct subjects"}</p>
        <p class="badge">${item.is_merged ? "Merged class" : "Standalone"}</p>
      </div>`
        )
        .join("")
    : `<div class="card">
      <h3>Start building the hierarchy</h3>
      <p>Add classes, subjects, and chapters from the admin dashboard.</p>
    </div>`;

  const body = `
    ${header(appConfig.tagline)}
    <main>
      <div class="container">
        <section class="hero">
          <div>
            <h1>Structured learning for SSC & HSC students</h1>
            <p>Navigate chapter-wise lessons, then practice targeted questions by source and exam pattern.</p>
            <div style="margin-top:1rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
              <a href="/smart-filter"><button>Smart Question Filter</button></a>
              <a href="/admin"><button class="secondary">Admin Dashboard</button></a>
            </div>
          </div>
          <div class="card">
            <h3>Learning vs Exam</h3>
            <ul>
              <li>Sub-chapters for concept learning.</li>
              <li>Question types for exam patterns.</li>
              <li>Source tracking by board, year, or institution.</li>
            </ul>
          </div>
        </section>
        <h2 class="section-title">${hierarchyLabels.classLabel} Directory</h2>
        <div class="card-grid">
          ${classCards}
        </div>
      </div>
    </main>
  `;

  return layout("Student Home", body);
};

export const renderSmartFilter = (
  hierarchy: Hierarchy,
  questionTypes: Array<{ id: number; name: string; chapter_id: number }>,
  questions: QuestionRow[],
  query: Record<string, string>
) => {
  const classOptions = hierarchy.classes
    .map((item) => `<option value="${item.id}" ${query.classId === String(item.id) ? "selected" : ""}>${item.name}</option>`)
    .join("");
  const subjectOptions = hierarchy.subjects
    .filter((subject) => !query.classId || String(subject.class_id) === query.classId)
    .map(
      (subject) =>
        `<option value="${subject.id}" ${query.subjectId === String(subject.id) ? "selected" : ""}>${subject.name}</option>`
    )
    .join("");
  const chapterOptions = hierarchy.chapters
    .filter((chapter) => !query.subjectId || String(chapter.subject_id) === query.subjectId)
    .map(
      (chapter) =>
        `<option value="${chapter.id}" ${query.chapterId === String(chapter.id) ? "selected" : ""}>${chapter.name}</option>`
    )
    .join("");
  const questionTypeOptions = questionTypes
    .filter((item) => !query.chapterId || String(item.chapter_id) === query.chapterId)
    .map(
      (item) =>
        `<option value="${item.id}" ${query.questionTypeId === String(item.id) ? "selected" : ""}>${item.name}</option>`
    )
    .join("");

  const questionRows = questions.length
    ? questions
        .map(
          (row) => `
      <tr>
        <td>${row.prompt}</td>
        <td>${row.chapter}</td>
        <td>${row.questionType}</td>
        <td>${row.sourceEntity} ${row.sourceYear}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4">No questions yet. Add questions from admin.</td></tr>`;

  const body = `
    ${header("Smart Question Filter")}
    <main>
      <div class="container">
        <div class="card">
          <h3>Filter questions by chapter, type, and source.</h3>
          <form method="GET" action="/smart-filter">
            <label>${hierarchyLabels.classLabel}
              <select name="classId">
                <option value="">All</option>
                ${classOptions}
              </select>
            </label>
            <label>${hierarchyLabels.subjectLabel}
              <select name="subjectId">
                <option value="">All</option>
                ${subjectOptions}
              </select>
            </label>
            <label>${hierarchyLabels.chapterLabel}
              <select name="chapterId">
                <option value="">All</option>
                ${chapterOptions}
              </select>
            </label>
            <label>${hierarchyLabels.questionTypeLabel}
              <select name="questionTypeId">
                <option value="">All</option>
                ${questionTypeOptions}
              </select>
            </label>
            <button type="submit">Apply Filters</button>
          </form>
        </div>
        <div class="card" style="margin-top:1rem;">
          <h3>Latest Questions</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Chapter</th>
                <th>Type</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${questionRows}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;

  return layout("Smart Filter", body);
};
