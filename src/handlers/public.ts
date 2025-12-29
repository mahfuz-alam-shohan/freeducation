import type { Bindings } from '../types';
import { dbAll, dbFirst } from '../utils/db';
import { escapeHtml, publicLayout } from '../templates/layout';

// Helper for empty states
const emptyState = (message: string) => `
  <div class="text-center" style="padding: 4rem 1rem;">
    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
    <h3>Nothing here yet</h3>
    <p>${message}</p>
  </div>
`;

export const renderHome = async (env: Bindings) => {
  const classes = await dbAll<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes ORDER BY id ASC' // Changed to ASC for logical class ordering (6, 7, 8...)
  );

  const body = `
    <section class="hero">
      <div class="container">
        <h1>Unlock Your Potential <br/> <span style="color: var(--primary);">With Free Education</span></h1>
        <p>Access the entire Bangladeshi curriculum (NCTB) for free. Class notes, lectures, and resources tailored for your success.</p>
        <div class="flex-wrap" style="justify-content: center;">
          <a href="#browse-classes" class="btn btn-primary">Start Learning</a>
        </div>
      </div>
    </section>

    <div class="container" id="browse-classes">
      <div class="section-header text-center">
        <span class="badge">Academic Library</span>
        <h2 style="margin-top: 0.5rem;">Select Your Class</h2>
      </div>

      ${classes.length === 0 ? emptyState('No classes have been added yet.') : ''}

      <div class="grid three">
        ${classes
          .map(
            (item) => `
          <a href="/class/${item.id}" style="text-decoration: none;">
            <article class="card">
              <div class="card-decoration"></div>
              <div class="card-content">
                <span class="badge">${escapeHtml(item.level)}</span>
                <h3>${escapeHtml(item.name)}</h3>
                <p class="text-sm" style="flex-grow: 1;">${escapeHtml(item.description ?? 'General studies and resources.')}</p>
                <div style="margin-top: 0.5rem; font-weight: 600; color: var(--primary); font-size: 0.9rem;">
                  Browse Subjects &rarr;
                </div>
              </div>
            </article>
          </a>`
          )
          .join('')}
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
  if (!classRow) {
    return publicLayout('Class not found', '<div class="container"><div class="card">Class not found.</div></div>');
  }
  const subjects = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM subjects WHERE class_id = ? ORDER BY id ASC',
    classId
  );
  
  const body = `
    <div style="background: var(--primary); color: white; padding: 3rem 0; margin-bottom: 2rem;">
      <div class="container">
        <span style="opacity: 0.8; font-weight: 500;">${escapeHtml(classRow.level)}</span>
        <h1 style="color: white; margin-top: 0.5rem;">${escapeHtml(classRow.name)}</h1>
        <p style="color: rgba(255,255,255,0.8); max-width: 600px;">${escapeHtml(classRow.description ?? '')}</p>
      </div>
    </div>

    <div class="container">
      <div class="section-header">
        <h2>Subjects</h2>
        <p>Choose a subject to start learning chapters.</p>
      </div>

      ${subjects.length === 0 ? emptyState('No subjects added to this class yet.') : ''}

      <div class="grid four">
        ${subjects
          .map(
            (subject) => `
          <a href="/subject/${subject.id}" style="text-decoration: none;">
            <div class="card" style="text-align: center; height: 100%; justify-content: center; padding: 2rem 1.5rem;">
              <div style="width: 50px; height: 50px; background: var(--primary-light); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: bold;">
                ${subject.name.charAt(0).toUpperCase()}
              </div>
              <h3 style="font-size: 1.1rem;">${escapeHtml(subject.name)}</h3>
              <p class="text-sm" style="margin-top: 0.5rem;">${escapeHtml(subject.description ?? 'View Chapters')}</p>
            </div>
          </a>`
          )
          .join('')}
      </div>
    </div>
  `;
  return publicLayout(`${classRow.name}`, body);
};

export const renderSubject = async (env: Bindings, subjectId: number) => {
  const subject = await dbFirst<{ name: string; description: string | null; class_name: string; class_id: number }>(
    env,
    `SELECT subjects.name, subjects.description, classes.name as class_name, classes.id as class_id 
     FROM subjects 
     JOIN classes ON subjects.class_id = classes.id 
     WHERE subjects.id = ?`,
    subjectId
  );

  if (!subject) {
    return publicLayout('Subject not found', '<div class="container">Subject not found.</div>');
  }

  const chapters = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM chapters WHERE subject_id = ? ORDER BY order_index ASC, id ASC',
    subjectId
  );

  const body = `
    <div class="container" style="margin-top: 2rem;">
      <a href="/class/${subject.class_id}" class="btn btn-outline btn-sm" style="margin-bottom: 1rem;">&larr; Back to ${escapeHtml(subject.class_name)}</a>
      
      <div class="card" style="margin-bottom: 2rem; border-left: 5px solid var(--secondary);">
        <h1 style="color: var(--secondary); margin-bottom: 0.5rem;">${escapeHtml(subject.name)}</h1>
        <p class="text-sm">Course Material</p>
      </div>

      <div class="section-header">
        <h2>Course Chapters</h2>
      </div>

      <div class="list-group">
        ${chapters.length === 0 ? '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No chapters available yet.</div>' : ''}
        ${chapters
          .map(
            (chapter, index) => `
          <div class="list-item">
            <div style="flex-grow: 1;">
              <div class="text-sm" style="color: var(--primary); font-weight: 600; text-transform: uppercase; margin-bottom: 0.25rem;">Chapter ${index + 1}</div>
              <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${escapeHtml(chapter.name)}</h3>
              <p class="text-sm">${escapeHtml(chapter.description ?? '')}</p>
            </div>
            <a class="btn btn-primary btn-sm" href="/chapter/${chapter.id}">Start</a>
          </div>`
          )
          .join('')}
      </div>
    </div>
  `;
  return publicLayout(`${subject.name}`, body);
};

export const renderChapter = async (env: Bindings, chapterId: number) => {
  const chapter = await dbFirst<{ name: string; description: string | null; subject_id: number; subject_name: string }>(
    env,
    `SELECT chapters.name, chapters.description, chapters.subject_id, subjects.name as subject_name
     FROM chapters 
     JOIN subjects ON chapters.subject_id = subjects.id
     WHERE chapters.id = ?`,
    chapterId
  );

  if (!chapter) {
    return publicLayout('Chapter not found', 'Not found');
  }

  const topics = await dbAll<{ id: number; title: string; content: string | null }>(
    env,
    'SELECT id, title, content FROM topics WHERE chapter_id = ? ORDER BY order_index ASC, id ASC',
    chapterId
  );

  const body = `
    <div class="container" style="margin-top: 2rem;">
      <a href="/subject/${chapter.subject_id}" class="btn btn-outline btn-sm" style="margin-bottom: 1rem;">&larr; Back to ${escapeHtml(chapter.subject_name)}</a>

      <header style="margin-bottom: 3rem; text-align: center;">
        <h1 style="margin-bottom: 1rem;">${escapeHtml(chapter.name)}</h1>
        <p style="font-size: 1.1rem; max-width: 700px; margin: 0 auto;">${escapeHtml(chapter.description ?? '')}</p>
      </header>

      <div class="grid two">
        ${topics
          .map(
            (topic) => `
          <article class="card" style="border-top: 4px solid var(--accent);">
            <h3>${escapeHtml(topic.title)}</h3>
            <p style="margin: 1rem 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${escapeHtml(topic.content ?? 'Click to read more details about this topic.')}
            </p>
            <div style="margin-top: auto;">
              <a href="/topic/${topic.id}" class="btn btn-outline btn-sm" style="width: 100%;">Read & Download</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
       ${topics.length === 0 ? emptyState('No topics in this chapter yet.') : ''}
    </div>
  `;
  return publicLayout(`${chapter.name}`, body);
};

export const renderTopic = async (env: Bindings, topicId: number) => {
  const topic = await dbFirst<{ title: string; content: string | null; chapter_id: number; chapter_name: string }>(
    env,
    `SELECT topics.title, topics.content, topics.chapter_id, chapters.name as chapter_name 
     FROM topics 
     JOIN chapters ON topics.chapter_id = chapters.id
     WHERE topics.id = ?`,
    topicId
  );

  if (!topic) {
    return publicLayout('Topic not found', 'Not found');
  }

  const files = await dbAll<{ id: number; title: string; mime_type: string | null; size: number | null }>(
    env,
    'SELECT id, title, mime_type, size FROM files WHERE topic_id = ? ORDER BY id DESC',
    topicId
  );

  const body = `
    <div class="container" style="margin-top: 2rem; max-width: 800px;">
      <a href="/chapter/${topic.chapter_id}" class="btn btn-outline btn-sm" style="margin-bottom: 1rem;">&larr; Back to ${escapeHtml(topic.chapter_name)}</a>
      
      <article class="card" style="margin-bottom: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1.5rem; color: var(--primary);">${escapeHtml(topic.title)}</h1>
        <div style="font-size: 1.1rem; line-height: 1.8; color: var(--text-main); white-space: pre-wrap;">${escapeHtml(topic.content ?? '')}</div>
      </article>

      ${files.length > 0 ? `
        <div class="card" style="background: var(--bg-body); border: none;">
          <h3 style="margin-bottom: 1rem;">⬇️ Downloadable Resources</h3>
          <div class="list-group">
            ${files.map(file => `
              <div class="list-item">
                <div>
                  <strong>${escapeHtml(file.title)}</strong>
                  <div class="text-sm text-muted">${Math.round((file.size || 0) / 1024)} KB · ${file.mime_type?.split('/')[1] || 'File'}</div>
                </div>
                <a href="/files/${file.id}" class="btn btn-primary btn-sm">Download</a>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  return publicLayout(`${topic.title}`, body);
};
