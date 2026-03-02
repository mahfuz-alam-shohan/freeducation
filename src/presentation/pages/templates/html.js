export function templatesHtml() {
  return `
    <section class="mod-page mod-templates">
      <header class="mod-head">
        <div>
          <h2>Templates</h2>
          <p>Reusable subject skeletons. Select a template to inspect hierarchy rules.</p>
        </div>
      </header>

      <div class="mod-table-wrap">
        <table class="mod-table">
          <thead>
            <tr>
              <th>Template</th>
              <th>Code</th>
              <th>Subjects</th>
            </tr>
          </thead>
          <tbody id="templateRows"></tbody>
        </table>
      </div>

      <p id="templateMsg" class="mod-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
