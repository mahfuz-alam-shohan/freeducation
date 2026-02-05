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

function renderChildRow(subject, node, mediaUrl) {
  const displayName = node.displayName || node.serverName || '';
  const imageCell = renderImageCell(node.imageKey ? mediaUrl(node.imageKey) : '');
  const isChapters = node.nodeKey.endsWith('_CHAPTERS') || node.serverName === 'Chapters';
  const openHref = isChapters
    ? `#subjects/${subject.id}/chapters/${node.id}`
    : `#subjects/${subject.id}/node/${node.id}`;
  const actions = [
    `<a class="button secondary" href="${openHref}">Open</a>`,
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

export function renderSubjectNode(subject, node, parent, children, mediaUrl) {
  const nodeTitle = node.displayName || node.serverName || '';
  const rows = children && children.length
    ? sortNodes(children).map((child) => renderChildRow(subject, child, mediaUrl)).join('')
    : `
      <tr>
        <td class="table-empty" colspan="3">No sub-items available.</td>
      </tr>
    `;

  const backHref = parent ? `#subjects/${subject.id}/node/${parent.id}` : `#subjects/${subject.id}`;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${subject.name}</h3>
          <p>${nodeTitle} (configure this level, then continue).</p>
        </div>
        <div class="table-actions">
          <button class="button secondary" data-action="node-edit" data-id="${node.id}">Edit ${nodeTitle}</button>
          <a class="button ghost" href="${backHref}">Back</a>
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
