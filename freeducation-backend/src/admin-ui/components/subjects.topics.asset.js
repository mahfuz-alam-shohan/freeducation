function renderImageCell(imageUrl) {
  if (!imageUrl) return '<span class="muted">None</span>';
  return `<img class="media-thumb" src="${imageUrl}" alt="Image" />`;
}

export function renderSubjectTopics(subject, node, chapter, topics, mediaUrl, backHref) {
  const nodeName = node.displayName || node.serverName || '';
  const rows = (topics || []).map((topic) => {
    const imageCell = renderImageCell(topic.imageKey ? mediaUrl(topic.imageKey) : '');
    return `
      <tr>
        <td>${topic.name}</td>
        <td>${imageCell}</td>
        <td class="cell-mono">${topic.sortOrder}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics/${topic.id}">Open</a>
          <button class="button ghost" data-action="topic-edit" data-id="${topic.id}">Edit</button>
          <button class="button ghost" data-action="topic-delete" data-id="${topic.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  const emptyRow = `
    <tr>
      <td class="table-empty" colspan="4">No topics created yet.</td>
    </tr>
  `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name}</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="topic-create">New topic</button>
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="${backHref}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Topic</th>
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

export function renderTopicModal(chapter, topic) {
  const isEdit = Boolean(topic);
  const title = isEdit ? 'Edit topic' : 'Create topic';
  const nameValue = topic ? topic.name : '';
  const imageValue = topic ? topic.imageKey || '' : '';

  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>${title}</h2>
            <p>${chapter.name} topic details.</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="topic-form" data-mode="${isEdit ? 'edit' : 'create'}" data-id="${topic ? topic.id : ''}" data-chapter-id="${chapter.id}">
          <div class="form-grid">
            <div class="field">
              <label>Topic name</label>
              <input class="input" name="name" value="${nameValue}" required />
            </div>
            <div class="field">
              <label>Image</label>
              <input class="input" name="imageKey" value="${imageValue}" placeholder="Uploaded image key" readonly />
              <input class="input" type="file" name="imageFile" accept="image/*" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="topic-clear-image">Clear image</button>
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">${isEdit ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
