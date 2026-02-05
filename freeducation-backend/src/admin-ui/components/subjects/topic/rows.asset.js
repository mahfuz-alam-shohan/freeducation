import { DEFAULT_SECTION_LABELS } from './constants.js';

export function renderImageCell(imageUrl) {
  if (!imageUrl) return '<span class="muted">None</span>';
  return `<img class="media-thumb" src="${imageUrl}" alt="Image" />`;
}

export function renderNotesRows(notes, mediaUrl) {
  if (!notes || notes.length === 0) {
    return `
      <tr>
        <td class="table-empty" colspan="3">No short notes added yet.</td>
      </tr>
    `;
  }

  return notes.map((note) => {
    const imageCell = renderImageCell(note.imageKey ? mediaUrl(note.imageKey) : '');
    return `
      <tr>
        <td class="cell-wrap">${note.note}</td>
        <td>${imageCell}</td>
        <td class="cell-actions">
          <button class="button ghost" data-action="topic-note-delete" data-id="${note.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderVideoSource(video, mediaUrl) {
  if (video.mode === 'link') {
    return video.url ? `<a class="cell-mono" href="${video.url}" target="_blank" rel="noopener">${video.url}</a>` : '<span class="muted">No link</span>';
  }
  if (!video.fileKey) return '<span class="muted">No file</span>';
  const url = mediaUrl(video.fileKey);
  return `<a class="cell-mono" href="${url}" target="_blank" rel="noopener">${video.fileKey}</a>`;
}

export function renderVideoRows(videos, mediaUrl) {
  if (!videos || videos.length === 0) {
    return `
      <tr>
        <td class="table-empty" colspan="5">No videos added yet.</td>
      </tr>
    `;
  }

  return videos.map((video) => {
    const modeTag = video.mode === 'link'
      ? '<span class="cell-tag">Link</span>'
      : '<span class="cell-tag good">Upload</span>';
    return `
      <tr>
        <td>${video.title}</td>
        <td>${modeTag}</td>
        <td class="cell-wrap">${renderVideoSource(video, mediaUrl)}</td>
        <td>${video.author || '<span class="muted">-</span>'}</td>
        <td class="cell-actions">
          <button class="button ghost" data-action="topic-video-delete" data-id="${video.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderQuestionRows(questions, labels, typeKey, options = {}) {
  if (!questions || questions.length === 0) {
    return `
      <tr>
        <td class="table-empty" colspan="${options.showSection === false ? 3 : 4}">No questions added yet.</td>
      </tr>
    `;
  }

  const safeLabels = labels || { sections: DEFAULT_SECTION_LABELS };
  const showSection = options.showSection !== false;
  const deleteAction = options.deleteAction || 'topic-question-delete';

  return questions.map((item) => {
    let sectionCell = '';
    if (showSection) {
      const sectionLabel = item.sectionKey
        ? (safeLabels.sections[item.sectionKey] || DEFAULT_SECTION_LABELS[item.sectionKey] || '-')
        : '-';
      sectionCell = typeKey === 'CQ'
        ? `<span class="cell-tag">${sectionLabel}</span>`
        : '<span class="muted">-</span>';
    }

    const editControl = options.editHref
      ? `<a class="button ghost" href="${options.editHref(item)}">Edit</a>`
      : '';

    return `
      <tr>
        ${showSection ? `<td>${sectionCell}</td>` : ''}
        <td class="cell-wrap">${item.questionText}</td>
        <td class="cell-wrap">${item.answerText}</td>
        <td class="cell-actions">
          ${editControl}
          <button class="button ghost" data-action="${deleteAction}" data-id="${item.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderMcqRows(questions, mediaUrl, options = {}) {
  if (!questions || questions.length === 0) {
    return `
      <tr>
        <td class="table-empty" colspan="4">No MCQ questions added yet.</td>
      </tr>
    `;
  }

  const deleteAction = options.deleteAction || 'topic-question-delete';

  return questions.map((item) => {
    const optionsList = Array.isArray(item.options) ? item.options : [];
    const correct = item.correctOption || '-';
    const optionMarkup = ['A', 'B', 'C', 'D'].map((label, index) => {
      const text = optionsList[index] || '-';
      const tagClass = correct === label ? 'cell-tag good' : 'cell-tag';
      return `<div class="option-line"><span class="${tagClass}">${label}</span><span class="cell-wrap">${text}</span></div>`;
    }).join('');
    const imageUrl = item.imageKey && mediaUrl ? mediaUrl(item.imageKey) : '';
    const imageCell = imageUrl ? renderImageCell(imageUrl) : '<span class="muted">None</span>';
    const editControl = options.editHref
      ? `<a class="button ghost" href="${options.editHref(item)}">Edit</a>`
      : '';

    return `
      <tr>
        <td>
          <div class="table-title">${item.questionText}</div>
          <div class="table-sub">${imageCell}</div>
        </td>
        <td class="cell-wrap"><div class="option-list">${optionMarkup}</div></td>
        <td><span class="cell-tag good">${correct}</span></td>
        <td class="cell-actions">
          ${editControl}
          <button class="button ghost" data-action="${deleteAction}" data-id="${item.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}
