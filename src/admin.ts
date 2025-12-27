import { appConfig } from "./config";
import { layout, iconHat } from "./templates";

const nav = (active: string) => `
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="brand">${iconHat} Admin Panel</div>
      <div class="stack-sm">
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.12em; opacity:0.6;">Navigation</div>
        <nav class="admin-nav">
          <a href="/admin?view=overview" class="${active==='overview'?'active':''}">Overview</a>
          <a href="/admin?view=cards" class="${active==='cards'?'active':''}">Featured Cards</a>
          <a href="/admin?view=structure" class="${active==='structure'?'active':''}">Structure</a>
          <a href="/admin?view=qbank" class="${active==='qbank'?'active':''}">Question Bank</a>
          <a href="/admin?view=materials" class="${active==='materials'?'active':''}">Materials</a>
          <a href="/admin?view=settings" class="${active==='settings'?'active':''}">Settings</a>
        </nav>
      </div>
      <form action="/admin/logout" method="POST">
        <button class="btn-ghost" style="color:#fff; border-color:rgba(255,255,255,0.2);">Logout</button>
      </form>
    </aside>
    <div>
      <header class="admin-topbar">
        <div class="brand">${iconHat} Admin</div>
        <form action="/admin/logout" method="POST"><button class="btn-ghost" style="color:var(--danger);">Logout</button></form>
      </header>
      <nav class="nav-scroll">
        <a href="/admin?view=overview" class="nav-pill ${active==='overview'?'active':''}">Overview</a>
        <a href="/admin?view=cards" class="nav-pill ${active==='cards'?'active':''}">Featured Cards</a>
        <a href="/admin?view=structure" class="nav-pill ${active==='structure'?'active':''}">Structure</a>
        <a href="/admin?view=qbank" class="nav-pill ${active==='qbank'?'active':''}">Question Bank</a>
        <a href="/admin?view=materials" class="nav-pill ${active==='materials'?'active':''}">Materials</a>
        <a href="/admin?view=settings" class="nav-pill ${active==='settings'?'active':''}">Settings</a>
      </nav>
      <main class="admin-main">
`;

const del = (tbl: string, id: number, view: string) => `
  <form action="/admin/delete" method="POST" onsubmit="return confirm('Delete?')" style="display:inline;">
    <input type="hidden" name="table" value="${tbl}"><input type="hidden" name="id" value="${id}"><input type="hidden" name="view" value="${view}">
    <button class="btn-ghost" style="color:var(--danger); padding:4px;">🗑</button>
  </form>
`;

// --- VIEW: Featured Cards ---
const renderCards = (d: any) => `
  <div class="container">
    <div class="card">
      <div class="card-header">Create Featured Card</div>
      <div class="card-body">
        <form method="POST" action="/admin/featured-cards" class="form-stack">
          <input name="title" placeholder="Title (e.g. Model Test 2025)" required>
          <input name="subtitle" placeholder="Subtitle (e.g. Join the crash course)">
          <div style="display:flex; gap:8px;">
            <input name="imageUrl" placeholder="Icon/Image URL" style="flex:1">
            <input name="color" type="color" value="#ffffff" style="width:60px;">
          </div>
          <div style="display:flex; gap:8px;">
             <input name="link" placeholder="Target Link (/smart-filter...)" required style="flex:2">
             <input name="position" type="number" value="0" placeholder="Pos" style="flex:1">
          </div>
          <button class="btn-primary">Publish Card</button>
        </form>
      </div>
    </div>
    
    <div class="section-title" style="margin-bottom:8px;">Active Cards</div>
    ${d.cards.map((c: any) => `
      <div class="card" style="margin-bottom:8px; border-left:4px solid ${c.bg_color};">
        <div class="card-body" style="padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600;">${c.title}</div>
            <div style="font-size:12px; color:var(--text-sub);">${c.target_link}</div>
          </div>
          ${del('featured_cards', c.id, 'cards')}
        </div>
      </div>
    `).join("")}
  </div>
`;

// --- VIEW: Structure ---
const renderStructure = (d: any) => {
  const classById = new Map(d.hierarchy.classes.map((c: any) => [c.id, c]));
  const groupById = new Map(d.hierarchy.groups.map((g: any) => [g.id, g]));

  return `
    <div class="container">
      <form method="POST" action="/admin/classes" class="card" style="padding:16px; border:2px dashed var(--border);">
        <div style="display:flex; gap:8px;">
          <input name="name" placeholder="New Class Name" required>
          <div style="display:flex; align-items:center; gap:4px; width:100px;">
            <input type="checkbox" name="hasGroups" value="true" style="width:20px;"> Groups?
          </div>
          <button class="btn-primary" style="width:auto;">Create</button>
        </div>
      </form>
      ${d.hierarchy.classes.map((c: any) => {
        const effectiveId = c.linked_class_id || c.id;
        const effectiveClass = classById.get(effectiveId) || c;
        const subjects = d.hierarchy.subjects.filter((s: any) => s.class_id === effectiveId);
        const groups = d.hierarchy.groups.filter((g: any) => g.class_id === effectiveId);
        const linkedLabel = c.linked_class_id ? `Linked to ${effectiveClass?.name || 'Unknown Class'}` : 'Independent';
        const canEditStructure = !c.linked_class_id;
        return `
        <div class="card">
          <div class="card-header">
            <div>
              <div style="font-weight:700;">${c.name}</div>
              <div style="font-size:12px; color:var(--text-sub); margin-top:2px;">${linkedLabel}</div>
            </div>
            ${del('classes', c.id, 'structure')}
          </div>
          <div class="card-body">
            <div class="stack-sm" style="margin-bottom:8px;">
              <details class="inline-edit">
                <summary class="btn-ghost" style="width:max-content;">Edit Class</summary>
                <form method="POST" action="/admin/classes/update" class="form-stack" style="margin-top:12px;">
                  <input type="hidden" name="id" value="${c.id}">
                  <input name="name" value="${c.name}" required>
                  <label style="display:flex; align-items:center; gap:8px; font-size:13px;">
                    <input type="hidden" name="hasGroups" value="${canEditStructure ? 'false' : (effectiveClass?.has_groups ? 'true' : 'false')}">
                    <input type="checkbox" name="hasGroups" value="true" ${effectiveClass?.has_groups ? 'checked' : ''} ${canEditStructure ? '' : 'disabled'}>
                    Supports Groups
                  </label>
                  ${!canEditStructure ? `<small style="color:var(--text-sub);">Group settings are managed by the linked class.</small>` : ''}
                  <button class="btn-sm btn-secondary" style="width:max-content;">Save Class</button>
                </form>
              </details>
              <details class="inline-edit">
                <summary class="btn-ghost" style="width:max-content;">Link Class Curriculum</summary>
                <form method="POST" action="/admin/classes/link" class="form-stack" style="margin-top:12px;">
                  <input type="hidden" name="id" value="${c.id}">
                  <select name="linkedClassId">
                    <option value="">No Link</option>
                    ${d.hierarchy.classes.filter((o: any) => o.id !== c.id).map((o: any) => `<option value="${o.id}" ${o.id === c.linked_class_id ? 'selected' : ''}>${o.name}</option>`).join("")}
                  </select>
                  <button class="btn-sm btn-secondary" style="width:max-content;">Update Link</button>
                </form>
              </details>
            </div>
             <!-- Subjects List -->
             ${subjects.map((s: any) => {
               const groupName = s.group_id ? groupById.get(s.group_id)?.name : null;
               return `
               <div class="list-row" style="padding:8px 0; border-bottom:1px dashed var(--border);">
                  <span>📘 ${s.name} <small style="opacity:0.6;">${groupName ? `(${groupName} Group)` : '(Common)'}</small></span>
                  <div style="display:flex; gap:6px; align-items:center;">
                    <details class="inline-edit">
                      <summary class="btn-ghost" style="padding:4px 8px;">Edit</summary>
                      <form method="POST" action="/admin/subjects/update" class="form-stack" style="margin-top:8px;">
                        <input type="hidden" name="id" value="${s.id}">
                        <input name="name" value="${s.name}" required>
                        ${effectiveClass?.has_groups ? `
                          <select name="groupId">
                            <option value="">Common</option>
                            ${groups.map((g: any) => `<option value="${g.id}" ${String(g.id) === String(s.group_id) ? 'selected' : ''}>${g.name}</option>`).join("")}
                          </select>
                        ` : ''}
                        <button class="btn-sm btn-secondary" style="width:max-content;">Save</button>
                      </form>
                    </details>
                    ${del('subjects', s.id, 'structure')}
                  </div>
               </div>`;
             }).join("")}
             
             <!-- Add Subject Form -->
             <form method="POST" action="/admin/subjects" style="margin-top:12px; display:flex; gap:8px;">
               <input type="hidden" name="classId" value="${effectiveId}">
               ${effectiveClass?.has_groups ? `<select name="groupId" style="width:140px;"><option value="">Common</option>${groups.map((g:any)=>`<option value="${g.id}">${g.name}</option>`).join("")}</select>` : ''}
               <input name="name" placeholder="Subject..." required style="height:36px; font-size:13px;">
               <button class="btn-sm btn-secondary">Add</button>
             </form>
             
             <!-- Groups Form -->
             ${effectiveClass?.has_groups ? `
               <div style="margin-top:16px; border-top:1px solid var(--border); padding-top:8px;">
                 <small>Groups:</small>
                 ${groups.map((g:any)=>`
                   <div class="list-row" style="padding:6px 0;">
                     <span class="tag tag-gray">${g.name}</span>
                     <div style="display:flex; gap:6px; align-items:center;">
                       <details class="inline-edit">
                         <summary class="btn-ghost" style="padding:4px 8px;">Edit</summary>
                         <form method="POST" action="/admin/groups/update" class="form-stack" style="margin-top:8px;">
                           <input type="hidden" name="id" value="${g.id}">
                           <input name="name" value="${g.name}" required>
                           <button class="btn-sm btn-secondary" style="width:max-content;">Save</button>
                         </form>
                       </details>
                       ${del('groups', g.id, 'structure')}
                     </div>
                   </div>
                 `).join("")}
               </div>
               <form method="POST" action="/admin/groups" style="margin-top:8px; display:flex; gap:8px;">
                 <input type="hidden" name="classId" value="${effectiveId}">
                 <input name="name" placeholder="New Group" style="height:36px;">
                 <button class="btn-sm btn-secondary">Add</button>
               </form>
             ` : ''}
          </div>
        </div>
      `;}).join("")}
    </div>
  `;
};

// --- VIEW: Q-Bank (Advanced) ---
const renderQBank = (d: any) => {
  const subOpts = d.hierarchy.subjects.map((s: any) => `<option value="${s.id}">${d.hierarchy.classes.find((c:any)=>c.id===s.class_id)?.name} > ${s.name}</option>`).join("");
  const chapOpts = d.hierarchy.chapters.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join("");
  const topicOpts = d.hierarchy.subchapters.map((t: any) => `<option value="${t.id}">${d.hierarchy.chapters.find((c:any)=>c.id===t.chapter_id)?.name} > ${t.name}</option>`).join("");
  const srcOpts = d.sources.entities.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join("");
  const stemOpts = d.stems?.map((st: any) => `<option value="${st.id}">${st.content.substring(0,30)}...</option>`).join("") || "";

  return `
    <div class="container">
      
      <!-- 1. Structure -->
      <div class="card collapsed-section">
        <div class="card-header">1. Hierarchy (Chapters)</div>
        <div class="card-body">
           <form method="POST" action="/admin/chapters" style="display:flex; gap:8px; margin-bottom:12px;">
             <select name="subjectId" required style="flex:1;">${subOpts}</select>
             <input name="name" placeholder="New Chapter" style="flex:1;" required>
             <button class="btn-sm btn-secondary">Add</button>
           </form>
           <form method="POST" action="/admin/subchapters" style="display:flex; gap:8px;">
             <select name="chapterId" required style="flex:1;">${chapOpts}</select>
             <input name="name" placeholder="New Topic" style="flex:1;" required>
             <button class="btn-sm btn-secondary">Add</button>
           </form>
        </div>
      </div>

      <!-- 2. STEM CREATOR (The Para) -->
      <div class="card" style="border:2px solid var(--accent); background:#fefcf6;">
        <div class="card-header" style="color:var(--accent);">2. Create Stem (Scenario)</div>
        <div class="card-body">
          <form method="POST" action="/admin/stems" class="form-stack">
             <div style="display:flex; gap:8px;">
                <select name="subjectId" required style="flex:1"><option value="">Subject...</option>${subOpts}</select>
                <select name="sourceEntityId" style="flex:1"><option value="">Source...</option>${srcOpts}</select>
                <input name="sourceYear" placeholder="Year" style="flex:1">
             </div>
             <textarea name="content" rows="3" placeholder="Enter the creative scenario paragraph here..." required></textarea>
             <input name="imageUrl" placeholder="Image URL (Optional)">
             <button class="btn-accent">Create Stem</button>
          </form>
        </div>
      </div>

      <!-- 3. QUESTION UPLOADER -->
      <div class="card">
        <div class="card-header">3. Add Question (Part)</div>
        <div class="card-body">
          <form method="POST" action="/admin/questions">
            
            <!-- Link to Stem -->
            <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:12px;">
              <label style="font-size:11px; font-weight:700; color:var(--text-sub);">LINK TO SCENARIO (Optional)</label>
              <select name="stemId" style="margin-top:4px;">
                <option value="">-- No Stem (Standalone MCQ) --</option>
                ${stemOpts}
              </select>
            </div>

            <!-- Tags -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:12px;">
               <select name="chapterId" required><option value="">Chapter...</option>${chapOpts}</select>
               <select name="subchapterId"><option value="">Topic (Specific)...</option>${topicOpts}</select>
            </div>

            <!-- Question Detail -->
            <div style="display:grid; grid-template-columns: 100px 1fr; gap:8px; margin-bottom:12px;">
               <div>
                 <select name="questionPart">
                   <option value="mcq">MCQ</option>
                   <option value="k">ক (Knw)</option>
                   <option value="kh">খ (Und)</option>
                   <option value="g">গ (App)</option>
                   <option value="gh">ঘ (HiO)</option>
                 </select>
                 <div style="margin-top:8px; display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" name="isConnected" value="true" checked style="width:16px; height:16px;">
                    <label style="font-size:11px;">Connect?</label>
                 </div>
               </div>
               <textarea name="prompt" rows="3" required placeholder="Question text..."></textarea>
            </div>
            
            <button class="btn-primary">Save Question</button>
          </form>
        </div>
      </div>
    </div>
  `;
};

// --- VIEW: Settings ---
const renderSettings = (d: any) => `
  <div class="container">
    <div class="card">
      <div class="card-header">Source Entities (Boards)</div>
      <div class="card-body">
        <form method="POST" action="/admin/source-entities" style="display:flex; gap:8px;">
          <select name="categoryId" required style="width:120px;">${d.sources.categories.map((c:any)=>`<option value="${c.id}">${c.name}</option>`).join("")}</select>
          <input name="name" placeholder="Name (e.g. Dhaka Board)" required>
          <button class="btn-sm btn-primary">Add</button>
        </form>
        <div style="margin-top:16px;">
          ${d.sources.entities.map((e: any) => `<span class="tag tag-gray" style="margin-bottom:4px; display:inline-flex; align-items:center;">${e.name} ${del('source_entities', e.id, 'settings')}</span>`).join(" ")}
        </div>
      </div>
    </div>
  </div>
`;

// --- ROUTER ---
export const renderDashboard = (d: any, view: string) => {
  let c = '';
  if (view === 'structure') c = renderStructure(d);
  else if (view === 'qbank') c = renderQBank(d);
  else if (view === 'materials') c = renderStructure(d); // Reuse structure for materials placeholder
  else if (view === 'settings') c = renderSettings(d);
  else if (view === 'cards') c = renderCards(d);
  else c = renderStructure(d); // Default
  return layout("Admin", nav(view) + c + `</main></div></div>`);
};

export const renderLogin = (opts: any) => layout("Login", `
  <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px;">
    <div class="card" style="width:100%; max-width:420px;">
      <div class="card-body" style="text-align:center; padding:32px;">
         <div style="font-size:44px;">🎓</div>
         <h3 style="margin-top:8px;">Admin Login</h3>
         <p style="color:var(--text-muted); font-size:14px;">Manage content, track progress, and curate learning paths.</p>
         ${opts.error ? `<p style="color:var(--danger);">${opts.error}</p>` : ''}
         <form method="POST" action="/admin/login" style="margin-top:24px; display:flex; flex-direction:column; gap:12px;">
           <input name="email" type="email" placeholder="Email" required>
           <input name="password" type="password" placeholder="Password" required>
           <button class="btn-primary">Login</button>
         </form>
         <a href="/" style="display:block; margin-top:24px; font-size:13px; color:var(--text-sub);">Back to Home</a>
      </div>
    </div>
  </div>
`);
