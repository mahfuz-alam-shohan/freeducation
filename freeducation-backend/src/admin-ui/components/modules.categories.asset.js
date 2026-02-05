export function renderModuleCategories(categories) {
  const subjectRow = `
      <tr>
        <td>Subjects</td>
        <td class="cell-wrap">Author subject content using skeleton templates.</td>
        <td>&mdash;</td>
        <td class="cell-actions">
          <a class="button secondary" href="#subjects">Manage</a>
        </td>
      </tr>
    `;

  const rows = (categories || []).map((category) => {
    const action = category.key === 'subjects'
      ? `<a class="button secondary" href="#modules/subjects">Manage</a>`
      : `<button class="button ghost" type="button" disabled>Locked</button>`;

    return `
      <tr>
        <td>${category.name}</td>
        <td class="cell-wrap">${category.description || '&mdash;'}</td>
        <td>${category.templateCount}</td>
        <td class="cell-actions">${action}</td>
      </tr>
    `;
  }).join('');

  const emptyRow = `
    <tr>
      <td class="table-empty" colspan="4">No module categories available.</td>
    </tr>
  `;

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>Modules</h3>
          <p>Manage subject authoring and skeleton templates.</p>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Description</th>
              <th>Templates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRow}
            ${rows || emptyRow}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
