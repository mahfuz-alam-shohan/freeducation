import { publicShell } from '../../templates/publicShell.js';
import { imageUrlFromKey } from '../../imageUrl.js';
import { publicHomeStyles } from './homeStyles.js';

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pathBar(items = []) {
  if (!items.length) return '';
  const links = items
    .map((item, index) => {
      const label = h(item.label);
      if (!item.href || index === items.length - 1) return `<span class="public-path-current">${label}</span>`;
      return `<a href="${h(item.href)}">${label}</a>`;
    })
    .join('<span class="public-path-sep" aria-hidden="true">/</span>');
  return `<nav class="public-path-bar" aria-label="Breadcrumb">${links}</nav>`;
}

function cardGrid(items, hrefBuilder) {
  return items
    .map(
      (item) => `<article class="class-card"><a class="public-card-link" href="${h(hrefBuilder(item))}">
        <div class="class-card-poster-wrap">${item.image_key ? `<img class="class-card-poster" src="${imageUrlFromKey(item.image_key)}" alt="${h(item.display_name || item.name)}" loading="lazy" decoding="async" />` : '<div class="class-card-poster class-card-poster-empty">No image</div>'}</div>
        <p class="class-card-name">${h(item.display_name || item.name)}</p>
      </a></article>`
    )
    .join('');
}

export function publicSubjectNodePage(user, subject, title, subtitle, items, hrefBuilder) {
  return publicShell(
    'home',
    user,
    `${subject.name} · ${title}`,
    `${pathBar([{ label: 'Home', href: '/' }, { label: subject.name, href: `/learn/subjects/${subject.id}` }, { label: title }])}<section class="public-stack">
      <h1 class="public-stack-title">${h(title)}</h1>
      <p class="public-stack-subtitle">${h(subtitle)}</p>
      <div class="public-flat-grid">${cardGrid(items, hrefBuilder)}</div>
    </section>`,
    '',
    publicHomeStyles
  );
}

export function publicChapterContentPage(user, subject, node, chapter, shortNotes = [], contentNodes = [], topicId = null) {
  const actions = contentNodes
    .filter((item) => item.content_kind !== 'Short Notes')
    .map(
      (item) => `<a class="public-cta-card" href="/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/content/${encodeURIComponent(item.content_kind || '')}${topicId ? `?topic=${encodeURIComponent(topicId)}` : ''}">${h(item.display_name)}</a>`
    )
    .join('');

  const notes = shortNotes
    .map(
      (entry) => `<li>
      <div class="public-note-body">${entry.content_html}</div>
    </li>`
    )
    .join('');

  return publicShell(
    'home',
    user,
    `${chapter.name} · ${node.display_name}`,
    `${pathBar([{ label: 'Home', href: '/' }, { label: subject.name, href: `/learn/subjects/${subject.id}` }, { label: node.display_name, href: `/learn/subjects/${subject.id}/nodes/${node.id}` }, { label: chapter.name }])}<section class="public-stack">
      <h1 class="public-stack-title">${h(chapter.name)}</h1>
      <p class="public-stack-subtitle">${h(node.display_name)}</p>
      <div class="public-wide-grid">${actions || '<p class="muted">No extra sections yet.</p>'}</div>
      <ol class="public-note-list">${notes || '<li>No short notes yet.</li>'}</ol>
    </section>`,
    '',
    publicHomeStyles
  );
}

export function publicContentEntriesPage(user, subject, chapter, kind, entries = []) {
  const list = entries
    .map(
      (entry, index) => `<li>
      <h3 class="public-note-title">${index + 1}. ${h(entry.title || kind)}</h3>
      <div class="public-note-body">${entry.content_html}</div>
    </li>`
    )
    .join('');

  return publicShell(
    'home',
    user,
    `${chapter.name} · ${kind}`,
    `${pathBar([{ label: 'Home', href: '/' }, { label: subject.name, href: `/learn/subjects/${subject.id}` }, { label: chapter.name }, { label: kind }])}<section class="public-stack">
      <h1 class="public-stack-title">${h(kind)}</h1>
      <p class="public-stack-subtitle">${h(subject.name)} · ${h(chapter.name)}</p>
      <ol class="public-note-list">${list || '<li>No content yet.</li>'}</ol>
    </section>`,
    '',
    publicHomeStyles
  );
}

export function publicMcqEntriesPage(user, subject, chapter, mcqs = []) {
  const list = mcqs
    .map(
      (item) => `<li class="public-mcq-item" data-correct-option="${h(item.correct_option)}">
      <div class="public-mcq-head">
        <button class="public-mcq-answer-toggle" type="button" data-answer-toggle>See answer</button>
      </div>
      <div class="public-note-body">${item.question_html}</div>
      <ul class="public-mcq-options">
        <li data-option="A"><strong>A.</strong> ${h(item.option_a)}</li>
        <li data-option="B"><strong>B.</strong> ${h(item.option_b)}</li>
        <li data-option="C"><strong>C.</strong> ${h(item.option_c)}</li>
        <li data-option="D"><strong>D.</strong> ${h(item.option_d)}</li>
      </ul>
    </li>`
    )
    .join('');

  const mcqScript = `<script>
  document.querySelectorAll('[data-answer-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const container = button.closest('.public-mcq-item');
      if (!container) return;
      const answer = String(container.dataset.correctOption || '').toUpperCase();
      const isVisible = container.classList.toggle('show-answer');
      container.querySelectorAll('.public-mcq-options li').forEach((option) => {
        option.classList.toggle('public-mcq-option-correct', isVisible && option.dataset.option === answer);
      });
      button.textContent = isVisible ? 'Hide answer' : 'See answer';
    });
  });
  </script>`;

  return publicShell(
    'home',
    user,
    `${chapter.name} · MCQ Bank`,
    `${pathBar([{ label: 'Home', href: '/' }, { label: subject.name, href: `/learn/subjects/${subject.id}` }, { label: chapter.name }, { label: 'MCQ Bank' }])}<section class="public-stack">
      <h1 class="public-stack-title">MCQ Bank</h1>
      <p class="public-stack-subtitle">${h(subject.name)} · ${h(chapter.name)}</p>
      <ol class="public-note-list">${list || '<li>No MCQs yet.</li>'}</ol>
    </section>`,
    mcqScript,
    publicHomeStyles
  );
}
