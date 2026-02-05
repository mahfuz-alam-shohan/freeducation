import { DEFAULT_SECTION_LABELS, DEFAULT_TYPE_LABELS } from './constants.js';
import { renderQuestionRows } from './rows.js';
import { renderQuestionForm } from './forms.js';

export function renderQuestionBankOverview(detail) {
  const { chapter, subject, node, labels, questions } = detail;
  const nodeName = node.displayName || node.serverName || '';
  const safeLabels = {
    types: { ...DEFAULT_TYPE_LABELS, ...(labels ? labels.types : {}) },
    sections: { ...DEFAULT_SECTION_LABELS, ...(labels ? labels.sections : {}) }
  };
  const cqQuestions = (questions || []).filter((item) => item.typeKey === 'CQ');
  const mcqQuestions = (questions || []).filter((item) => item.typeKey === 'MCQ');
  const rows = [
    {
      key: 'type-CQ',
      title: safeLabels.types.CQ,
      description: 'CQ question groups.',
      count: cqQuestions.length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions/cq`
    },
    {
      key: 'type-MCQ',
      title: safeLabels.types.MCQ,
      description: 'MCQ questions for this chapter.',
      count: mcqQuestions.length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions/mcq`
    }
  ].map((item) => `
      <tr>
        <td><input class="input" data-label="${item.key}" value="${item.title}" /></td>
        <td>${item.description}</td>
        <td class="cell-mono">${item.count}</td>
        <td class="cell-actions">
          <a class="button secondary" href="${item.href}">Open</a>
          <button class="button ghost" data-action="labels-save">Save title</button>
        </td>
      </tr>
    `).join('');

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name} - Question Bank</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderQuestionCQOverview(detail) {
  const { chapter, subject, node, labels, questions } = detail;
  const nodeName = node.displayName || node.serverName || '';
  const safeLabels = {
    types: { ...DEFAULT_TYPE_LABELS, ...(labels ? labels.types : {}) },
    sections: { ...DEFAULT_SECTION_LABELS, ...(labels ? labels.sections : {}) }
  };
  const sectionKeys = Array.isArray(detail.sectionKeys) && detail.sectionKeys.length
    ? detail.sectionKeys
    : ['KNOWLEDGE', 'TWO', 'THREE', 'FOUR'];
  const rows = sectionKeys.map((key) => {
    const title = safeLabels.sections[key] || DEFAULT_SECTION_LABELS[key] || key;
    const count = (questions || []).filter((item) => item.typeKey === 'CQ' && item.sectionKey === key).length;
    return `
      <tr>
        <td><input class="input" data-label="section-${key}" value="${title}" /></td>
        <td class="cell-mono">${count}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions/cq/${key}">Open</a>
          <button class="button ghost" data-action="labels-save">Save title</button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name} - ${safeLabels.types.CQ}</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderQuestionCQSection(detail, sectionKey, formState = null) {
  const { chapter, subject, node, labels, questions } = detail;
  const nodeName = node.displayName || node.serverName || '';
  const normalizedKey = sectionKey ? sectionKey.toUpperCase() : '';
  const safeLabels = {
    types: { ...DEFAULT_TYPE_LABELS, ...(labels ? labels.types : {}) },
    sections: { ...DEFAULT_SECTION_LABELS, ...(labels ? labels.sections : {}) }
  };
  const sectionTitle = safeLabels.sections[normalizedKey] || DEFAULT_SECTION_LABELS[normalizedKey] || normalizedKey;
  const cqQuestions = (questions || []).filter((item) => item.typeKey === 'CQ' && item.sectionKey === normalizedKey);
  const baseHref = `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions/cq/${normalizedKey}`;
  const addHref = `${baseHref}/new`;
  const formMarkup = formState
    ? renderQuestionForm({
      subject,
      node,
      chapter,
      safeLabels,
      typeKey: 'CQ',
      sectionKey: normalizedKey,
      mode: formState.mode,
      question: formState.question,
      backHref: baseHref
    })
    : '';

  return `
    ${formMarkup}
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name} - ${sectionTitle}</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <a class="button" href="${addHref}">Add ${sectionTitle}</a>
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions/cq">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderQuestionRows(cqQuestions, safeLabels, 'CQ', { showSection: false, editHref: (item) => `${baseHref}/edit/${item.id}` })}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderQuestionMCQ(detail, formState = null) {
  const { chapter, subject, node, labels, questions } = detail;
  const nodeName = node.displayName || node.serverName || '';
  const safeLabels = {
    types: { ...DEFAULT_TYPE_LABELS, ...(labels ? labels.types : {}) },
    sections: { ...DEFAULT_SECTION_LABELS, ...(labels ? labels.sections : {}) }
  };
  const mcqQuestions = (questions || []).filter((item) => item.typeKey === 'MCQ');
  const baseHref = `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions/mcq`;
  const addHref = `${baseHref}/new`;
  const formMarkup = formState
    ? renderQuestionForm({
      subject,
      node,
      chapter,
      safeLabels,
      typeKey: 'MCQ',
      sectionKey: '',
      mode: formState.mode,
      question: formState.question,
      backHref: baseHref
    })
    : '';

  return `
    ${formMarkup}
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name} - ${safeLabels.types.MCQ}</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <a class="button" href="${addHref}">Add ${safeLabels.types.MCQ}</a>
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderQuestionRows(mcqQuestions, safeLabels, 'MCQ', { showSection: false, editHref: (item) => `${baseHref}/edit/${item.id}` })}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
