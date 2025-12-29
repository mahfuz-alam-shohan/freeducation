import type { Bindings } from '../types';
import { adminLayout, escapeHtml, publicLayout } from '../templates/layout';
import { dbAll, dbFirst, dbRun } from '../utils/db';
import { createSalt, createSession, getSessionAdmin, hashPassword, verifyPassword } from '../utils/auth';
import { hasAnyAdmin } from '../db/schema';

// Helper to handle form data strings
const parseFormValue = (form: FormData, key: string) => {
  const value = form.get(key);
  if (!value || typeof value !== 'string') return '';
  return value.trim();
};

/* --- EXISTING AUTH & CLASS/SUBJECT HANDLERS (Simplified for brevity, keep your existing ones) --- */
/* Note: In a real copy-paste, you would keep your Setup, Login, Class CRUD, Subject CRUD here. */
/* I will focus on the NEW functionality: Resources */

// ... (Assume standard Admin Auth/Class/Subject CRUD exists here or retain from previous file) ...
// Below are the NEW handlers for the "Subject Dashboard" where we upload Textbooks/Board Questions.

export const renderSubjectDashboard = async (env: Bindings, adminName: string, subjectId: number) => {
  const subject = await dbFirst<{ name: string; class_id: number }>(env, 'SELECT name, class_id FROM subjects WHERE id = ?', subjectId);
  if (!subject) return adminLayout('Error', 'Subject not found', adminName);

  // Get Chapters
  const chapters = await dbAll<{ id: number; name: string }>(env, 'SELECT id, name FROM chapters WHERE subject_id = ? ORDER BY order_index', subjectId);
  
  // Get Resources (Textbooks/Board Questions)
  const resources = await dbAll<{ id: number; title: string; category: string }>(env, 'SELECT id, title, category FROM resources WHERE subject_id = ?', subjectId);

  const body = `
    <div class="grid">
       <div class="glass-card">
         <div class="flex-between">
            <h2>${escapeHtml(subject.name)} Manager</h2>
            <a href="/admin/classes/${subject.class_id}/subjects" class="btn btn-soft">Back</a>
         </div>
       </div>

       <div class="grid-2">
         <!-- Left Col: Chapters -->
         <div class="glass-card">
           <h3 class="mb-4">Chapters (Lessons)</h3>
           <form method="post" action="/admin/subjects/${subjectId}/chapters" class="mb-4" style="display: flex; gap: 0.5rem;">
             <input name="name" placeholder="New Chapter Name" required />
             <button class="btn btn-primary">+</button>
           </form>
           <table class="admin-table">
             ${chapters.map(c => `
               <tr>
                 <td>${escapeHtml(c.name)}</td>
                 <td style="text-align: right;">
                    <a href="/admin/chapters/${c.id}/topics" class="btn btn-soft" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">Topics</a>
                 </td>
               </tr>
             `).join('')}
           </table>
         </div>

         <!-- Right Col: Library Resources (NEW) -->
         <div class="glass-card">
           <h3 class="mb-4">Library (Books/Board Qs)</h3>
           <form method="post" action="/admin/subjects/${subjectId}/resources" enctype="multipart/form-data" class="mb-4" style="display: grid; gap: 0.5rem;">
             <input name="title" placeholder="Title (e.g. Dhaka Board 2023)" required />
             <select name="category">
                <option value="textbook">Textbook (NCTB)</option>
                <option value="board_question">Board Question</option>
                <option value="guide">Guide Book</option>
             </select>
             <input type="file" name="file" required />
             <button class="btn btn-primary">Upload Resource</button>
           </form>
           
           <table class="admin-table">
             ${resources.map(r => `
               <tr>
                 <td>
                    <strong>${escapeHtml(r.title)}</strong><br/>
                    <span class="tag" style="font-size: 0.7rem;">${r.category}</span>
                 </td>
                 <td style="text-align: right;">
                    <form method="post" action="/admin/resources/${r.id}/delete">
                        <button class="btn btn-soft" style="color: red;">×</button>
                    </form>
                 </td>
               </tr>
             `).join('')}
           </table>
         </div>
       </div>
    </div>
  `;
  return adminLayout(`Manage ${subject.name}`, body, adminName);
};

export const handleCreateResource = async (env: Bindings, request: Request, subjectId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const category = parseFormValue(form, 'category');
  const file = form.get('file');

  if (!title || !category || !(file instanceof File)) return new Response('Bad Request', { status: 400 });

  const buffer = await file.arrayBuffer();
  const key = `res-${subjectId}/${Date.now()}-${file.name}`;
  
  await env.BUCKET.put(key, buffer, {
      httpMetadata: { contentType: file.type || 'application/pdf' }
  });

  await dbRun(
      env,
      'INSERT INTO resources (subject_id, category, title, r2_key, mime_type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      subjectId, category, title, key, file.type, new Date().toISOString()
  );

  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/dashboard` } }); // Redirect back
};

export const handleDeleteResource = async (env: Bindings, resourceId: number) => {
    // Basic delete logic
    const res = await dbFirst<{r2_key: string, subject_id: number}>(env, 'SELECT r2_key, subject_id FROM resources WHERE id = ?', resourceId);
    if(res) {
        await env.BUCKET.delete(res.r2_key);
        await dbRun(env, 'DELETE FROM resources WHERE id = ?', resourceId);
        return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${res.subject_id}/dashboard` } });
    }
    return new Response('Not found', {status: 404});
};

// ... (Keep existing setup, login, and simple CRUD handlers here for brevity) ... 
// **IMPORTANT**: You must merge this with your existing Auth/Class logic. 
// For a fully functional file, if you need the *entire* merged file, let me know. 
// For now, this snippet highlights the "Resource" logic.
// In your index.ts, you will need to route `/admin/subjects/:id/dashboard` to `renderSubjectDashboard`.
