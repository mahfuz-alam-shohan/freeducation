import type { Bindings } from '../types';
import { dbAll, dbFirst } from '../utils/db';
import { escapeHtml, publicLayout } from '../templates/layout';

// --- Helpers ---

const emptyState = (message: string, icon = '📚') => `
  <div class="glass-card" style="text-align: center; padding: 3rem;">
    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${icon}</div>
    <h3 style="color: var(--primary); font-family: var(--font-bn);">এখনও যোগ করা হয়নি</h3>
    <p class="text-muted">${message}</p>
  </div>
`;

function getSubjectColor(name: string) {
  const n = name.toLowerCase();
  if (n.includes('math') || n.includes('গণিত')) return '#f59e0b'; // Orange
  if (n.includes('physics') || n.includes('পদার্থ')) return '#6366f1'; // Indigo
  if (n.includes('chem') || n.includes('রসায়ন')) return '#ec4899'; // Pink
  if (n.includes('bio') || n.includes('জীব')) return '#10b981'; // Green
  if (n.includes('bangla') || n.includes('বাংলা')) return '#ef4444'; // Red
  return '#3b82f6'; // Blue default
}

function getSubjectIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('math') || n.includes('গণিত')) return '📐';
  if (n.includes('physics') || n.includes('পদার্থ')) return '⚛️';
  if (n.includes('chem') || n.includes('রসায়ন')) return '🧪';
  if (n.includes('bio') || n.includes('জীব')) return '🧬';
  if (n.includes('english')) return 'abc';
  return '📚';
}

function getTypeTag(type: string) {
    if (type === 'math_solution') return '<span class="tag tag-math">Math Solution</span>';
    if (type === 'cq_practice') return '<span class="tag tag-guide">Creative Question</span>';
    return '<span class="tag" style="background: #eee;">Note</span>';
}

// --- Render Functions ---

export const renderHome = async (env: Bindings) => {
  const classes = await dbAll<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes ORDER BY id ASC'
  );

  const body = `
    <div class="hero-section">
      <div class="container">
        <span class="tag tag-board" style="margin-bottom: 1rem;">NCTB Syllabus 2025</span>
        <h1 class="hero-title">বাংলাদেশের সকল শিক্ষার্থীর জন্য <br/> <span style="color: var(--primary);">বিনামূল্যে শিক্ষার আয়োজন</span></h1>
        <p style="font-size: 1.2rem; color: #475569; max-width: 600px; margin: 0 auto 2rem; font-family: var(--font-bn);">
          Textbooks, Board Questions, and Solution Guides - everything you need to ace your SSC and HSC exams.
        </p>
        
        <div class="grid-3" style="margin-top: 3rem; text-align: left;">
          ${classes.map(c => `
            <a href="/class/${c.id}" style="text-decoration: none;">
              <div class="glass-card" style="height: 100%;">
                <div class="card-header">
                  <span class="tag tag-guide">${escapeHtml(c.level)}</span>
                  <span style="font-size: 1.5rem; color: var(--primary);">➔</span>
                </div>
                <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${escapeHtml(c.name)}</h2>
                <p class="text-muted">${escapeHtml(c.description || 'Full Syllabus Access')}</p>
              </div>
            </a>
          `).join('')}
        </div>
        ${classes.length === 0 ? emptyState('No classes found. Please ask admin to add classes.') : ''}
      </div>
    </div>
  `;

  return publicLayout('Home', body);
};

export const renderClass = async (env: Bindings, classId: number) => {
  const classRow = await dbFirst<{ name: string; description: string | null; level: string }>(
    env,
    'SELECT name, description, level FROM classes WHERE id = ?',
    classId
  );
  if (!classRow) return publicLayout('Not Found', '<div class="container" style="padding: 4rem;">Class not found</div>');

  const subjects = await dbAll<{ id: number; name: string; description: string | null; icon_emoji: string | null }>(
    env,
    'SELECT id, name, description, icon_emoji FROM subjects WHERE class_id = ? ORDER BY id ASC',
    classId
  );
  
  const body = `
    <div style="background: var(--primary); color: white; padding: 4rem 0 3rem; margin-bottom: -2rem;">
      <div class="container">
        <span class="tag" style="background: rgba(255,255,255,0.2); color: white;">${escapeHtml(classRow.level)}</span>
        <h1 style="color: white; font-size: 2.5rem; margin-top: 0.5rem;">${escapeHtml(classRow.name)}</h1>
        <p style="color: rgba(255,255,255,0.8); max-width: 600px;">${escapeHtml(classRow.description || '')}</p>
      </div>
    </div>

    <div class="container" style="position: relative; z-index: 2;">
      <h3 class="mb-4" style="color: white; opacity: 0.9;">বিষয়সমূহ (Subjects)</h3>
      
      <div class="grid-4">
        ${subjects.map(subject => `
          <a href="/subject/${subject.id}" style="text-decoration: none;">
            <div class="glass-card" style="text-align: center; height: 100%;">
              <div class="subject-icon" style="background: ${getSubjectColor(subject.name)}; color: white;">
                ${subject.icon_emoji || getSubjectIcon(subject.name)}
              </div>
              <h3 style="font-size: 1.2rem;">${escapeHtml(subject.name)}</h3>
              <p class="text-muted text-sm mt-2">${escapeHtml(subject.description || 'View Chapters & Papers')}</p>
            </div>
          </a>
        `).join('')}
      </div>
      
      ${subjects.length === 0 ? emptyState('No subjects added yet.') : ''}
    </div>
  `;
  return publicLayout(classRow.name, body);
};

export const renderSubject = async (env: Bindings, subjectId: number) => {
  const subject = await dbFirst<{ name: string; class_id: number; class_name: string }>(
    env,
    `SELECT subjects.name, classes.id as class_id, classes.name as class_name 
     FROM subjects JOIN classes ON subjects.class_id = classes.id 
     WHERE subjects.id = ?`,
    subjectId
  );
  if (!subject) return publicLayout('Not Found', '<div class="container" style="padding: 4rem;">Subject not found</div>');

  // Fetch Resources (Books, Papers)
  const resources = await dbAll<{ id: number; category: string; title: string; meta_info: string }>(
    env,
    'SELECT id, category, title, meta_info FROM resources WHERE subject_id = ?',
    subjectId
  );

  // Fetch Chapters
  const chapters = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM chapters WHERE subject_id = ? ORDER BY order_index ASC',
    subjectId
  );

  const textbooks = resources.filter(r => r.category === 'textbook');
  const questions = resources.filter(r => r.category === 'board_question');
  
  const body = `
    <div class="container" style="padding-top: 2rem;">
      <a href="/class/${subject.class_id}" class="btn btn-soft mb-4">⬅ Back to ${escapeHtml(subject.class_name)}</a>
      
      <div class="flex-between mb-4">
        <div>
           <span class="tag tag-guide">Course Material</span>
           <h1 style="font-size: 2.2rem; color: var(--primary-dark); margin-top: 0.5rem;">${escapeHtml(subject.name)}</h1>
        </div>
      </div>

      <div class="grid">
        <!-- Section 1: Digital Bookshelf -->
        ${textbooks.length > 0 ? `
          <div class="glass-card" style="background: #fffbeb;">
            <h3 style="color: #b45309; margin-bottom: 1rem;">📖 পাঠ্যবই (Textbooks)</h3>
            <div class="shelf-grid">
              ${textbooks.map(book => `
                <a href="/resource/${book.id}" style="text-decoration: none; color: inherit;">
                  <div class="book-spine" style="background: ${getSubjectColor(subject.name)}; color: white;">
                     <div style="font-weight: bold; font-family: var(--font-bn);">${escapeHtml(book.title)}</div>
                  </div>
                  <div class="text-center text-sm mt-2 font-bold">Read PDF</div>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Section 2: Board Questions -->
        ${questions.length > 0 ? `
          <div class="glass-card" style="background: #eff6ff;">
            <h3 style="color: #1e40af; margin-bottom: 1rem;">📝 বোর্ড প্রশ্ন (Previous Years)</h3>
            <div class="grid-3">
              ${questions.map(q => `
                <div style="background: white; padding: 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #bfdbfe;">
                  <div>
                    <div style="font-weight: bold;">${escapeHtml(q.title)}</div>
                    <div class="text-muted" style="font-size: 0.8rem;">PDF Document</div>
                  </div>
                  <a href="/resource/${q.id}" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">View</a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Section 3: Chapters / Study Guide -->
        <div>
          <h3 class="mb-4">অধ্যায়সমূহ (Chapters)</h3>
          <div class="grid-2">
            ${chapters.map((chapter, idx) => `
              <a href="/chapter/${chapter.id}" style="text-decoration: none;">
                <div class="glass-card">
                   <div class="text-muted text-sm mb-2">Chapter ${idx + 1}</div>
                   <h3 style="margin-bottom: 0.5rem; font-size: 1.3rem;">${escapeHtml(chapter.name)}</h3>
                   <p class="text-muted text-sm" style="margin-bottom: 1rem;">${escapeHtml(chapter.description || 'Start learning...')}</p>
                   <div class="mt-2" style="text-align: right; color: var(--primary); font-weight: bold; font-size: 0.9rem;">Read Notes &rarr;</div>
                </div>
              </a>
            `).join('')}
          </div>
          ${chapters.length === 0 ? emptyState('No chapters added yet.', '📝') : ''}
        </div>
      </div>
    </div>
  `;
  return publicLayout(subject.name, body);
};

export const renderChapter = async (env: Bindings, chapterId: number) => {
  const chapter = await dbFirst<{ name: string; subject_id: number; subject_name: string }>(
    env,
    `SELECT chapters.name, chapters.subject_id, subjects.name as subject_name 
     FROM chapters JOIN subjects ON chapters.subject_id = subjects.id WHERE chapters.id = ?`,
    chapterId
  );
  if (!chapter) return publicLayout('Not found', '<div class="container" style="padding: 4rem;">Chapter not found</div>');

  const topics = await dbAll<{ id: number; title: string; content: string; type: string }>(
    env,
    'SELECT id, title, content, type FROM topics WHERE chapter_id = ? ORDER BY order_index ASC',
    chapterId
  );

  const body = `
    <div class="container" style="padding-top: 2rem;">
      <a href="/subject/${chapter.subject_id}" class="btn btn-soft mb-4">⬅ Back to ${escapeHtml(chapter.subject_name)}</a>
      
      <div class="glass-card mb-4" style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white;">
        <h1 style="color: white;">${escapeHtml(chapter.name)}</h1>
      </div>

      <div class="grid">
        ${topics.map(topic => `
          <div class="glass-card">
            <div class="card-header">
              <h2 style="font-size: 1.5rem;">${escapeHtml(topic.title)}</h2>
              ${getTypeTag(topic.type)}
            </div>
            <div style="font-size: 1.1rem; color: #334155; white-space: pre-wrap; line-height: 1.8;">${escapeHtml(topic.content || '')}</div>
            
            <div class="mt-2 text-right">
              <a href="/topic/${topic.id}" class="btn btn-soft">View Details & Files</a>
            </div>
          </div>
        `).join('')}
      </div>
       ${topics.length === 0 ? emptyState('No notes added to this chapter yet.', '📝') : ''}
    </div>
  `;
  return publicLayout(chapter.name, body);
};

export const renderTopic = async (env: Bindings, topicId: number) => {
    const topic = await dbFirst<{ title: string; content: string; chapter_id: number }>(env, 'SELECT * FROM topics WHERE id = ?', topicId);
    if(!topic) return publicLayout('Not found', 'Topic not found');
    
    const files = await dbAll<{id:number, title:string, size: number}>(env, 'SELECT id, title, size FROM files WHERE topic_id = ?', topicId);

    const body = `
        <div class="container" style="padding-top: 2rem;">
            <a href="/chapter/${topic.chapter_id}" class="btn btn-soft mb-4">⬅ Back to Chapter</a>
            <div class="glass-card">
                <h1 style="font-size: 2rem; color: var(--primary); margin-bottom: 1.5rem;">${escapeHtml(topic.title)}</h1>
                <div style="margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap;">${escapeHtml(topic.content || '')}</div>
                
                ${files.length > 0 ? `
                <h3 style="border-top: 1px solid #eee; padding-top: 1rem; margin-bottom: 1rem;">Attached Files</h3>
                <div class="grid-2">
                    ${files.map(f => `
                        <a href="/files/${f.id}" class="btn btn-soft" style="justify-content: space-between; padding: 1rem;">
                            <span>${escapeHtml(f.title)}</span>
                            <span>⬇ ${Math.round(f.size/1024)} KB</span>
                        </a>
                    `).join('')}
                </div>` : ''}
            </div>
        </div>
    `;
    return publicLayout(topic.title, body);
};


