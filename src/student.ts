import { appConfig } from "./config";
import { layout, iconHat, iconLock } from "./templates";

type Hierarchy = {
  classes: Array<{ id: number; name: string; has_groups: number; is_merged: number }>;
  groups: Array<{ id: number; class_id: number; name: string }>;
  subjects: Array<{ id: number; class_id: number; group_id: number | null; name: string }>;
  chapters: Array<{ id: number; subject_id: number; name: string; position: number }>;
  subchapters: Array<{ id: number; chapter_id: number; name: string; position: number }>;
};

const header = () => `
  <header class="app-header">
    <div class="brand">
      ${iconHat}
      <span>${appConfig.siteName}</span>
    </div>
    <div class="header-action-right">
      <a href="/admin/login" style="color:var(--text-sub); padding:8px;">
        ${iconLock}
      </a>
    </div>
  </header>
`;

export const renderStudentHome = (hierarchy: Hierarchy) => {
  // If no classes exist, show empty state
  if (!hierarchy.classes || hierarchy.classes.length === 0) {
    const body = `
      ${header()}
      <main class="container" style="text-align:center; padding-top:40px;">
        <div style="font-size:40px; margin-bottom:16px;">📚</div>
        <h3 style="color:var(--text-main);">No Content Available</h3>
        <p style="color:var(--text-sub);">Check back later for updates.</p>
      </main>
    `;
    return layout("Home", body);
  }

  // List classes purely
  const classList = hierarchy.classes
    .map(
      (c) => `
    <div class="class-row">
      <div>
        <div style="font-weight:600; font-size:16px;">${c.name}</div>
        <div style="font-size:13px; color:var(--text-sub); margin-top:2px;">
          ${c.has_groups ? "Groups: Science, Arts, Commerce" : "General Subjects"}
        </div>
      </div>
      <a href="/smart-filter?classId=${c.id}" style="display:flex; align-items:center;">
        <button class="btn-secondary btn-small">Open</button>
      </a>
    </div>
  `
    )
    .join("");

  const body = `
    ${header()}
    <main class="container">
      <div style="margin-top:24px; margin-bottom:12px; font-weight:600; font-size:14px; color:var(--text-sub); text-transform:uppercase;">
        Academic Levels
      </div>
      <div class="class-list">
        ${classList}
      </div>
      
      <div style="margin-top:32px;">
        <a href="/smart-filter">
          <button class="btn-accent">Search Question Bank</button>
        </a>
      </div>
    </main>
  `;

  return layout("Home", body);
};

export const renderSmartFilter = (
  hierarchy: Hierarchy,
  questionTypes: any[],
  questions: any[],
  query: Record<string, string>
) => {
  // --- Options Generators (Tight) ---
  const genOptions = (items: any[], selectedId: string, labelKey = "name") => 
    `<option value="">All</option>` + 
    items.map(i => `<option value="${i.id}" ${String(i.id) === selectedId ? "selected" : ""}>${i[labelKey]}</option>`).join("");

  // Filter Logic
  const filteredSubjects = hierarchy.subjects.filter(s => !query.classId || String(s.class_id) === query.classId);
  const filteredChapters = hierarchy.chapters.filter(c => !query.subjectId || String(c.subject_id) === query.subjectId);

  // --- Questions List ---
  const questionList = questions.length 
    ? questions.map(q => `
      <div class="card" style="margin-bottom:12px;">
        <div class="card-body">
          <div style="font-weight:500; font-size:15px; margin-bottom:8px;">${q.prompt}</div>
          ${q.imageUrl ? `<a href="${q.imageUrl}" target="_blank" style="font-size:13px; color:var(--accent); display:block; margin-bottom:8px;">View Image Attachment</a>` : ''}
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <span class="badge badge-blue">${q.questionType}</span>
            <span class="badge badge-gray">${q.chapter}</span>
            <span class="badge badge-gray">${q.sourceEntity} '${q.sourceYear}</span>
          </div>
        </div>
      </div>
    `).join("") 
    : `<div style="text-align:center; padding:32px; color:var(--text-sub);">No questions match filters.</div>`;

  const body = `
    ${header()}
    <main class="container">
      <div class="card" style="margin-top:16px;">
        <div class="card-header">Filter Criteria</div>
        <div class="card-body">
          <form method="GET" action="/smart-filter" class="form-stack">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="input-group">
                <label>Class</label>
                <select name="classId" onchange="this.form.submit()">${genOptions(hierarchy.classes, query.classId)}</select>
              </div>
              <div class="input-group">
                <label>Subject</label>
                <select name="subjectId" onchange="this.form.submit()">${genOptions(filteredSubjects, query.subjectId)}</select>
              </div>
            </div>
            <div class="input-group">
              <label>Chapter</label>
              <select name="chapterId" onchange="this.form.submit()">${genOptions(filteredChapters, query.chapterId)}</select>
            </div>
            <button type="submit" class="btn-primary">Apply Filters</button>
          </form>
        </div>
      </div>

      <div style="margin-bottom:8px; font-weight:600; color:var(--text-sub); font-size:13px;">RESULTS</div>
      ${questionList}
    </main>
  `;

  return layout("Smart Filter", body);
};


