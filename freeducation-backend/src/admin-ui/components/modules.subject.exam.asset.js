export function renderSubjectModuleExam(template) {
  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${template.name}</h3>
          <p>Exam system setup will be added here later.</p>
        </div>
        <div class="table-actions">
          <a class="button ghost" href="#modules/subjects/${template.id}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Exam System</td>
              <td><span class="cell-tag warn">Pending</span></td>
              <td class="cell-wrap">No exam configuration has been added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
