export function renderSubjectsList(subjects, templates) {
  const templateMap = new Map((templates || []).map((item) => [item.id, item]));
  const rows = (subjects || []).map((subject) => {
    const template = templateMap.get(subject.templateId);
    const templateName = template ? template.name : subject.templateName || 'N/A';
    const status = subject.isActive
      ? '<span class="cell-tag good">Active</span>'
      : '<span class="cell-tag bad">Disabled</span>';

    return `
      <tr>
        <td>${subject.name}</td>
        <td>${templateName}</td>
        <td>${status}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#subjects/${subject.id}">Open</a>
          <button class="button ghost" data-action="subject-edit" data-id="${subject.id}">Edit</button>
          <button class="button ghost" data-action="subject-delete" data-id="${subject.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  const emptyRow = `
    <tr>
      <td class="table-empty" colspan="4">No subjects created yet.</td>
    </tr>
  `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>Subjects</h3>
          <p>Subjects using a subject skeleton.</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="subject-create">New subject</button>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Skeleton</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows || emptyRow}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderSubjectModal(templates, subject) {
  const isEdit = Boolean(subject);
  const title = isEdit ? 'Edit subject' : 'Create subject';
  const nameValue = subject ? subject.name : '';

  const options = (templates || []).map((template) => {
    const selected = subject && subject.templateId === template.id ? 'selected' : '';
    return `<option value="${template.id}" ${selected}>${template.name}</option>`;
  }).join('');

  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>${title}</h2>
            <p>Assign the subject skeleton template.</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="subject-form" data-mode="${isEdit ? 'edit' : 'create'}" data-id="${subject ? subject.id : ''}">
          <div class="form-grid">
            <div class="field">
              <label>Subject name</label>
              <input class="input" name="name" value="${nameValue}" required />
            </div>
            <div class="field">
              <label>Subject skeleton</label>
              <select class="input" name="templateId" ${isEdit ? 'disabled' : ''} required>
                ${options}
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">${isEdit ? 'Save changes' : 'Create subject'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
