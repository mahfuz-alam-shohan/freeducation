import { appConfig, hierarchyLabels } from "./config";
import { layout, iconHat } from "./templates";

// --- Admin Navigation Component ---
const navBar = (activeView: string) => `
  <header class="app-header">
    <div class="brand">${iconHat} Admin</div>
    <div class="header-action-right">
       <form action="/admin/logout" method="POST" style="margin:0;">
          <button type="submit" style="background:none; border:none; color:var(--danger); font-size:13px; font-weight:600;">LOGOUT</button>
       </form>
    </div>
  </header>
  <nav class="admin-nav-scroll">
    <a href="/admin?view=overview" class="nav-tab ${activeView === 'overview' ? 'active' : ''}">Overview</a>
    <a href="/admin?view=structure" class="nav-tab ${activeView === 'structure' ? 'active' : ''}">Structure</a>
    <a href="/admin?view=questions" class="nav-tab ${activeView === 'questions' ? 'active' : ''}">Q-Bank</a>
    <a href="/admin?view=materials" class="nav-tab ${activeView === 'materials' ? 'active' : ''}">Materials</a>
    <a href="/admin?view=settings" class="nav-tab ${activeView === 'settings' ? 'active' : ''}">Settings</a>
  </nav>
`;

// --- VIEW: Overview ---
const renderOverview = (data: any) => `
  <div class="container" style="padding-top:16px;">
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
      <div class="card" style="margin:0; text-align:center;">
        <div class="card-body">
          <div style="font-size:24px; font-weight:700; color:var(--accent);">${data.questions.length}</div>
          <div style="font-size:12px; color:var(--text-sub);">Questions</div>
        </div>
      </div>
      <div class="card" style="margin:0; text-align:center;">
        <div class="card-body">
          <div style="font-size:24px; font-weight:700; color:var(--primary);">${data.learningMaterials.length}</div>
          <div style="font-size:12px; color:var(--text-sub);">Materials</div>
        </div>
      </div>
    </div>
    
    <div style="margin-top:24px; text-align:center; color:var(--text-sub); font-size:13px;">
      Use the menu above to manage your content.
    </div>
  </div>
`;

// --- VIEW: Structure (Classes, Groups, Subjects) ---
const renderStructure = (data: any) => {
  const classOpts = data.hierarchy.classes.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  
  return `
  <div class="container" style="padding-top:16px;">
    
    <div class="card">
      <div class="card-header">1. Create Class</div>
      <div class="card-body">
        <form method="POST" action="/admin/classes" class="form-stack">
          <input type="text" name="name" placeholder="Class Name (e.g. Class 11)" required />
          <div style="display:flex; gap:12px;">
            <select name="hasGroups"><option value="false">No Groups</option><option value="true">Has Groups</option></select>
            <select name="isMerged"><option value="false">Standalone</option><option value="true">Merged</option></select>
          </div>
          <button type="submit" class="btn-primary">Add Class</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">2. Create Subject</div>
      <div class="card-body">
        <form method="POST" action="/admin/subjects" class="form-stack">
          <select name="classId" required><option value="">Select Class...</option>${classOpts}</select>
          <input type="text" name="name" placeholder="Subject Name" required />
          <button type="submit" class="btn-secondary">Add Subject</button>
        </form>
      </div>
    </div>

  </div>
  `;
};

// --- VIEW: Questions (Chapters + Upload) ---
const renderQuestions = (data: any) => {
  const subjectOpts = data.hierarchy.subjects.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");
  const chapterOpts = data.hierarchy.chapters.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  const typeOpts = data.questionTypes.map((t: any) => `<option value="${t.id}">${t.name}</option>`).join("");
  const sourceOpts = data.sources.entities.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");

  return `
  <div class="container" style="padding-top:16px;">
    
    <!-- Collapsible Setup Section could go here, keeping it simple for now -->
    <div class="card">
      <div class="card-header">Step 1: Define Structure</div>
      <div class="card-body">
        <form method="POST" action="/admin/chapters" class="form-stack" style="margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:16px;">
          <div class="input-group">
            <label>New Chapter</label>
            <div style="display:flex; gap:8px;">
               <select name="subjectId" required style="flex:1"><option value="">Subject...</option>${subjectOpts}</select>
               <input type="text" name="name" placeholder="Name" style="flex:1" required />
            </div>
          </div>
          <button type="submit" class="btn-secondary btn-small">Add Chapter</button>
        </form>

        <form method="POST" action="/admin/question-types" class="form-stack">
          <div class="input-group">
            <label>New Question Type</label>
            <div style="display:flex; gap:8px;">
              <select name="chapterId" required style="flex:1"><option value="">Chapter...</option>${chapterOpts}</select>
              <input type="text" name="name" placeholder="Type (MCQ)" style="flex:1" required />
            </div>
          </div>
          <button type="submit" class="btn-secondary btn-small">Add Type</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Step 2: Upload Question</div>
      <div class="card-body">
        <form method="POST" action="/admin/questions" class="form-stack">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <select name="chapterId" required><option value="">Chapter...</option>${chapterOpts}</select>
            <select name="questionTypeId" required><option value="">Type...</option>${typeOpts}</select>
          </div>
          
          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:12px;">
            <select name="sourceEntityId" required><option value="">Source...</option>${sourceOpts}</select>
            <input type="text" name="sourceYear" placeholder="Year" required />
          </div>

          <textarea name="prompt" rows="3" placeholder="Question Text..." required></textarea>
          <input type="url" name="imageUrl" placeholder="Image URL (Optional)" />
          
          <button type="submit" class="btn-accent">Save Question</button>
        </form>
      </div>
    </div>

    <!-- Recent List -->
    <div style="font-size:12px; font-weight:700; color:var(--text-sub); margin-bottom:8px; padding-left:4px;">RECENTLY ADDED</div>
    <div>
      ${data.questions.slice(0, 10).map((q: any) => `
        <div class="list-item" style="background:var(--card-bg); border-bottom:1px solid var(--border);">
          <div style="font-size:13px; font-weight:500;">${q.prompt.substring(0,40)}...</div>
          <div class="badge badge-gray">${q.questionType}</div>
        </div>
      `).join("")}
    </div>

  </div>
  `;
};

// --- VIEW: Materials ---
const renderMaterials = (data: any) => {
  const chapterOpts = data.hierarchy.chapters.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  const subChapterOpts = data.hierarchy.subchapters.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");

  return `
  <div class="container" style="padding-top:16px;">
    
    <div class="card">
      <div class="card-header">Add Topic (Sub-chapter)</div>
      <div class="card-body">
        <form method="POST" action="/admin/subchapters" class="form-stack">
          <select name="chapterId" required><option value="">Parent Chapter...</option>${chapterOpts}</select>
          <input type="text" name="name" placeholder="Topic Name" required />
          <button type="submit" class="btn-secondary">Add Topic</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Add Material</div>
      <div class="card-body">
        <form method="POST" action="/admin/learning-materials" class="form-stack">
          <select name="subchapterId" required><option value="">Select Topic...</option>${subChapterOpts}</select>
          <input type="text" name="title" placeholder="Material Title" required />
          <div style="display:grid; grid-template-columns: 1fr 2fr; gap:12px;">
            <select name="materialType"><option>Video</option><option>PDF</option><option>Note</option></select>
            <input type="url" name="url" placeholder="https://..." required />
          </div>
          <button type="submit" class="btn-accent">Upload</button>
        </form>
      </div>
    </div>
  </div>
  `;
};

// --- VIEW: Settings ---
const renderSettings = (data: any) => {
  const catOpts = data.sources.categories.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  
  return `
  <div class="container" style="padding-top:16px;">
    <div class="card">
      <div class="card-header">Source Entities</div>
      <div class="card-body">
        <form method="POST" action="/admin/source-entities" class="form-stack">
          <label style="font-size:13px; color:var(--text-sub);">Add Board or Institution</label>
          <select name="categoryId" required>${catOpts}</select>
          <input type="text" name="name" placeholder="Name (e.g. Dhaka Board)" required />
          <button type="submit" class="btn-primary">Add Entity</button>
        </form>
      </div>
    </div>
  </div>
  `;
};

// --- Main Dashboard Router ---
export const renderDashboard = (data: any, view: string = "overview") => {
  let content = "";
  if (view === 'structure') content = renderStructure(data);
  else if (view === 'questions') content = renderQuestions(data);
  else if (view === 'materials') content = renderMaterials(data);
  else if (view === 'settings') content = renderSettings(data);
  else content = renderOverview(data);

  return layout("Admin", navBar(view) + content);
};

// --- Login Page ---
export const renderLogin = (options: { isFirstAdmin: boolean; error?: string }) => {
  const body = `
    <div class="auth-wrapper">
      <div class="card" style="width:100%; max-width:400px; margin:0;">
        <div class="card-body" style="text-align:center; padding:32px 24px;">
          <div style="font-size:32px; margin-bottom:16px;">🔒</div>
          <h2 style="margin-bottom:8px;">Admin Access</h2>
          <p style="color:var(--text-sub); font-size:14px; margin-bottom:24px;">Secure dashboard login</p>
          
          ${options.error ? `<div style="background:#fee2e2; color:var(--danger); padding:12px; border-radius:var(--radius); margin-bottom:16px; font-size:13px;">${options.error}</div>` : ''}

          <form method="POST" action="/admin/login" class="form-stack">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit" class="btn-primary">${options.isFirstAdmin ? 'Setup Account' : 'Login'}</button>
          </form>

          <div style="margin-top:24px;">
            <a href="/" style="font-size:13px; color:var(--text-sub);">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  `;
  return layout("Login", body);
};


