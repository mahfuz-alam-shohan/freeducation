function buildTree(nodes, map) {
  const roots = [];
  map.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  const sortChildren = (items) => {
    items.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.serverName.localeCompare(b.serverName);
    });
    items.forEach((child) => sortChildren(child.children));
  };

  sortChildren(roots);
  return roots;
}

function renderNodeRow(node, depth, parentName) {
  const typeTag = node.nodeType === 'book'
    ? '<span class="cell-tag good">Book</span>'
    : '<span class="cell-tag">Part</span>';
  const imageTag = node.hasImage ? 'Yes' : 'No';
  const rowClass = ['tree-row', `depth-${depth}`];
  if (node.nodeType === 'book') {
    rowClass.push('module-row-book');
  }

  return `
    <tr class="${rowClass.join(' ')}">
      <td class="tree-cell depth-${depth}"><span class="tree-label" style="--depth:${depth}">${node.serverName}</span></td>
      <td>${parentName || '-'}</td>
      <td>${typeTag}</td>
      <td class="cell-mono">${node.nodeKey}</td>
      <td>${imageTag}</td>
    </tr>
  `;
}

function renderTreeRows(nodes, map, parentName = '', depth = 0) {
  return nodes.map((node) => {
    const row = renderNodeRow(node, depth, parentName);
    const children = node.children && node.children.length > 0
      ? renderTreeRows(node.children, map, node.serverName, depth + 1)
      : '';
    return `${row}${children}`;
  }).join('');
}

export function renderSubjectModuleCurriculum(template, nodes) {
  const nodeMap = new Map();
  (nodes || []).forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  const tree = buildTree(nodes || [], nodeMap);
  const rows = tree.length ? renderTreeRows(tree, nodeMap) : `
    <tr>
      <td class="table-empty" colspan="5">No curriculum nodes defined yet.</td>
    </tr>
  `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${template.name}</h3>
          <p>Curriculum skeleton (server-side names are fixed).</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="#modules/subjects/${template.id}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table tree-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Parent</th>
              <th>Type</th>
              <th>Node Key</th>
              <th>Image</th>
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
