import { appConfig, hierarchyLabels } from "./config";
import { layout } from "./templates";

// --- Components ---

const renderSidebar = (currentView: string) => {
  const links = [
    { id: "overview", label: "📊 Overview" },
    { id: "structure", label: "🏗️ Structure" },
    { id: "chapters", label: "📖 Chapters" },
    { id: "content", label: "📚 Content" },
    { id: "questions", label: "❓ Questions" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  return `
    <nav class="admin-nav">
      ${links
        .map(
          (link) =>
            `<a href="/admin?view=${link.id}" class="nav-item ${
              currentView === link.id ? "active" : ""
            }">${link.label}</a>`
        )
        .join("")}
      <div style="flex-grow:1;"></div>
      <form action="/admin/logout" method="POST" style="padding:1rem;">
        <button type="submit" style="width:100%; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.1);">Logout</button>
      </form>
    </nav>
  `;
};

// --- View Renderers ---

const renderOverview = (data: any) => `
  <div class="card">
    <div class="card-header"><h3>Dashboard Overview</h3></div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem;">
      <div style="text-align:center; padding:1rem; background:#f8fafc; border-radius:6px;">
        <div class="text-xs text-muted">Total Questions</div>
        <div style="font-size:1.5rem; font-weight:700; color:var(--accent);">${data.questions.length}</div>
      </div>
      <div style="text-align:center; padding:1rem; background:#f8fafc; border-radius:6px;">
        <div class="text-xs text-muted">Materials</div>
        <div style="font-size:1.5rem; font-weight:700;">${data.learningMaterials.length}</div>
      </div>
      <div style="text-align:center; padding:1rem; background:#f8fafc; border-radius:6px;">
        <div class="text-xs text-muted">Classes</div>
        <div style="font-size:1.5rem; font-weight:700;">${data.hierarchy.classes.length}</div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header"><h3>Recent Activity</h3></div>
    <p class="text-sm text-muted">System ready. Select a tab from the menu to manage content.</p>
  </div>
`;

const renderStructure = (data: any) => {
  const classOptions = data.hierarchy.classes.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  const groupOptions = data.hierarchy.groups.map((g: any) => `<option value="${g.id}">${g.name}</option>`).join("");

  return `
  <div class="form-grid">
    <!-- Class Form -->
    <div class="card">
      <div class="card-header"><h4>Add Class</h4></div>
      <form method="POST" action="/admin/classes">
        <div class="form-grid-2" style="display:grid; gap:0.5rem;">
          <input type="text" name="name" placeholder="Name (e.g. Class 10)" required />
          <select name="hasGroups"><option value="false">No Groups</option><option value="true">Has Groups</option></select>
        </div>
        <button type="submit" class="secondary" style="width:100%; margin-top:0.5rem;">Create Class</button>
      </form>
    </div>

    <!-- Group Form -->
    <div class="card">
      <div class="card-header"><h4>Add Group</h4></div>
      <form method="POST" action="/admin/groups" class="flex gap-2">
        <select name="classId" style="flex:1" required><option value="">Select Class...</option>${classOptions}</select>
        <input type="text" name="name" style="flex:2" placeholder="Group Name" required />
        <button type="submit" class="secondary">Add</button>
      </form>
    </div>

    <!-- Subject Form -->
    <div class="card">
      <div class="card-header"><h4>Add Subject</h4></div>
      <form method="POST" action="/admin/subjects">
        <div class="form-grid-2" style="display:grid; gap:0.5rem; margin-bottom:0.5rem;">
          <select name="classId" required><option value="">Class...</option>${classOptions}</select>
          <select name="groupId"><option value="">Common (No Group)</option>${groupOptions}</select>
        </div>
        <div class="flex gap-2">
          <input type="text" name="name" style="flex:1" placeholder="Subject Name" required />
          <button type="submit" class="secondary">Add</button>
        </div>
      </form>
    </div>
  </div>
  `;
};

const renderChapters = (data: any) => {
  const subjectOptions = data.hierarchy.subjects.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");
  const chapterOptions = data.hierarchy.chapters.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");

  return `
  <div class="form-grid">
    <div class="card">
      <div class="card-header"><h4>1. Add Chapter</h4></div>
      <form method="POST" action="/admin/chapters">
        <div class="input-group">
          <label>Subject</label>
          <select name="subjectId" required>${subjectOptions}</select>
        </div>
        <div class="flex gap-2">
          <input type="text" name="name" style="flex:3" placeholder="Chapter Name" required />
          <input type="number" name="position" style="flex:1" value="1" placeholder="#" required />
          <button type="submit" class="accent">Add</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card-header"><h4>2. Add Sub-chapter (Topic)</h4></div>
      <form method="POST" action="/admin/subchapters">
        <div class="input-group">
          <label>Parent Chapter</label>
          <select name="chapterId" required>${chapterOptions}</select>
        </div>
        <div class="flex gap-2">
          <input type="text" name="name" style="flex:3" placeholder="Topic Name" required />
          <input type="number" name="position" style="flex:1" value="1" required />
          <button type="submit" class="secondary">Add</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card-header"><h4>3. Add Question Type</h4></div>
      <form method="POST" action="/admin/question-types" class="flex gap-2">
        <select name="chapterId" style="flex:1" required>${chapterOptions}</select>
        <input type="text" name="name" style="flex:1" placeholder="Type (e.g. MCQ)" required />
        <button type="submit" class="secondary">Add</button>
      </form>
    </div>
  </div>
  `;
};

const renderQuestions = (data: any) => {
  const chapterOptions = data.hierarchy.chapters.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  const typeOptions = data.questionTypes.map((t: any) => `<option value="${t.id}">${t.name}</option>`).join("");
  const sourceOptions = data.sources.entities.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");

  const rows = data.questions.map((q: any) => `
    <tr>
      <td><div class="text-sm font-bold">${q.prompt.substring(0, 50)}...</div></td>
      <td><span class="badge blue">${q.questionType}</span></td>
      <td class="text-xs">${q.chapter}</td>
    </tr>
  `).join("");

  return `
  <div class="card">
    <div class="card-header"><h4>Upload Question</h4></div>
    <form method="POST" action="/admin/questions">
      <div class="form-grid-2" style="display:grid; gap:0.5rem; margin-bottom:0.5rem;">
        <select name="chapterId" required><option value="">Select Chapter...</option>${chapterOptions}</select>
        <select name="questionTypeId" required><option value="">Question Type...</option>${typeOptions}</select>
      </div>
      <div class="form-grid-2" style="display:grid; gap:0.5rem; margin-bottom:0.5rem;">
        <select name="sourceEntityId" required><option value="">Source...</option>${sourceOptions}</select>
        <input type="text" name="sourceYear" placeholder="Year (2024)" required />
      </div>
      <textarea name="prompt" rows="3" placeholder="Question text..." required style="margin-bottom:0.5rem;"></textarea>
      <input type="url" name="imageUrl" placeholder="Image URL (Optional)" style="margin-bottom:0.5rem;" />
      <button type="submit" class="accent" style="width:100%;">Save Question</button>
    </form>
  </div>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Question</th><th>Type</th><th>Chapter</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="3" class="text-muted text-center">No questions found.</td></tr>'}</tbody>
    </table>
  </div>
  `;
};

const renderContent = (data: any) => {
  const subchapterOptions = data.hierarchy.subchapters.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");
  const rows = data.learningMaterials.map((m: any) => `
    <tr>
      <td><div class="font-bold">${m.title}</div><a href="${m.url}" target="_blank" class="text-xs text-accent">View Link</a></td>
      <td><span class="badge">${m.materialType}</span></td>
    </tr>
  `).join("");

  return `
  <div class="card">
    <div class="card-header"><h4>Add Learning Material</h4></div>
    <form method="POST" action="/admin/learning-materials">
      <div class="input-group">
        <label>Sub-chapter (Topic)</label>
        <select name="subchapterId" required>${subchapterOptions}</select>
      </div>
      <div class="input-group">
        <label>Title</label>
        <input type="text" name="title" required />
      </div>
      <div class="form-grid-2" style="display:grid; gap:0.5rem; margin-bottom:0.5rem;">
        <select name="materialType">
          <option value="Lecture Video">Video</option>
          <option value="PDF">PDF</option>
          <option value="Handwritten Note">Note</option>
        </select>
        <input type="url" name="url" placeholder="https://..." required />
      </div>
      <button type="submit" class="accent" style="width:100%;">Add Material</button>
    </form>
  </div>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Title</th><th>Type</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="2" class="text-muted">No materials.</td></tr>'}</tbody>
    </table>
  </div>
  `;
};

const renderSettings = (data: any) => {
  const categoryOptions = data.sources.categories.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  return `
  <div class="card">
    <div class="card-header"><h4>Source Entities</h4></div>
    <p class="text-sm text-muted" style="margin-bottom:1rem;">Add boards, universities, or colleges to tag questions.</p>
    <form method="POST" action="/admin/source-entities" class="flex gap-2">
      <select name="categoryId" style="flex:1" required>${categoryOptions}</select>
      <input type="text" name="name" style="flex:2" placeholder="Entity Name (e.g. Dhaka Board)" required />
      <button type="submit" class="secondary">Add</button>
    </form>
  </div>
  `;
}

// --- Main Dashboard Renderer ---

export const renderDashboard = (data: any, view: string = "overview") => {
  let contentHtml = "";

  switch (view) {
    case "structure": contentHtml = renderStructure(data); break;
    case "chapters": contentHtml = renderChapters(data); break;
    case "questions": contentHtml = renderQuestions(data); break;
    case "content": contentHtml = renderContent(data); break;
    case "settings": contentHtml = renderSettings(data); break;
    default: contentHtml = renderOverview(data); break;
  }

  const body = `
    <div class="admin-layout">
      ${renderSidebar(view)}
      <main class="admin-content">
        <h2 style="margin-bottom:1.5rem; text-transform:capitalize;">${view}</h2>
        ${contentHtml}
      </main>
    </div>
  `;

  return layout("Admin Dashboard", body);
};

export const renderLogin = (options: { isFirstAdmin: boolean; error?: string }) => {
  const body = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f1f5f9; padding:1rem;">
      <div class="card" style="width:100%; max-width:400px; padding:2rem;">
        <div style="text-align:center; margin-bottom:2rem;">
          <h1 style="font-size:1.75rem; color:var(--primary);">Admin Access</h1>
          <p class="text-muted">Freeducation Control Panel</p>
        </div>
        
        ${options.error ? `<div style="background:#fee2e2; color:#ef4444; padding:0.75rem; border-radius:6px; margin-bottom:1rem; font-size:0.9rem;">${options.error}</div>` : ''}
        ${options.isFirstAdmin ? `<div style="background:#e0f2fe; color:#0369a1; padding:0.75rem; border-radius:6px; margin-bottom:1rem; font-size:0.9rem;">🎉 Setup: Create the first admin account.</div>` : ''}

        <form method="POST" action="/admin/login" class="form-grid">
          <div class="input-group">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="admin@example.com" />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="accent" style="width:100%; padding:0.8rem;">${options.isFirstAdmin ? 'Create Account' : 'Secure Login'}</button>
        </form>
        
        <div style="text-align:center; margin-top:2rem;">
          <a href="/" class="text-sm text-accent">← Return to Public Site</a>
        </div>
      </div>
    </div>
  `;
  return layout("Admin Login", body);
};


