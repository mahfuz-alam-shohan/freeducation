import { DEFAULT_SECTION_LABELS } from './constants.js';

export function renderQuestionForm(config) {
  const {
    subject,
    node,
    chapter,
    topic,
    safeLabels,
    typeKey,
    sectionKey,
    mode,
    question,
    backHref
  } = config;
  const nodeName = node.displayName || node.serverName || '';
  const isEdit = mode === 'edit';
  const typeTitle = typeKey === 'MCQ'
    ? safeLabels.types.MCQ
    : (safeLabels.sections[sectionKey] || DEFAULT_SECTION_LABELS[sectionKey] || sectionKey);
  const title = isEdit ? `Edit ${typeTitle}` : `Add ${typeTitle}`;
  const questionValue = question ? question.questionText : '';
  const answerValue = question ? question.answerText : '';
  const formId = question ? question.id : '';

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${topic.name} - ${title}</h3>
          <p>${subject.name} > ${nodeName} > ${chapter.name}</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="${backHref}">Cancel</a>
        </div>
      </div>
      <form class="table-body question-form" data-form="question-page" data-owner="topic" data-owner-id="${topic.id}" data-mode="${mode}" data-type="${typeKey}" data-section="${sectionKey || ''}" data-id="${formId}" data-back-href="${backHref}">
        <div class="form-grid">
          <div class="field">
            <label>Question</label>
            <textarea class="input textarea" name="question" rows="6" required>${questionValue}</textarea>
          </div>
          <div class="field">
            <label>Answer</label>
            <textarea class="input textarea" name="answer" rows="6" required>${answerValue}</textarea>
          </div>
          <div class="field">
            <label>Attachment (optional)</label>
            <input class="input" type="file" name="attachment" />
          </div>
          <div class="field">
            <label>Insert upload into</label>
            <select class="input" name="attachmentTarget">
              <option value="answer" selected>Answer</option>
              <option value="question">Question</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="button secondary" type="submit">${isEdit ? 'Save changes' : 'Create question'}</button>
        </div>
      </form>
    </div>
  `;
}

export function renderMcqForm(config) {
  const {
    subject,
    node,
    chapter,
    topic,
    safeLabels,
    mode,
    question,
    backHref,
    mediaUrl
  } = config;
  const nodeName = node.displayName || node.serverName || '';
  const isEdit = mode === 'edit';
  const title = isEdit ? `Edit ${safeLabels.types.MCQ}` : `Add ${safeLabels.types.MCQ}`;
  const questionValue = question ? question.questionText : '';
  const formId = question ? question.id : '';
  const options = question && question.options ? question.options : ['', '', '', ''];
  const correctOption = question && question.correctOption ? String(question.correctOption) : '';
  const imageUrl = question && question.imageKey && mediaUrl ? mediaUrl(question.imageKey) : '';
  const imagePreview = imageUrl
    ? `<div class="mcq-preview"><img class="media-thumb" src="${imageUrl}" alt="Question image" /></div>`
    : '';

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${topic.name} - ${title}</h3>
          <p>${subject.name} > ${nodeName} > ${chapter.name}</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="${backHref}">Cancel</a>
        </div>
      </div>
      <form class="table-body question-form mcq-form" data-form="question-page" data-owner="topic" data-owner-id="${topic.id}" data-mode="${mode}" data-type="MCQ" data-id="${formId}" data-back-href="${backHref}">
        <div class="form-grid">
          <div class="field">
            <label>Question</label>
            <textarea class="input textarea" name="question" rows="4" required>${questionValue}</textarea>
          </div>
          <div class="field">
            <label>Question image (optional)</label>
            <input class="input" type="file" name="image" accept="image/*" />
            ${imagePreview}
          </div>
        </div>
        <div class="mcq-options">
          ${['A', 'B', 'C', 'D'].map((label, index) => `
            <div class="mcq-option">
              <div class="mcq-option-label">Option ${label}</div>
              <input class="input" name="option${label}" value="${options[index] || ''}" required />
              <label class="mcq-correct">
                <input type="radio" name="correctOption" value="${label}" ${correctOption === label ? 'checked' : ''} />
                Correct
              </label>
            </div>
          `).join('')}
        </div>
        <div class="modal-actions">
          <button class="button secondary" type="submit">${isEdit ? 'Save changes' : 'Create MCQ'}</button>
        </div>
      </form>
    </div>
  `;
}
