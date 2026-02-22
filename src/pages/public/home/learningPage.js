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
  const resolveOption = (item) => {
    const normalized = String(item?.correct_option || '').trim().toUpperCase();
    if (!normalized) return '';

    const numberMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    if (numberMap[normalized]) return numberMap[normalized];

    const aliasMap = {
      OPTION_A: 'A',
      OPTION_B: 'B',
      OPTION_C: 'C',
      OPTION_D: 'D',
    };
    if (aliasMap[normalized]) return aliasMap[normalized];

    const matched = normalized.match(/\b([ABCD])\b/);
    if (matched) return matched[1];

    const fallbackMatch = normalized.match(/[ABCD]/);
    if (fallbackMatch) return fallbackMatch[0];

    const answerByText = {
      A: String(item?.option_a || '').trim().toLowerCase(),
      B: String(item?.option_b || '').trim().toLowerCase(),
      C: String(item?.option_c || '').trim().toLowerCase(),
      D: String(item?.option_d || '').trim().toLowerCase(),
    };
    const textAnswer = String(item?.correct_option || '').trim().toLowerCase();
    const byExactText = Object.entries(answerByText).find(([, optionText]) => optionText && optionText === textAnswer);
    return byExactText ? byExactText[0] : '';
  };

  const list = mcqs
    .map(
      (item) => `<li class="public-mcq-item" data-correct-option="${resolveOption(item)}">
      <div class="public-note-body">${item.question_html}</div>
      <ul class="public-mcq-options">
        <li data-option="A"><strong>A.</strong> ${h(item.option_a)}</li>
        <li data-option="B"><strong>B.</strong> ${h(item.option_b)}</li>
        <li data-option="C"><strong>C.</strong> ${h(item.option_c)}</li>
        <li data-option="D"><strong>D.</strong> ${h(item.option_d)}</li>
      </ul>
      <div class="public-mcq-answer-row">
        <button class="public-mcq-answer-toggle" type="button" data-answer-toggle>See answer</button>
      </div>
    </li>`
    )
    .join('');

  const mcqScript = `<script>
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-answer-toggle]');
    if (!button) return;

    const container = button.closest('.public-mcq-item');
    if (!container) return;

    const answer = String(container.dataset.correctOption || '').trim().toUpperCase();
    const answerRow = container.querySelector('.public-mcq-answer-row');
    if (!answerRow) return;

    if (answerRow.dataset.revealed === 'true') return;

    if (!answer) {
      answerRow.innerHTML = '<p class="public-mcq-answer-text">Answer unavailable</p>';
      answerRow.dataset.revealed = 'true';
      return;
    }

    container.querySelectorAll('.public-mcq-options li').forEach((option) => {
      option.classList.toggle('public-mcq-option-correct', option.dataset.option === answer);
    });
    answerRow.innerHTML = '<p class="public-mcq-answer-text"><strong>Answer:</strong> ' + answer + '</p>';
    answerRow.dataset.revealed = 'true';
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
