function renderImageCell(imageUrl) {
  if (!imageUrl) return '<span class="muted">None</span>';
  return `<img class="media-thumb" src="${imageUrl}" alt="Image" />`;
}

function sortNodes(nodes) {
  return [...nodes].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    const aName = a.displayName || a.serverName || '';
    const bName = b.displayName || b.serverName || '';
    return aName.localeCompare(bName);
  });
}

function renderNodeRow(subject, node, mediaUrl) {
  const displayName = node.displayName || node.serverName || '';
  const imageCell = renderImageCell(node.imageKey ? mediaUrl(node.imageKey) : '');
  const actions = [
    `<a class="button secondary" href="#subjects/${subject.id}/node/${node.id}">Open</a>`,
    `<button class="button ghost" data-action="node-edit" data-id="${node.id}">Edit</button>`
  ];

  return `
    <tr>
      <td>${displayName}</td>
      <td>${imageCell}</td>
      <td class="cell-actions">${actions.join('')}</td>
    </tr>
  `;
}

export function renderSubjectDetail(subject, nodes, mediaUrl) {
  const roots = sortNodes((nodes || []).filter((node) => !node.parentId));
  const rows = roots.length
    ? roots.map((node) => renderNodeRow(subject, node, mediaUrl)).join('')
    : `
      <tr>
        <td class="table-empty" colspan="3">No sections available.</td>
      </tr>
    `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${subject.name}</h3>
          <p>Configure names and images for each level.</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="#subjects">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
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

export function renderNodeModal(node) {
  const nameValue = node.displayName || node.serverName || '';
  const imageValue = node.imageKey || '';
  const titleName = node.displayName || node.serverName || 'Section';

  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>Update ${titleName}</h2>
            <p>Set the display name and image for this section.</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="node-form" data-node-id="${node.id}">
          <div class="form-grid">
            <div class="field">
              <label>Display name</label>
              <input class="input" name="displayName" value="${nameValue}" placeholder="Display name" />
            </div>
            <div class="field">
              <label>Image</label>
              <input class="input" name="imageKey" value="${imageValue}" placeholder="Uploaded image key" readonly />
              <input class="input" type="file" name="imageFile" accept="image/*" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="node-clear-image">Clear image</button>
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
