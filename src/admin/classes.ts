import { ClassRow, GroupRow, SubjectRow, Env } from "../types";
import { escapeHtml, renderPage } from "../ui";

const redirect = (loc: string) => new Response(null, { status: 303, headers: { Location: loc } });

export async function renderClassesList(session: any, env: Env) {
  const classes = await env.DB.prepare(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM subjects WHERE class_id = c.id OR (link_id IS NOT NULL AND link_id = lm.link_id)) as subject_count,
           lm.link_id
    FROM classes c
    LEFT JOIN class_link_members lm ON lm.class_id = c.id
    ORDER BY c.created_at DESC
  `).all<ClassRow & {subject_count: number, link_id: number | null}>();

  const linkIds = classes.results?.map(c => c.link_id).filter(Boolean) || [];
  const linkMap = new Map<number, string[]>();

  if (linkIds.length > 0) {
    const links = await env.DB.prepare(`
      SELECT lm.link_id, c.name 
      FROM class_link_members lm 
      JOIN classes c ON c.id = lm.class_id 
      WHERE lm.link_id IN (${linkIds.join(',')})
    `).all<{link_id: number, name: string}>();

    links.results?.forEach(l => {
      if (!linkMap.has(l.link_id)) linkMap.set(l.link_id, []);
      linkMap.get(l.link_id)?.push(l.name);
    });
  }

  return renderPage("Classes", `
    <div class="header header-split">
      <div>
        <h1 class="page-title">Classes</h1>
        <div class="page-subtitle">Plan the curriculum flow</div>
      </div>
      <button onclick="toggleModal('new-class-modal', true)" class="btn-text">Add Class</button>
    </div>

    <div class="search-row">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.3-4.3"></path></svg>
      <input id="class-filter" class="search-input" type="search" placeholder="Search classes..." oninput="filterList('class-filter', '[data-filter-row]')">
    </div>

    <div class="inset-list">
      ${classes.results?.map(c => {
        const linkedWith = c.link_id ? linkMap.get(c.link_id)?.filter(n => n !== c.name) : [];
        const linkText = linkedWith && linkedWith.length > 0 ? `Linked with ${linkedWith.join(', ')}` : '';
        
        return `
        <div class="list-row" data-filter-row data-filter="${escapeHtml(c.name)} ${escapeHtml(linkText)}">
          <div class="row-content" onclick="window.location='/admin/classes/${c.id}'" style="cursor:pointer;">
            <div class="row-title">${escapeHtml(c.name)}</div>
            <div class="row-subtitle">
              ${linkText ? `<span class="tag tag-linked">${escapeHtml(linkText)}</span>` : `${c.subject_count} Subjects`}
              ${c.has_groups ? ' • Groups' : ''}
            </div>
          </div>
          <button class="btn-icon-circle" type="button" aria-label="Edit class ${escapeHtml(c.name)}" title="Edit class" onclick="openEdit('edit-class-modal', '/admin/classes/edit', {id: '${c.id}', name: '${escapeHtml(c.name)}', has_groups: ${c.has_groups}})">
            <svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>
          <button class="row-action" type="button" aria-label="Open class ${escapeHtml(c.name)}" title="Open class" onclick="window.location='/admin/classes/${c.id}'">
            <svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </div>
      `}).join('') || '<div class="empty-state">No classes found. Tap Add Class to create one.</div>'}
    </div>

    <!-- Create Class Modal -->
    <div id="new-class-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Class</div>
        <form action="/admin/classes" method="POST">
          <div class="modal-body">
             <div class="input-group">
                <input name="name" class="input" required placeholder="Class Name (e.g. Class 9)">
             </div>
             <div class="input-group form-row">
                <span class="form-row-label">Enable Groups</span>
                <input type="checkbox" name="has_groups" value="1" class="toggle">
             </div>
          </div>
          <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-class-modal', false)">Cancel</div>
             <button class="modal-btn">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Class Modal -->
    <div id="edit-class-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Class</div>
        <form method="POST">
          <div class="modal-body">
             <input type="hidden" name="id">
             <div class="input-group">
                <input name="name" class="input" required placeholder="Class Name">
             </div>
             <div class="input-group form-row">
                <span class="form-row-label">Enable Groups</span>
                <input type="checkbox" name="has_groups" value="1" class="toggle">
             </div>
          </div>
          <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-class-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
          </div>
        </form>
        <form action="/admin/classes/delete" method="POST" style="border-top:0.5px solid var(--separator);">
           <input type="hidden" name="id" id="del-cls-id">
           <div class="modal-actions">
             <button class="modal-btn danger" onclick="this.form.querySelector('#del-cls-id').value = document.querySelector('#edit-class-modal input[name=id]').value; return confirm('Delete entire class?');">Delete Class</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session);
}

export async function renderClassDetail(session: any, env: Env, classId: number) {
  const classData = await env.DB.prepare(`
    SELECT c.*, lm.link_id
    FROM classes c
    LEFT JOIN class_link_members lm ON lm.class_id = c.id
    WHERE c.id = ?
  `).bind(classId).first<ClassRow & {link_id: number | null}>();

  if (!classData) return new Response("Class not found", { status: 404 });

  let linkedNames: string[] = [];
  if (classData.link_id) {
     const res = await env.DB.prepare("SELECT c.name FROM class_link_members lm JOIN classes c ON c.id = lm.class_id WHERE lm.link_id = ? AND c.id != ?").bind(classData.link_id, classId).all<{name:string}>();
     linkedNames = res.results?.map(r => r.name) || [];
  }
  
  const linkId = classData.link_id;
  
  const [subjects, groups, classOptions] = await env.DB.batch([
    env.DB.prepare(`
      SELECT s.*, g.name as group_name
      FROM subjects s
      LEFT JOIN class_groups g ON g.id = s.group_id
      WHERE (s.class_id = ? OR (s.link_id IS NOT NULL AND s.link_id = ?))
      ORDER BY s.group_id ASC, s.name ASC
    `).bind(classId, linkId || -1),
    env.DB.prepare(`
      SELECT * FROM class_groups 
      WHERE (class_id = ? OR (link_id IS NOT NULL AND link_id = ?))
    `).bind(classId, linkId || -1),
    env.DB.prepare(`
      SELECT c.id, c.name, lm.link_id
      FROM classes c
      LEFT JOIN class_link_members lm ON lm.class_id = c.id
      WHERE c.id != ?
      ORDER BY c.name ASC
    `).bind(classId)
  ]);

  const allSubjects = subjects.results as SubjectRow[] || [];
  const groupList = groups.results as GroupRow[] || [];
  const availableClasses = classOptions.results as Array<{id: number; name: string; link_id: number | null}> || [];
  const linkableClasses = availableClasses.filter(c => !c.link_id || c.link_id === linkId);
  
  const commonSubjects = allSubjects.filter(s => !s.group_id);
  const subjectsByGroup = new Map<number, SubjectRow[]>();
  groupList.forEach(g => subjectsByGroup.set(g.id, allSubjects.filter(s => s.group_id === g.id)));

  return renderPage(classData.name, `
    <div class="header">
      <h1 class="page-title">${escapeHtml(classData.name)}</h1>
      <div class="page-subtitle">
         ${linkedNames.length > 0 
           ? `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> 
              <span class="linked-text">Linked with ${escapeHtml(linkedNames.join(', '))}</span>` 
           : 'Not linked'}
      </div>
    </div>

    <div class="action-row">
       ${classData.has_groups ? `<button onclick="toggleModal('new-group-modal', true)" class="btn-text">+ Group</button>` : ''}
       <button onclick="toggleModal('link-modal', true)" class="btn-text">Link Class</button>
    </div>

    <!-- COMMON SUBJECTS -->
    <div class="list-header list-header-split">
       <span>Common Subjects</span>
       <button onclick="openEdit('new-subject-modal', '/admin/subjects', {class_id: ${classId}, group_id: ''})" class="btn-icon" type="button" aria-label="Add common subject" title="Add subject">+</button>
    </div>
    <div class="inset-list">
      ${commonSubjects.map(s => `
        <div class="list-row">
           <div class="row-content" onclick="window.location='/admin/subjects/${s.id}'" style="cursor:pointer;">
             <div class="row-title">${escapeHtml(s.name)}</div>
           </div>
           <button class="btn-icon-circle" type="button" aria-label="Edit subject ${escapeHtml(s.name)}" title="Edit subject" onclick="openEdit('edit-subject-modal', '/admin/subjects/edit', {id: '${s.id}', name: '${escapeHtml(s.name)}', class_id: '${classId}'})">
             <svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
           </button>
           <button class="row-action" type="button" aria-label="Open subject ${escapeHtml(s.name)}" title="Open subject" onclick="window.location='/admin/subjects/${s.id}'"><svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
        </div>
      `).join('') || '<div class="empty-state">No common subjects</div>'}
    </div>

    <!-- GROUPS -->
    ${groupList.map(g => `
      <div class="list-header list-header-split">
         <span>${escapeHtml(g.name)}</span>
         <div class="inline-actions">
            <button onclick="openEdit('delete-group-modal', '/admin/classes/group/delete', {id: '${g.id}'})" class="btn-muted" type="button">Trash</button>
            <button onclick="openEdit('new-subject-modal', '/admin/subjects', {class_id: ${classId}, group_id: ${g.id}})" class="btn-icon" type="button" aria-label="Add subject to ${escapeHtml(g.name)}" title="Add subject">+</button>
         </div>
      </div>
      <div class="inset-list">
         ${(subjectsByGroup.get(g.id) || []).map(s => `
           <div class="list-row">
             <div class="row-content" onclick="window.location='/admin/subjects/${s.id}'" style="cursor:pointer;">
               <div class="row-title">${escapeHtml(s.name)}</div>
             </div>
             <button class="btn-icon-circle" type="button" aria-label="Edit subject ${escapeHtml(s.name)}" title="Edit subject" onclick="openEdit('edit-subject-modal', '/admin/subjects/edit', {id: '${s.id}', name: '${escapeHtml(s.name)}', class_id: '${classId}'})">
               <svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
             </button>
             <button class="row-action" type="button" aria-label="Open subject ${escapeHtml(s.name)}" title="Open subject" onclick="window.location='/admin/subjects/${s.id}'"><svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
           </div>
         `).join('') || '<div class="empty-state">No subjects in this group</div>'}
      </div>
    `).join('')}

    <!-- Add Subject Modal -->
    <div id="new-subject-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Subject</div>
        <form action="/admin/subjects" method="POST">
           <input type="hidden" name="class_id">
           <input type="hidden" name="group_id">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required placeholder="Subject Name"></div>
             <p class="helper-text">This subject will be auto-linked to all connected classes.</p>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-subject-modal', false)">Cancel</div>
             <button class="modal-btn">Add</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- Edit Subject Modal -->
    <div id="edit-subject-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Subject</div>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="class_id">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-subject-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
           </div>
        </form>
        <form action="/admin/subjects/delete" method="POST" style="border-top:0.5px solid var(--separator);">
           <input type="hidden" name="id" id="del-sub-id">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-actions">
             <button class="modal-btn danger" onclick="this.form.querySelector('#del-sub-id').value = document.querySelector('#edit-subject-modal input[name=id]').value; return confirm('Delete Subject from ALL linked classes?');">Delete</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- New Group Modal -->
    <div id="new-group-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Group</div>
        <form action="/admin/classes/group" method="POST">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required placeholder="Group Name (e.g. Science)"></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-group-modal', false)">Cancel</div>
             <button class="modal-btn">Create</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Group Confirmation -->
    <div id="delete-group-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header" style="color:var(--danger);">Delete Group?</div>
        <form action="/admin/classes/group/delete" method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-body" style="text-align:center; color:var(--text-secondary); font-size:15px;">
              This will remove the group and its subjects from ALL linked classes.
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('delete-group-modal', false)">Cancel</div>
             <button class="modal-btn danger">Delete</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- Link Modal -->
    <div id="link-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Link Class</div>
        <form action="/admin/classes/link" method="POST">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-body">
             <div class="helper-text" style="margin-bottom:12px;">
                Pick a class to link. Content will stay shared across linked classes.
             </div>
             ${linkableClasses.length > 0 ? `
               <div class="input-group">
                  <select name="link_class_id" class="input" required>
                    <option value="" disabled selected>Select class</option>
                    ${linkableClasses.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
                  </select>
               </div>
             ` : '<div class="empty-state">No available classes to link yet.</div>'}
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('link-modal', false)">Cancel</div>
             <button class="modal-btn" ${linkableClasses.length === 0 ? 'disabled' : ''}>Link</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session, `<a href="/admin/classes">Classes</a>`);
}

export async function handleCreateClass(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("INSERT INTO classes (name, has_groups, created_at) VALUES (?,?,?)").bind(fd.get("name"), fd.get("has_groups") ? 1 : 0, new Date().toISOString()).run();
  return redirect("/admin/classes");
}

export async function handleEditClass(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("UPDATE classes SET name = ?, has_groups = ? WHERE id = ?").bind(fd.get("name"), fd.get("has_groups") ? 1 : 0, fd.get("id")).run();
  return redirect("/admin/classes");
}

export async function handleDeleteClass(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM classes WHERE id = ?").bind(fd.get("id")).run();
  return redirect("/admin/classes");
}

export async function handleCreateGroup(request: Request, env: Env) {
  const fd = await request.formData();
  const classId = Number(fd.get("class_id"));
  const linkRow = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{ link_id: number }>();
  await env.DB.prepare("INSERT INTO class_groups (name, class_id, link_id, created_at) VALUES (?,?,?,?)").bind(fd.get("name"), linkRow?.link_id ? null : classId, linkRow?.link_id || null, new Date().toISOString()).run();
  return redirect(`/admin/classes/${classId}`);
}

export async function handleDeleteGroup(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM class_groups WHERE id = ?").bind(fd.get("id")).run();
  return redirect(`/admin/classes/${fd.get("class_id")}`);
}

export async function handleLinkClasses(request: Request, env: Env) {
  const fd = await request.formData();
  const classId = Number(fd.get("class_id"));
  const targetId = Number(fd.get("link_class_id"));

  if (!classId || !targetId || classId === targetId) {
    return redirect(`/admin/classes/${classId}`);
  }

  const [sourceClass, targetClass] = await env.DB.batch([
    env.DB.prepare("SELECT id FROM classes WHERE id = ?").bind(classId),
    env.DB.prepare("SELECT id FROM classes WHERE id = ?").bind(targetId)
  ]);

  if (!sourceClass.results?.length || !targetClass.results?.length) {
    return new Response("Class not found", { status: 404 });
  }

  let linkId: number | null = null;
  const c1Link = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{link_id: number}>();
  if (c1Link) linkId = c1Link.link_id;
  const c2Link = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(targetId).first<{link_id: number}>();
  if (c2Link) {
    if (linkId && linkId !== c2Link.link_id) return new Response("Error: Classes belong to different links.", {status: 400});
    linkId = c2Link.link_id;
  }

  if (!linkId) {
    const linkRes = await env.DB.prepare("INSERT INTO class_links (name, created_at) VALUES (?, ?)").bind("Linked Group", new Date().toISOString()).run();
    linkId = linkRes.meta.last_row_id as number;
  }

  await env.DB.prepare("INSERT OR IGNORE INTO class_link_members (link_id, class_id) VALUES (?,?)").bind(linkId, classId).run();
  await env.DB.prepare("INSERT OR IGNORE INTO class_link_members (link_id, class_id) VALUES (?,?)").bind(linkId, targetId).run();
  await env.DB.prepare("UPDATE subjects SET link_id = ?, class_id = NULL WHERE class_id IN (?, ?)").bind(linkId, classId, targetId).run();
  await env.DB.prepare("UPDATE class_groups SET link_id = ?, class_id = NULL WHERE class_id IN (?, ?)").bind(linkId, classId, targetId).run();

  return redirect(`/admin/classes/${classId}`);
}

export async function handleCreateSubject(request: Request, env: Env) {
  const fd = await request.formData();
  const classId = Number(fd.get("class_id"));
  const linkRow = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{ link_id: number }>();
  await env.DB.prepare("INSERT INTO subjects (name, class_id, group_id, link_id, created_at) VALUES (?,?,?,?,?)")
    .bind(fd.get("name"), linkRow?.link_id ? null : classId, fd.get("group_id") || null, linkRow?.link_id || null, new Date().toISOString()).run();
  return redirect(`/admin/classes/${classId}`);
}

export async function handleEditSubject(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("UPDATE subjects SET name = ? WHERE id = ?").bind(fd.get("name"), fd.get("id")).run();
  return redirect(`/admin/classes/${fd.get("class_id")}`);
}

export async function handleDeleteSubject(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM subjects WHERE id = ?").bind(fd.get("id")).run();
  return redirect(`/admin/classes/${fd.get("class_id")}`);
}
