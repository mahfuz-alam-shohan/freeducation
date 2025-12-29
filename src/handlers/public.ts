import type { Bindings } from '../types';
import { publicLayout, escapeHtml } from '../templates/layout';
import { dbAll, dbFirst } from '../utils/db';

export const renderHome = async (env: Bindings) => {
  const classes = await dbAll(env, 'SELECT * FROM classes ORDER BY id');
  
  const body = `
    <div style="background:linear-gradient(135deg, var(--primary), var(--secondary)); color:white; padding:4rem 0; text-align:center;">
      <div class="container">
        <h1 style="font-size:2.5rem; margin-bottom:1rem; font-family: var(--font-bn);">Master Your Curriculum</h1>
        <p style="font-size:1.2rem; opacity:0.9; max-width:600px; margin:0 auto;">Free access to notes, creative questions, and board papers for Bangladeshi students.</p>
      </div>
    </div>
    <div class="container" style="margin-top:-2rem;">
      <div class="grid-3">
        ${classes.map((c:any) => `
          <a href="/class/${c.id}" class="card" style="text-align:center; padding:2rem; text-decoration:none; color:inherit;">
            <div style="font-size:2rem; margin-bottom:0.5rem;">🎓</div>
            <h3>${escapeHtml(c.name)}</h3>
            <p class="text-muted">${escapeHtml(c.level)}</p>
          </a>
        `).join('')}
      </div>
    </div>
  `;
  return publicLayout('Home', body);
};

export const renderClass = async (env: Bindings, id: number) => {
  const cls = await dbFirst(env, 'SELECT * FROM classes WHERE id=?', id) as any;
  if (!cls) return publicLayout('Not Found', '<div class="container">Class not found</div>');
  
  const subjects = await dbAll(env, 'SELECT * FROM subjects WHERE class_id=?', id);
  
  const body = `
    <div class="container" style="padding:2rem 1rem;">
      <h2>${escapeHtml(cls.name)} <span class="text-muted" style="font-size:1rem;">Subjects</span></h2>
      <div class="grid-3" style="margin-top:1.5rem;">
        ${subjects.map((s:any) => `
          <a href="/subject/${s.id}" class="card" style="text-decoration:none; color:inherit;">
            <h3>${escapeHtml(s.name)}</h3>
            <p class="text-muted" style="margin-top:0.5rem;">${escapeHtml(s.description || 'View Chapter & Resources')}</p>
            <div style="margin-top:1rem; color:var(--primary); font-weight:600; font-size:0.9rem;">Start Learning →</div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
  return publicLayout(cls.name, body);
};

export const renderSubject = async (env: Bindings, id: number) => {
  const sub = await dbFirst(env, 'SELECT * FROM subjects WHERE id=?', id) as any;
  if (!sub) return publicLayout('Not Found', '<div class="container">Subject not found</div>');
  
  const chapters = await dbAll(env, 'SELECT * FROM chapters WHERE subject_id=? ORDER BY order_index', id);
  const resources = await dbAll(env, 'SELECT * FROM resources WHERE subject_id=?', id);
  
  const body = `
    <div class="container" style="padding:2rem 1rem;">
      <div style="margin-bottom:2rem;">
        <span class="badge badge-blue">Subject</span>
        <h1>${escapeHtml(sub.name)}</h1>
      </div>
      
      <div class="grid-2">
        <div>
          <h3 style="margin-bottom:1rem;">Chapters</h3>
          <div class="stack">
            ${chapters.map((c:any) => `
              <a href="/chapter/${c.id}" class="card" style="display:flex; justify-content:space-between; align-items:center; text-decoration:none; color:inherit;">
                <div>
                  <div class="text-muted" style="font-size:0.8rem;">Chapter ${c.order_index}</div>
                  <div style="font-weight:600;">${escapeHtml(c.name)}</div>
                </div>
                <div style="background:var(--slate-100); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;">➝</div>
              </a>
            `).join('')}
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom:1rem;">Downloads</h3>
          <div class="card stack">
            ${resources.length === 0 ? '<p class="text-muted">No files uploaded yet.</p>' : ''}
            ${resources.map((r:any) => `
              <a href="/resource/${r.id}" target="_blank" style="display:flex; justify-content:space-between; padding:0.5rem; border-bottom:1px solid #f1f5f9; text-decoration:none; color:inherit;">
                <span>${escapeHtml(r.title)}</span>
                <span class="badge badge-green">${escapeHtml(r.category)}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  return publicLayout(sub.name, body);
};

export const renderChapter = async (env: Bindings, id: number) => {
  const chapter = await dbFirst(env, 'SELECT * FROM chapters WHERE id=?', id) as any;
  if (!chapter) return publicLayout('Not Found', '<div class="container">Chapter not found</div>');
  
  const topics = await dbAll(env, 'SELECT * FROM topics WHERE chapter_id=? ORDER BY order_index', id);
  const contents = await dbAll(env, `SELECT * FROM contents WHERE topic_id IN (SELECT id FROM topics WHERE chapter_id=?)`, id);
  const questions = await dbAll(env, 'SELECT * FROM questions WHERE chapter_id=?', id);

  const body = `
    <div class="container" style="padding:2rem 1rem;">
      <div style="text-align:center; margin-bottom:3rem;">
        <div class="text-muted">Chapter ${chapter.order_index}</div>
        <h1 style="font-size:2.5rem; color:var(--primary);">${escapeHtml(chapter.name)}</h1>
      </div>

      <div style="max-width:800px; margin:0 auto;">
        ${topics.map((t:any) => {
           const topicContents = contents.filter((c:any) => c.topic_id === t.id);
           return `
             <div id="topic-${t.id}" style="margin-bottom:3rem;">
               <h2 style="border-bottom:2px solid var(--slate-200); padding-bottom:0.5rem; margin-bottom:1.5rem;">${escapeHtml(t.title)}</h2>
               ${topicContents.map((c:any) => `
                 <div class="content-block ${c.type}">
                   ${c.type==='short_qa' ? '<strong>📌 Short Q: </strong>' : ''}
                   ${c.body} 
                 </div>
               `).join('')}
               ${topicContents.length === 0 ? '<p class="text-muted">No detailed notes added yet.</p>' : ''}
             </div>
           `;
        }).join('')}
      </div>

      ${questions.length > 0 ? `
        <div style="margin-top:4rem; padding-top:2rem; border-top:1px solid var(--slate-200);">
          <h2 style="text-align:center; margin-bottom:2rem;">Practice Zone</h2>
          <div class="grid-2">
             ${questions.map((q:any) => `
               <div class="card">
                 <div class="badge ${q.type==='mcq'?'badge-blue':'badge-orange'}">${q.type.toUpperCase()}</div>
                 <div style="font-weight:600; margin-top:0.5rem;">${escapeHtml(q.question_text)}</div>
                 ${q.type === 'mcq' ? `<div class="text-muted" style="margin-top:0.5rem; font-size:0.9rem;">${JSON.parse(q.options_json).map((o:string, i:number)=>`<div>${String.fromCharCode(65+i)}) ${escapeHtml(o)}</div>`).join('')}</div>` : ''}
                 <details style="margin-top:1rem; cursor:pointer;">
                   <summary class="text-muted">View Solution</summary>
                   <div style="margin-top:0.5rem; padding:0.5rem; background:#f0fdf4; border-radius:6px; font-size:0.9rem;">
                     ${q.correct_answer ? `<strong>Ans: ${q.correct_answer}</strong><br>` : ''}
                     ${escapeHtml(q.solution_text || 'No solution provided')}
                   </div>
                 </details>
               </div>
             `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  return publicLayout(chapter.name, body);
};


