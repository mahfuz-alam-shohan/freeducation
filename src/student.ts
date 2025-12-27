import { appConfig } from "./config";
import { layout } from "./templates";

// Reuse types from other files or define common interface
type Hierarchy = {
  classes: Array<{ id: number; name: string; has_groups: number; is_merged: number }>;
  groups: Array<{ id: number; class_id: number; name: string }>;
  subjects: Array<{ id: number; class_id: number; group_id: number | null; name: string }>;
  chapters: Array<{ id: number; subject_id: number; name: string; position: number }>;
  subchapters: Array<{ id: number; chapter_id: number; name: string; position: number }>;
};

// Render Public Header
const publicHeader = () => `
  <header class="site-header">
    <div class="container flex justify-between" style="width:100%;">
      <a href="/" class="logo">
        <span style="font-size:1.5rem;">🎓</span> ${appConfig.siteName}
      </a>
      <a href="/admin/login" class="admin-link" title="Admin Login">
        🔒
      </a>
    </div>
  </header>
`;

export const renderStudentHome = (hierarchy: Hierarchy) => {
  const classCards = hierarchy.classes.length
    ? hierarchy.classes
        .map(
          (item) => `
      <div class="class-card">
        <div style="font-size:2rem; margin-bottom:0.5rem;">📚</div>
        <h3 style="font-size:1.25rem;">${item.name}</h3>
        <p class="text-sm text-muted" style="margin-top:0.5rem;">${item.has_groups ? "Science, Arts, Commerce" : "General Subjects"}</p>
        <button class="secondary" style="margin-top:1rem; width:100%;">Explore</button>
      </div>`
        )
        .join("")
    : `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:#94a3b8;">
        <h3>Content coming soon...</h3>
        <p>The curriculum is being updated.</p>
       </div>`;

  const body = `
    ${publicHeader()}
    <main>
      <section class="hero-section">
        <div class="container">
          <h1 style="font-size:2.5rem; color:#0f172a; margin-bottom:1rem;">Master Your Curriculum</h1>
          <p style="font-size:1.1rem; color:#64748b; max-width:600px; margin:0 auto 2rem;">
            Access free lecture notes, videos, and question banks tailored for the Bangladesh education board.
          </p>
          <div class="flex gap-4" style="justify-content:center;">
            <a href="/smart-filter"><button class="accent" style="padding:0.8rem 1.5rem; font-size:1rem;">Start Practicing</button></a>
          </div>
        </div>
      </section>

      <div class="container" style="padding-top:2rem; padding-bottom:3rem;">
        <h2 style="font-size:1.5rem; border-left:4px solid var(--accent); padding-left:1rem;">Browse by Class</h2>
        <div class="class-grid">
          ${classCards}
        </div>
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
  // Options logic reused from before, just wrapped in new HTML structure
  const classOptions = hierarchy.classes.map(i => `<option value="${i.id}" ${query.classId === String(i.id) ? "selected" : ""}>${i.name}</option>`).join("");
  // ... (Shortened for brevity, assume similar filter logic as previous logic but using new layout)
  
  // Re-implementing filter render logic with new styles:
  const subjectOptions = hierarchy.subjects
      .filter((s) => !query.classId || String(s.class_id) === query.classId)
      .map((s) => `<option value="${s.id}" ${query.subjectId === String(s.id) ? "selected" : ""}>${s.name}</option>`)
      .join("");
      
  const chapterOptions = hierarchy.chapters
      .filter((c) => !query.subjectId || String(c.subject_id) === query.subjectId)
      .map((c) => `<option value="${c.id}" ${query.chapterId === String(c.id) ? "selected" : ""}>${c.name}</option>`)
      .join("");

  const typeOptions = questionTypes
      .filter((t) => !query.chapterId || String(t.chapter_id) === query.chapterId)
      .map((t) => `<option value="${t.id}" ${query.questionTypeId === String(t.id) ? "selected" : ""}>${t.name}</option>`)
      .join("");

  const rows = questions.length ? questions.map(q => `
    <tr>
      <td>
        <div class="font-bold">${q.prompt}</div>
        ${q.imageUrl ? `<a href="${q.imageUrl}" target="_blank" class="text-xs text-accent">View Image</a>` : ''}
      </td>
      <td><span class="badge blue">${q.questionType}</span></td>
      <td class="text-sm">${q.chapter}</td>
      <td class="text-xs text-muted">${q.sourceEntity} '${q.sourceYear}</td>
    </tr>
  `).join("") : '<tr><td colspan="4" class="text-center text-muted">No questions match these filters.</td></tr>';

  const body = `
    ${publicHeader()}
    <main class="container" style="padding-top:2rem;">
      <div class="card" style="margin-bottom:2rem;">
        <div class="card-header"><h3>Smart Question Filter</h3></div>
        <form method="GET" action="/smart-filter" class="form-grid-3" style="display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <div><label>Class</label><select name="classId" onchange="this.form.submit()"><option value="">All Classes</option>${classOptions}</select></div>
          <div><label>Subject</label><select name="subjectId" onchange="this.form.submit()"><option value="">All Subjects</option>${subjectOptions}</select></div>
          <div><label>Chapter</label><select name="chapterId" onchange="this.form.submit()"><option value="">All Chapters</option>${chapterOptions}</select></div>
          <div><label>Type</label><select name="questionTypeId"><option value="">All Types</option>${typeOptions}</select></div>
          <div style="display:flex; align-items:flex-end;"><button type="submit" class="accent" style="width:100%;">Apply Filter</button></div>
        </form>
      </div>

      <div class="table-wrapper">
        <table>
          <thead><tr><th>Question</th><th>Type</th><th>Chapter</th><th>Source</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </main>
  `;
  return layout("Smart Filter", body);
};


