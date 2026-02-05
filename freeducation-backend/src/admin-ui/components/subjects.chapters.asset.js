function renderImageCell(imageUrl) {
  if (!imageUrl) return '<span class="muted">None</span>';
  return `<img class="media-thumb" src="${imageUrl}" alt="Image" />`;
}

export function renderSubjectChapters(subject, node, chapters, mediaUrl, parent) {
  const nodeName = node.displayName || node.serverName || '';
  const rows = (chapters || []).map((chapter) => {
    const imageCell = renderImageCell(chapter.imageKey ? mediaUrl(chapter.imageKey) : '');
    return `
      <tr>
        <td>${chapter.name}</td>
        <td>${imageCell}</td>
        <td class="cell-mono">${chapter.sortOrder}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}">Open</a>
          <button class="button ghost" data-action="chapter-edit" data-id="${chapter.id}">Edit</button>
          <button class="button ghost" data-action="chapter-delete" data-id="${chapter.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  const emptyRow = `
    <tr>
      <td class="table-empty" colspan="4">No chapters created yet.</td>
    </tr>
  `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${subject.name}</h3>
          <p>${nodeName} chapters.</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="chapter-create">New chapter</button>
          <a class="button ghost" href="${parent ? `#subjects/${subject.id}/node/${parent.id}` : `#subjects/${subject.id}`}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Chapter</th>
              <th>Image</th>
              <th>Order</th>
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

export function renderChapterModal(node, chapter) {
  const isEdit = Boolean(chapter);
  const title = isEdit ? 'Edit chapter' : 'Create chapter';
  const nameValue = chapter ? chapter.name : '';
  const imageValue = chapter ? chapter.imageKey || '' : '';
  const nodeName = node.displayName || node.serverName || '';

  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>${title}</h2>
            <p>${nodeName} chapter details.</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="chapter-form" data-mode="${isEdit ? 'edit' : 'create'}" data-id="${chapter ? chapter.id : ''}" data-node-id="${node.id}">
          <div class="form-grid">
            <div class="field">
              <label>Chapter name</label>
              <input class="input" name="name" value="${nameValue}" required />
            </div>
            <div class="field">
              <label>Image</label>
              <input class="input" name="imageKey" value="${imageValue}" placeholder="Uploaded image key" readonly />
              <input class="input" type="file" name="imageFile" accept="image/*" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="chapter-clear-image">Clear image</button>
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">${isEdit ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
