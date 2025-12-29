import type { Bindings } from '../types';
import { dbAll, dbFirst } from '../utils/db';
import { escapeHtml, publicLayout } from '../templates/layout';

export const renderHome = async (env: Bindings) => {
  const classes = await dbAll<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes ORDER BY id DESC'
  );

  const body = `
    <section class="hero">
      <div class="page-header">
        <h1>Freeducation Learning Hub</h1>
        <p class="page-subtitle">Build structured learning paths for students nationwide with clear class, subject, and topic navigation.</p>
      </div>
      <div class="hero-actions">
        <a class="button" href="/admin">Admin console</a>
        <a class="button outline" href="/admin/classes">Manage classes</a>
      </div>
    </section>
    <section class="card">
      <div class="stack">
        <div class="page-header">
          <h2>Bangladeshi Class Library</h2>
          <p class="page-subtitle">Browse classes, subjects, chapters, and topic notes curated by administrators.</p>
        </div>
        <div class="grid three">
          ${classes
            .map(
              (item) => `
          <article class="card compact">
            <div class="stack">
              <div>
                <h3>${escapeHtml(item.name)}</h3>
                <p class="muted meta">${escapeHtml(item.level)}</p>
              </div>
              <p>${escapeHtml(item.description ?? 'No description yet.')}</p>
              <a class="button small" href="/class/${item.id}">View subjects</a>
            </div>
          </article>`
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  return publicLayout('Freeducation LMS', body);
};

export const renderClass = async (env: Bindings, classId: number) => {
  const classRow = await dbFirst<{ name: string; description: string | null; level: string }>(
    env,
    'SELECT name, description, level FROM classes WHERE id = ?',
    classId
  );
  if (!classRow) {
    return publicLayout('Class not found', '<div class="alert">Class not found.</div>');
  }
  const subjects = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM subjects WHERE class_id = ? ORDER BY id DESC',
    classId
  );
  const body = `
    <section class="card">
      <h2>${escapeHtml(classRow.name)}</h2>
      <p class="muted">${escapeHtml(classRow.level)}</p>
      <p>${escapeHtml(classRow.description ?? 'No description yet.')}</p>
    </section>
    <section class="card">
      <div class="page-header">
        <h3>Subjects</h3>
        <p class="page-subtitle">Select a subject to review chapters and materials.</p>
      </div>
      <ul class="list">
        ${subjects
          .map(
            (subject) => `
          <li class="list-item">
            <strong>${escapeHtml(subject.name)}</strong>
            <p class="muted meta">${escapeHtml(subject.description ?? 'No description yet.')}</p>
            <div class="actions">
              <a class="button outline small" href="/subject/${subject.id}">View chapters</a>
            </div>
          </li>`
          )
          .join('')}
      </ul>
    </section>
  `;
  return publicLayout(`${classRow.name} subjects`, body);
};

export const renderSubject = async (env: Bindings, subjectId: number) => {
  const subject = await dbFirst<{ name: string; description: string | null }>(
    env,
    'SELECT name, description FROM subjects WHERE id = ?',
    subjectId
  );
  if (!subject) {
    return publicLayout('Subject not found', '<div class="alert">Subject not found.</div>');
  }
  const chapters = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM chapters WHERE subject_id = ? ORDER BY order_index ASC, id ASC',
    subjectId
  );
  const body = `
    <section class="card">
      <h2>${escapeHtml(subject.name)}</h2>
      <p>${escapeHtml(subject.description ?? 'No description yet.')}</p>
    </section>
    <section class="card">
      <div class="page-header">
        <h3>Chapters</h3>
        <p class="page-subtitle">Follow the ordered chapters to keep learning on track.</p>
      </div>
      <ul class="list">
        ${chapters
          .map(
            (chapter) => `
          <li class="list-item">
            <strong>${escapeHtml(chapter.name)}</strong>
            <p class="muted meta">${escapeHtml(chapter.description ?? 'No description yet.')}</p>
            <div class="actions">
              <a class="button outline small" href="/chapter/${chapter.id}">View topics</a>
            </div>
          </li>`
          )
          .join('')}
      </ul>
    </section>
  `;
  return publicLayout(`${subject.name} chapters`, body);
};

export const renderChapter = async (env: Bindings, chapterId: number) => {
  const chapter = await dbFirst<{ name: string; description: string | null }>(
    env,
    'SELECT name, description FROM chapters WHERE id = ?',
    chapterId
  );
  if (!chapter) {
    return publicLayout('Chapter not found', '<div class="alert">Chapter not found.</div>');
  }
  const topics = await dbAll<{ id: number; title: string; content: string | null }>(
    env,
    'SELECT id, title, content FROM topics WHERE chapter_id = ? ORDER BY order_index ASC, id ASC',
    chapterId
  );
  const body = `
    <section class="card">
      <h2>${escapeHtml(chapter.name)}</h2>
      <p>${escapeHtml(chapter.description ?? 'No description yet.')}</p>
    </section>
    <section class="card">
      <div class="page-header">
        <h3>Topics</h3>
        <p class="page-subtitle">Open a topic to read the lesson summary and resources.</p>
      </div>
      <ul class="list">
        ${topics
          .map(
            (topic) => `
          <li class="list-item">
            <strong>${escapeHtml(topic.title)}</strong>
            <p class="muted meta">${escapeHtml(topic.content ?? 'No summary yet.')}</p>
            <div class="actions">
              <a class="button outline small" href="/topic/${topic.id}">Open topic</a>
            </div>
          </li>`
          )
          .join('')}
      </ul>
    </section>
  `;
  return publicLayout(`${chapter.name} topics`, body);
};

export const renderTopic = async (env: Bindings, topicId: number) => {
  const topic = await dbFirst<{ title: string; content: string | null }>(
    env,
    'SELECT title, content FROM topics WHERE id = ?',
    topicId
  );
  if (!topic) {
    return publicLayout('Topic not found', '<div class="alert">Topic not found.</div>');
  }
  const files = await dbAll<{ id: number; title: string; mime_type: string | null; size: number | null }>(
    env,
    'SELECT id, title, mime_type, size FROM files WHERE topic_id = ? ORDER BY id DESC',
    topicId
  );
  const body = `
    <section class="card">
      <h2>${escapeHtml(topic.title)}</h2>
      <p>${escapeHtml(topic.content ?? 'No content yet.')}</p>
    </section>
    <section class="card">
      <div class="page-header">
        <h3>Files</h3>
        <p class="page-subtitle">Download lesson assets and supporting documents.</p>
      </div>
      <ul class="list">
        ${files
          .map(
            (file) => `
          <li class="list-item">
            <strong>${escapeHtml(file.title)}</strong>
            <p class="muted meta">${escapeHtml(file.mime_type ?? 'File')} · ${file.size ?? 0} bytes</p>
            <div class="actions">
              <a class="button outline small" href="/files/${file.id}">Download</a>
            </div>
          </li>`
          )
          .join('') || '<li class="list-item muted">No files uploaded yet.</li>'}
      </ul>
    </section>
  `;
  return publicLayout(`${topic.title} files`, body);
};
