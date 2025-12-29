import type { Bindings } from '../types';
import { dbAll, dbFirst } from '../utils/db';
import { escapeHtml, publicLayout } from '../templates/layout';

export const renderHome = async (env: Bindings) => {
  const classes = await dbAll<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes ORDER BY id DESC'
  );

  const body = `
    <section class="card">
      <h2>Bangladeshi Class Library</h2>
      <p class="muted">Browse classes, subjects, chapters, and topic notes curated by administrators.</p>
      <div class="grid two">
        ${classes
          .map(
            (item) => `
          <article class="card">
            <h3>${escapeHtml(item.name)}</h3>
            <p class="muted">${escapeHtml(item.level)}</p>
            <p>${escapeHtml(item.description ?? 'No description yet.')}</p>
            <a class="button" href="/class/${item.id}">View subjects</a>
          </article>`
          )
          .join('')}
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
      <h3>Subjects</h3>
      <ul class="list">
        ${subjects
          .map(
            (subject) => `
          <li>
            <strong>${escapeHtml(subject.name)}</strong>
            <p class="muted">${escapeHtml(subject.description ?? 'No description yet.')}</p>
            <a class="button outline" href="/subject/${subject.id}">View chapters</a>
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
      <h3>Chapters</h3>
      <ul class="list">
        ${chapters
          .map(
            (chapter) => `
          <li>
            <strong>${escapeHtml(chapter.name)}</strong>
            <p class="muted">${escapeHtml(chapter.description ?? 'No description yet.')}</p>
            <a class="button outline" href="/chapter/${chapter.id}">View topics</a>
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
      <h3>Topics</h3>
      <ul class="list">
        ${topics
          .map(
            (topic) => `
          <li>
            <strong>${escapeHtml(topic.title)}</strong>
            <p class="muted">${escapeHtml(topic.content ?? 'No summary yet.')}</p>
            <a class="button outline" href="/topic/${topic.id}">Open topic</a>
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
      <h3>Files</h3>
      <ul class="list">
        ${files
          .map(
            (file) => `
          <li>
            <strong>${escapeHtml(file.title)}</strong>
            <p class="muted">${escapeHtml(file.mime_type ?? 'File')} · ${file.size ?? 0} bytes</p>
            <a class="button outline" href="/files/${file.id}">Download</a>
          </li>`
          )
          .join('') || '<li class="muted">No files uploaded yet.</li>'}
      </ul>
    </section>
  `;
  return publicLayout(`${topic.title} files`, body);
};
