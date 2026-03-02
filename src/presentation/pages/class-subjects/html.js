export function classSubjectsHtml() {
  return `
    <section class="cls-sub-page" data-class-subjects-root="1">
      <header class="cls-sub-head">
        <a class="cls-sub-back" href="/admin/classes">Back to classes</a>
        <div>
          <h2 id="classSubjectsTitle">Class Subjects</h2>
          <p id="classSubjectsSubtitle">Loading subjects...</p>
        </div>
      </header>

      <div class="cls-sub-table-wrap">
        <table class="cls-sub-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Template</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody id="classSubjectsRows"></tbody>
        </table>
      </div>

      <p id="classSubjectsMsg" class="cls-sub-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}

