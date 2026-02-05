export function renderSubjectModules(templates) {
  const rows = templates.map((template) => {
    const status = template.isActive
      ? '<span class="cell-tag good">Active</span>'
      : '<span class="cell-tag bad">Disabled</span>';

    return `
      <tr>
        <td>${template.name}</td>
        <td class="cell-mono">${template.code}</td>
        <td>${template.nodeCount}</td>
        <td>${status}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#modules/subjects/${template.id}">Open</a>
        </td>
      </tr>
    `;
  }).join('');

  const emptyRow = `
    <tr>
      <td class="table-empty" colspan="5">No subject skeletons created yet.</td>
    </tr>
  `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>Subject Skeletons</h3>
          <p>Templates that define subject curriculum structure.</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="#modules">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Code</th>
              <th>Nodes</th>
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
