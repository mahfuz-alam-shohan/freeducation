import { DEFAULT_SECTION_LABELS, DEFAULT_TYPE_LABELS } from './constants.js';

export function renderNoteModal() {
  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>Add note</h2>
            <p>Single line short note with optional image.</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="note-form">
          <div class="form-grid">
            <div class="field">
              <label>Note</label>
              <input class="input" name="note" required />
            </div>
            <div class="field">
              <label>Image</label>
              <input class="input" name="imageKey" placeholder="Uploaded image key" readonly />
              <input class="input" type="file" name="imageFile" accept="image/*" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="note-clear-image">Clear image</button>
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">Add note</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderVideoModal() {
  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>Add video</h2>
            <p>Upload a video or store an external link.</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="video-form">
          <div class="form-grid">
            <div class="field">
              <label>Mode</label>
              <select class="input" name="mode">
                <option value="link">Link</option>
                <option value="upload">Upload</option>
              </select>
            </div>
            <div class="field">
              <label>Title</label>
              <input class="input" name="title" required />
            </div>
            <div class="field" data-video-field="url">
              <label>Video link</label>
              <input class="input" name="url" placeholder="https://" />
            </div>
            <div class="field" data-video-field="author">
              <label>Author</label>
              <input class="input" name="author" />
            </div>
            <div class="field" data-video-field="file" style="display:none;">
              <label>Upload file</label>
              <input class="input" type="file" name="file" accept="video/*" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">Add video</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderQuestionModal(labels, question, presetType, presetSection = '') {
  const safeLabels = {
    types: { ...DEFAULT_TYPE_LABELS, ...(labels ? labels.types : {}) },
    sections: { ...DEFAULT_SECTION_LABELS, ...(labels ? labels.sections : {}) }
  };
  const isEdit = Boolean(question);
  const typeValue = question ? question.typeKey : (presetType || 'CQ');
  const sectionValue = question ? question.sectionKey || '' : (presetSection || '');
  const questionText = question ? question.questionText : '';
  const answerText = question ? question.answerText : '';
  const lockType = Boolean(presetType);
  const lockSection = Boolean(presetSection);

  const sectionOptions = [
    { key: 'KNOWLEDGE', label: safeLabels.sections.KNOWLEDGE || 'Knowledge' },
    { key: 'TWO', label: safeLabels.sections.TWO || 'Understanding' },
    { key: 'THREE', label: safeLabels.sections.THREE || 'Application' },
    { key: 'FOUR', label: safeLabels.sections.FOUR || 'HOTS' }
  ].map((item) => {
    const selected = item.key === sectionValue ? 'selected' : '';
    return `<option value="${item.key}" ${selected}>${item.label}</option>`;
  }).join('');

  return `
    <div class="modal" data-modal>
      <div class="modal-card modal-wide">
        <div class="modal-header">
          <div>
            <h2>${isEdit ? 'Edit question' : 'Add question'}</h2>
            <p>${isEdit ? 'Update the question text and answer.' : 'Create a new question entry.'}</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="question-form" data-id="${question ? question.id : ''}" data-mode="${isEdit ? 'edit' : 'create'}">
          <div class="form-grid">
            <div class="field">
              <label>Type</label>
              <select class="input" name="type" ${(isEdit || lockType) ? 'disabled' : ''}>
                <option value="CQ" ${typeValue === 'CQ' ? 'selected' : ''}>${safeLabels.types.CQ}</option>
                <option value="MCQ" ${typeValue === 'MCQ' ? 'selected' : ''}>${safeLabels.types.MCQ}</option>
              </select>
            </div>
            <div class="field" data-question-field="section">
              <label>Section (CQ)</label>
              <select class="input" name="section" ${lockSection ? 'disabled' : ''}>
                ${sectionOptions}
              </select>
            </div>
            <div class="field">
              <label>Question</label>
              <textarea class="input textarea" name="question" required>${questionText}</textarea>
            </div>
            <div class="field">
              <label>Answer</label>
              <textarea class="input textarea" name="answer" required>${answerText}</textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">${isEdit ? 'Save changes' : 'Add question'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
