import { appConfig } from "./config";
import { layout, iconHat } from "./templates";

// --- Components ---
const deleteBtn = (table: string, id: number, view: string) => `
  <form action="/admin/delete" method="POST" onsubmit="return confirm('Are you sure? This will delete all related data.');" style="display:inline;">
    <input type="hidden" name="table" value="${table}" />
    <input type="hidden" name="id" value="${id}" />
    <input type="hidden" name="view" value="${view}" />
    <button type="submit" style="background:none; border:none; color:var(--danger); padding:4px; opacity:0.6; cursor:pointer;">🗑️</button>
  </form>
`;

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

// --- VIEW: Structure (The Core NCTB Logic) ---
const renderStructure = (data: any) => {
  const classList = data.hierarchy.classes.map((c: any) => {
    // 1. Get Groups for this specific class
    const classGroups = data.hierarchy.groups.filter((g: any) => g.class_id === c.id);
    
    // 2. Get All Subjects for this class
    const allSubjects = data.hierarchy.subjects.filter((s: any) => s.class_id === c.id);
    
    // 3. Separate Subjects: Common vs Group Specific
    const commonSubjects = allSubjects.filter((s: any) => s.group_id === null);
    
    // HTML Helpers
    const renderSubjectRow = (s: any) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed var(--border);">
        <span style="font-size:14px; color:var(--text-main);">📘 ${s.name}</span>
        ${deleteBtn('subjects', s.id, 'structure')}
      </div>
    `;

    // Render Groups Section (Science, Arts, etc.)
    const groupsHtml = classGroups.map((g: any) => {
      // Filter subjects specific to THIS group
      const groupSubjects = allSubjects.filter((s: any) => s.group_id === g.id);
      
      return `
      <div style="margin-top:12px; background:#f8fafc; padding:10px; border-radius:6px; border:1px solid var(--border);">
        <div style="display:flex; justify-content:space-between; font-weight:600; font-size:13px; color:var(--accent); margin-bottom:6px;">
          <span>👥 ${g.name} Group</span>
          ${deleteBtn('groups', g.id, 'structure')}
        </div>
        
        <div style="padding-left:8px;">
          ${groupSubjects.length > 0 ? groupSubjects.map(renderSubjectRow).join("") : `<div style="font-size:12px; color:var(--text-sub); font-style:italic;">No specific subjects yet</div>`}
        </div>

        <!-- Add Subject to THIS Group -->
        <form method="POST" action="/admin/subjects" style="display:flex; gap:6px; margin-top:8px;">
          <input type="hidden" name="classId" value="${c.id}" />
          <input type="hidden" name="groupId" value="${g.id}" />
          <input type="text" name="name" placeholder="Subject (e.g. Physics)" required style="height:32px; font-size:13px;" />
          <button type="submit" class="btn-secondary btn-small">Add</button>
        </form>
      </div>
      `;
    }).join("");

    return `
      <div class="card">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <span>${c.name}</span>
          ${deleteBtn('classes', c.id, 'structure')}
        </div>
        <div class="card-body">
          
          <!-- COMMON SUBJECTS SECTION -->
          <div style="margin-bottom:16px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-sub); margin-bottom:4px; text-transform:uppercase;">
              ${c.has_groups ? 'Common Subjects (All Groups)' : 'Subjects'}
            </div>
            
            ${commonSubjects.length > 0 ? commonSubjects.map(renderSubjectRow).join("") : `<div style="font-size:12px; color:var(--text-sub); font-style:italic; padding:4px 0;">No subjects added</div>`}

            <form method="POST" action="/admin/subjects" style="display:flex; gap:6px; margin-top:8px;">
              <input type="hidden" name="classId" value="${c.id}" />
              <!-- groupId is null for Common -->
              <input type="text" name="name" placeholder="Subject (e.g. Bangla)" required style="height:32px; font-size:13px;" />
              <button type="submit" class="btn-secondary btn-small">Add Common</button>
            </form>
          </div>

          <!-- GROUP SECTIONS -->
          ${c.has_groups ? `
            <div style="border-top:1px solid var(--border); padding-top:12px;">
              <div style="font-size:11px; font-weight:700; color:var(--text-sub); margin-bottom:4px; text-transform:uppercase;">Stream / Groups</div>
              ${groupsHtml}
              
              <form method="POST" action="/admin/groups" style="margin-top:12px; border-top:1px dashed var(--border); padding-top:8px;">
                <label style="font-size:12px; color:var(--text-sub); display:block; margin-bottom:4px;">Create New Group</label>
                <div style="display:flex; gap:6px;">
                  <input type="hidden" name="classId" value="${c.id}" />
                  <input type="text" name="name" placeholder="Name (e.g. Commerce)" required style="height:32px; font-size:13px;" />
                  <button type="submit" class="btn-primary btn-small">Add Group</button>
                </div>
              </form>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }).join("");

  return `
  <div class="container" style="padding-top:16px;">
    
    <!-- Add New Class -->
    <div class="card" style="border:2px dashed var(--border); background:none; box-shadow:none;">
      <div class="card-body">
        <form method="POST" action="/admin/classes" style="display:flex; gap:12px; align-items:center;">
          <div style="flex:1;">
            <input type="text" name="name" placeholder="New Class (e.g. Class 9)" required />
          </div>
          <div style="display:flex; align-items:center; gap:8px; white-space:nowrap;">
             <input type="checkbox" name="hasGroups" value="true" id="hg" style="width:20px; height:20px;">
             <label for="hg" style="margin:0; font-size:13px;">Has Groups?</label>
          </div>
          <button type="submit" class="btn-primary" style="width:auto; padding:0 20px;">Create</button>
        </form>
      </div>
    </div>

    ${classList}
  </div>
  `;
};

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
    <div class="card" style="margin-top:16px;">
      <div class="card-header">System Health</div>
      <div class="list-item"><span>Active Classes</span> <span>${data.hierarchy.classes.length}</span></div>
      <div class="list-item"><span>Total Subjects</span> <span>${data.hierarchy.subjects.length}</span></div>
    </div>
  </div>
`;

// --- VIEW: Questions (List & Add) ---
const renderQuestions = (data: any) => {
  // Enhanced Dropdown Logic for Question Upload
  const subjectOpts = data.hierarchy.subjects.map((s: any) => {
    const cls = data.hierarchy.classes.find((c: any) => c.id === s.class_id)?.name || 'Unknown';
    const grp = s.group_id ? data.hierarchy.groups.find((g: any) => g.id === s.group_id)?.name : 'Common';
    return `<option value="${s.id}">${cls} &gt; ${s.name} (${grp})</option>`;
  }).join("");
  
  const chapterOpts = data.hierarchy.chapters.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  const typeOpts = data.questionTypes.map((t: any) => `<option value="${t.id}">${t.name}</option>`).join("");
  const sourceOpts = data.sources.entities.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");

  return `
  <div class="container" style="padding-top:16px;">
    
    <div class="card">
      <div class="card-header">1. Define Hierarchy</div>
      <div class="card-body">
        <form method="POST" action="/admin/chapters" class="form-stack" style="border-bottom:1px dashed var(--border); padding-bottom:16px; margin-bottom:16px;">
          <div style="display:flex; gap:8px;">
            <select name="subjectId" required style="flex:2;"><option value="">Select Subject...</option>${subjectOpts}</select>
            <input type="text" name="name" placeholder="New Chapter Name" style="flex:2;" required />
          </div>
          <button type="submit" class="btn-secondary btn-small">Add Chapter</button>
        </form>

        <form method="POST" action="/admin/question-types" class="form-stack">
           <div style="display:flex; gap:8px;">
            <select name="chapterId" required style="flex:2;"><option value="">Select Chapter...</option>${chapterOpts}</select>
            <input type="text" name="name" placeholder="Type (e.g. CQ, MCQ)" style="flex:2;" required />
          </div>
          <button type="submit" class="btn-secondary btn-small">Add Question Type</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">2. Upload Question</div>
      <div class="card-body">
        <form method="POST" action="/admin/questions" class="form-stack">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <select name="chapterId" required><option value="">Chapter...</option>${chapterOpts}</select>
            <select name="questionTypeId" required><option value="">Type...</option>${typeOpts}</select>
          </div>
          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:8px;">
            <select name="sourceEntityId" required><option value="">Source (Board)...</option>${sourceOpts}</select>
            <input type="text" name="sourceYear" placeholder="Year (2024)" required />
          </div>
          <textarea name="prompt" rows="3" placeholder="Question Text / Stem..." required></textarea>
          <input type="url" name="imageUrl" placeholder="Image URL (Optional)" />
          <button type="submit" class="btn-accent">Save Question</button>
        </form>
      </div>
    </div>

    <div style="font-size:12px; font-weight:700; color:var(--text-sub); margin-bottom:8px; padding-left:4px;">LATEST QUESTIONS</div>
    <div>
      ${data.questions.map((q: any) => `
        <div class="list-item" style="background:var(--card-bg); border-bottom:1px solid var(--border);">
          <div style="flex:1;">
            <div style="font-size:13px; font-weight:500;">${q.prompt.substring(0,40)}...</div>
            <div class="badge badge-gray" style="margin-top:4px; display:inline-block;">${q.questionType}</div>
             <span style="font-size:11px; color:var(--text-sub); margin-left:6px;">${q.chapter}</span>
          </div>
          ${deleteBtn('questions', q.id, 'questions')}
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
      <div class="card-header">1. Create Topic</div>
      <div class="card-body">
        <form method="POST" action="/admin/subchapters" class="form-stack">
          <select name="chapterId" required><option value="">Parent Chapter...</option>${chapterOpts}</select>
          <input type="text" name="name" placeholder="Topic Name (Sub-chapter)" required />
          <button type="submit" class="btn-secondary">Add Topic</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">2. Upload Material</div>
      <div class="card-body">
        <form method="POST" action="/admin/learning-materials" class="form-stack">
          <select name="subchapterId" required><option value="">Select Topic...</option>${subChapterOpts}</select>
          <input type="text" name="title" placeholder="Material Title" required />
          <div style="display:grid; grid-template-columns: 1fr 2fr; gap:8px;">
            <select name="materialType"><option>Video</option><option>PDF</option><option>Note</option></select>
            <input type="url" name="url" placeholder="https://..." required />
          </div>
          <button type="submit" class="btn-accent">Upload Content</button>
        </form>
      </div>
    </div>
    
    <div style="font-size:12px; font-weight:700; color:var(--text-sub); margin-bottom:8px; padding-left:4px;">RECENT UPLOADS</div>
    ${data.learningMaterials.map((m: any) => `
      <div class="list-item" style="background:var(--card-bg); border-bottom:1px solid var(--border);">
        <div style="flex:1;">
          <div style="font-size:14px; font-weight:600;">${m.title}</div>
          <div class="badge badge-blue">${m.materialType}</div>
        </div>
        ${deleteBtn('learning_materials', m.id, 'materials')}
      </div>
    `).join("")}
  </div>
  `;
};

// --- VIEW: Settings ---
const renderSettings = (data: any) => {
  const catOpts = data.sources.categories.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  return `
  <div class="container" style="padding-top:16px;">
    <div class="card">
      <div class="card-header">Source Entities (Boards)</div>
      <div class="card-body">
        <form method="POST" action="/admin/source-entities" class="form-stack">
          <label style="font-size:13px; color:var(--text-sub);">Category</label>
          <select name="categoryId" required>${catOpts}</select>
          <input type="text" name="name" placeholder="Name (e.g. Dhaka Board)" required />
          <button type="submit" class="btn-primary">Add Entity</button>
        </form>
        <div style="margin-top:16px;">
          ${data.sources.entities.map((e: any) => `
             <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
                <span>${e.name}</span>
                ${deleteBtn('source_entities', e.id, 'settings')}
             </div>
          `).join("")}
        </div>
      </div>
    </div>
  </div>
  `;
};

// --- Router ---
export const renderDashboard = (data: any, view: string = "overview") => {
  let content = "";
  if (view === 'structure') content = renderStructure(data);
  else if (view === 'questions') content = renderQuestions(data);
  else if (view === 'materials') content = renderMaterials(data);
  else if (view === 'settings') content = renderSettings(data);
  else content = renderOverview(data);

  return layout("Admin", navBar(view) + content);
};

// --- Login ---
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
          <div style="margin-top:24px;"><a href="/" style="font-size:13px; color:var(--text-sub);">Back to Home</a></div>
        </div>
      </div>
    </div>
  `;
  return layout("Login", body);
};


