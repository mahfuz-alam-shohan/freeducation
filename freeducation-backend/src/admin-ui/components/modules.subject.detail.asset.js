export function renderSubjectModuleOverview(template) {
  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${template.name}</h3>
          <p>Choose what to configure for this subject skeleton.</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="#modules/subjects">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Curriculum</td>
              <td><span class="cell-tag good">Ready</span></td>
              <td class="cell-actions">
                <a class="button secondary" href="#modules/subjects/${template.id}/curriculum">Open</a>
              </td>
            </tr>
            <tr>
              <td>Exam System</td>
              <td><span class="cell-tag">Blank</span></td>
              <td class="cell-actions">
                <a class="button secondary" href="#modules/subjects/${template.id}/exam">Open</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
