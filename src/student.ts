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
      <a href="/admin/login" style="color:var(--text-sub); padding:8px;">${iconLock}</a>
    </div>
  </header>
`;

export const renderStudentHome = (hierarchy: Hierarchy) => {
  if (!hierarchy.classes || hierarchy.classes.length === 0) {
    return layout("Home", `${header()}<main class="container" style="text-align:center; padding-top:40px;"><h3 style="color:var(--text-sub);">No Content Available</h3></main>`);
  }

  const classList = hierarchy.classes.map((c) => `
    <div class="class-row">
      <div>
        <div style="font-weight:600; font-size:16px;">${c.name}</div>
        <div style="font-size:13px; color:var(--text-sub); margin-top:2px;">
          ${c.has_groups ? "Science, Arts, Commerce" : "General Curriculum"}
        </div>
      </div>
      <a href="/smart-filter?classId=${c.id}">
        <button class="btn-secondary btn-small">Enter</button>
      </a>
    </div>
  `).join("");

  return layout("Home", `
    ${header()}
    <main class="container">
      <div style="margin-top:24px; margin-bottom:12px; font-weight:600; font-size:13px; color:var(--text-sub); text-transform:uppercase;">Select Class</div>
      <div class="class-list">${classList}</div>
      <div style="margin-top:24px;">
        <a href="/smart-filter"><button class="btn-accent">Smart Question Search</button></a>
      </div>
    </main>
  `);
};

export const renderSmartFilter = (
  hierarchy: Hierarchy,
  questionTypes: any[],
  questions: any[],
  query: Record<string, string>
) => {
  // 1. Determine Groups for Selected Class
  const selectedClass = hierarchy.classes.find(c => String(c.id) === query.classId);
  const classGroups = selectedClass && selectedClass.has_groups 
    ? hierarchy.groups.filter(g => String(g.class_id) === query.classId)
    : [];

  // 2. Filter Subjects based on Class AND Group (NCTB Logic)
  // If a group is selected, show Common Subjects (group_id is null) AND that group's subjects
  const filteredSubjects = hierarchy.subjects.filter(s => {
    if (!query.classId) return true; // Show all if no class selected (edge case)
    if (String(s.class_id) !== query.classId) return false; // Must match class
    
    // If class has no groups, show all its subjects
    if (!selectedClass?.has_groups) return true;

    // If Class Has Groups:
    if (!query.groupId) {
      // No group selected yet? Show ONLY Common subjects (safer UX) or All?
      // Let's show Common Only to force Group selection for specific ones
      return s.group_id === null; 
    } else {
      // Group Selected: Show Common OR Matching Group
      return s.group_id === null || String(s.group_id) === query.groupId;
    }
  });

  const filteredChapters = hierarchy.chapters.filter(c => !query.subjectId || String(c.subject_id) === query.subjectId);

  // Helper generators
  const genOpts = (items: any[], selected: string) => `<option value="">Select...</option>` + items.map(i => `<option value="${i.id}" ${String(i.id) === selected ? "selected" : ""}>${i.name}</option>`).join("");

  // Question List Rendering
  const questionList = questions.length ? questions.map(q => `
      <div class="card" style="margin-bottom:12px;">
        <div class="card-body">
          <div style="font-weight:500; font-size:15px; margin-bottom:8px;">${q.prompt}</div>
          ${q.imageUrl ? `<a href="${q.imageUrl}" target="_blank" style="font-size:13px; color:var(--accent); display:block; margin-bottom:8px;">View Image</a>` : ''}
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <span class="badge badge-blue">${q.questionType}</span>
            <span class="badge badge-gray">${q.chapter}</span>
            <span class="badge badge-gray">${q.sourceEntity} '${q.sourceYear}</span>
          </div>
        </div>
      </div>
    `).join("") : `<div style="text-align:center; padding:32px; color:var(--text-sub);">No questions found. Try adjusting filters.</div>`;

  const body = `
    ${header()}
    <main class="container">
      <div class="card" style="margin-top:16px;">
        <div class="card-header">Smart Search</div>
        <div class="card-body">
          <form method="GET" action="/smart-filter" class="form-stack">
            
            <!-- Class Selection -->
            <div class="input-group">
              <label>Class</label>
              <select name="classId" onchange="this.form.submit()">
                <option value="">-- Select Class --</option>
                ${hierarchy.classes.map(c => `<option value="${c.id}" ${String(c.id) === query.classId ? "selected" : ""}>${c.name}</option>`).join("")}
              </select>
            </div>

            <!-- Dynamic Group Selection (Only if Class has groups) -->
            ${classGroups.length > 0 ? `
              <div class="input-group" style="background:#f0f9ff; padding:8px; border-radius:6px; border:1px dashed #bae6fd;">
                <label style="color:#0369a1;">Select Group / Stream</label>
                <select name="groupId" onchange="this.form.submit()">
                  <option value="">-- General / Common --</option>
                  ${classGroups.map(g => `<option value="${g.id}" ${String(g.id) === query.groupId ? "selected" : ""}>${g.name}</option>`).join("")}
                </select>
              </div>
            ` : ''}

            <!-- Subject & Chapter -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="input-group">
                <label>Subject</label>
                <select name="subjectId" onchange="this.form.submit()">${genOpts(filteredSubjects, query.subjectId)}</select>
              </div>
              <div class="input-group">
                <label>Chapter</label>
                <select name="chapterId" onchange="this.form.submit()">${genOpts(filteredChapters, query.chapterId)}</select>
              </div>
            </div>

            <button type="submit" class="btn-primary">Find Questions</button>
          </form>
        </div>
      </div>

      <div style="margin-bottom:8px; font-weight:600; color:var(--text-sub); font-size:13px;">RESULTS</div>
      ${questionList}
    </main>
  `;

  return layout("Search", body);
};


