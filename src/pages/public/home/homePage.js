import { publicShell } from '../../templates/publicShell.js';
import { siteLogo } from '../../templates/icons.js';
import { imageUrlFromKey } from '../../imageUrl.js';
import { publicHomeStyles } from './homeStyles.js';

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function classCardsMarkup(classes = []) {
  return classes
    .map(
      (item) => `<a class="class-card" href="/classes/${item.id}">
        <div class="class-card-poster-wrap">${item.image_key ? `<img class="class-card-poster" src="${imageUrlFromKey(item.image_key)}" alt="${h(item.name)}" loading="lazy" decoding="async" />` : '<div class="class-card-poster class-card-poster-empty">No image</div>'}</div>
        <p class="class-card-name">${h(item.name)}</p>
        <p class="class-card-meta">Tap to start lessons</p>
      </a>`
    )
    .join('');
}

function subjectCardsMarkup(subjects = []) {
  return subjects
    .map(
      (item) => `<a class="class-card" href="/learn/subjects/${item.id}">
        <div class="class-card-poster-wrap">${item.image_key ? `<img class="class-card-poster" src="${imageUrlFromKey(item.image_key)}" alt="${h(item.name)}" loading="lazy" decoding="async" />` : '<div class="class-card-poster class-card-poster-empty">No image</div>'}</div>
        <p class="class-card-name">${h(item.name)}</p>
        <p class="class-card-meta">${h(item.template_name || 'Subject')}</p>
      </a>`
    )
    .join('');
}

function contentNodeCardsMarkup(subjectId, nodes = [], baseLabel) {
  return nodes
    .map(
      (node) => `<a class="class-card" href="${node.href || `/learn/subjects/${subjectId}/nodes/${node.id}`}">
      <div class="class-card-poster-wrap">${node.image_key ? `<img class="class-card-poster" src="${imageUrlFromKey(node.image_key)}" alt="${h(node.display_name)}" loading="lazy" decoding="async" />` : '<div class="class-card-poster class-card-poster-empty">No image</div>'}</div>
      <p class="class-card-name">${h(node.display_name)}</p>
      <p class="class-card-meta">${h(baseLabel)}</p>
    </a>`
    )
    .join('');
}

const quoteScript = `
(() => {
  const quotes = [
    'Education is the most powerful weapon which you can use to change the world. — Nelson Mandela',
    'The roots of education are bitter, but the fruit is sweet. — Aristotle',
    'An investment in knowledge pays the best interest. — Benjamin Franklin',
    'Live as if you were to die tomorrow. Learn as if you were to live forever. — Mahatma Gandhi'
  ];

  const quoteElement = document.querySelector('[data-education-quote]');
  if (!quoteElement) return;

  let index = 0;
  quoteElement.textContent = quotes[index];
  setInterval(() => {
    index = (index + 1) % quotes.length;
    quoteElement.textContent = quotes[index];
  }, 3600);
})();
`;

export function publicHomePage(user = null, classes = []) {
  return publicShell(
    'home',
    user,
    'Freeducation',
    `<section class="public-home-cover">
      <div class="public-cover-brand-row">
        <span class="public-cover-logo" aria-hidden="true">${siteLogo}</span>
        <h1 class="public-cover-name">freeducation</h1>
      </div>
      <div class="public-cover-quote-wrap">
        <p class="public-cover-quote" data-education-quote></p>
      </div>
    </section>
    <section class="public-class-strip">
      <div class="public-class-strip-head">
        <h2 class="public-class-strip-title">Academic Classes</h2>
        <a class="public-class-see-all" href="/classes">See all</a>
      </div>
      <div class="public-class-row">${classCardsMarkup(classes)}</div>
    </section>`,
    quoteScript,
    publicHomeStyles
  );
}

export function publicClassesPage(user = null, classes = []) {
  return publicShell(
    'classes',
    user,
    'All Classes',
    `<section class="public-class-strip public-class-page">
      <div class="public-class-strip-head">
        <h1 class="public-class-strip-title">All Classes</h1>
      </div>
      <div class="public-class-grid">${classCardsMarkup(classes)}</div>
    </section>`,
    '',
    publicHomeStyles
  );
}

export function publicClassSubjectsPage(user = null, classItem, subjects = []) {
  const rows = subjects
    .map(
      (subject, index) => `<tr>
      <td>${index + 1}</td>
      <td>${h(subject.name)}</td>
      <td>${h(subject.template_name || '-')}</td>
      <td><a class="btn btn-secondary" href="/learn/subjects/${subject.id}">Open subject</a></td>
    </tr>`
    )
    .join('');

  return publicShell(
    'classes',
    user,
    `${classItem.name} Subjects`,
    `<section class="public-class-strip public-class-page">
      <div class="public-class-strip-head"><h1 class="public-class-strip-title">${h(classItem.name)}</h1><a href="/classes" class="public-class-see-all">Back to classes</a></div>
      <div class="public-class-grid">${subjectCardsMarkup(subjects)}</div>
    </section>
    <section class="public-class-strip">
      <div class="table-wrap"><table class="table flat-grid-table public-flat-table"><thead><tr><th>#</th><th>Subject</th><th>Template</th><th>Open</th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="table-empty">No subjects found.</td></tr>'}</tbody></table></div>
    </section>`,
    '',
    publicHomeStyles
  );
}

export function publicSubjectNodesPage(user = null, subject, title, subtitle, nodes = [], backHref = '/classes') {
  return publicShell(
    'classes',
    user,
    title,
    `<section class="public-class-strip public-class-page"><a href="${backHref}" class="public-class-see-all">← Back</a><div class="public-node-heading"><h1 class="public-class-strip-title">${h(title)}</h1><p class="class-card-meta">${h(subtitle)}</p></div><div class="public-class-grid">${contentNodeCardsMarkup(subject.id, nodes, 'Open')}</div></section>`,
    '',
    publicHomeStyles
  );
}

export function publicChapterContentPage(user = null, payload) {
  const { subject, parentNode, chapter, topic, actionNodes = [], notes = [], backHref } = payload;
  const actions = actionNodes
    .map(
      (node) => `<a class="public-big-action" href="/learn/subjects/${subject.id}/content?node=${node.id}&chapter=${chapter?.id || ''}&topic=${topic?.id || ''}">${h(node.display_name)}</a>`
    )
    .join('');
  const notesMarkup = notes
    .map((note, index) => `<article class="public-note-item"><h3>${index + 1}. ${h(note.title || 'Note')}</h3><div>${note.content_html}</div></article>`)
    .join('');

  return publicShell(
    'classes',
    user,
    `${subject.name} Notes`,
    `<section class="public-class-strip public-class-page"><a href="${backHref}" class="public-class-see-all">← Back</a><h1 class="public-class-strip-title">${h(subject.name)} · ${h(parentNode.display_name)}${chapter ? ` · ${h(chapter.name)}` : ''}${topic ? ` · ${h(topic.name)}` : ''}</h1><div class="public-big-actions">${actions || '<p class="class-card-meta">No extra sections.</p>'}</div></section>
    <section class="public-class-strip"><h2 class="public-class-strip-title">Short Notes</h2><div class="public-note-list">${notesMarkup || '<p class="class-card-meta">No notes yet.</p>'}</div></section>`,
    '',
    publicHomeStyles
  );
}

export function publicContentEntriesListPage(user = null, title, entries = [], backHref = '/classes') {
  const entryMarkup = entries
    .map((entry, index) => `<article class="public-note-item"><h3>${index + 1}. ${h(entry.title || 'Entry')}</h3><div>${entry.content_html}</div></article>`)
    .join('');
  return publicShell(
    'classes',
    user,
    title,
    `<section class="public-class-strip public-class-page"><a href="${backHref}" class="public-class-see-all">← Back</a><h1 class="public-class-strip-title">${h(title)}</h1></section>
    <section class="public-class-strip"><div class="public-note-list">${entryMarkup || '<p class="class-card-meta">No content yet.</p>'}</div></section>`,
    '',
    publicHomeStyles
  );
}
