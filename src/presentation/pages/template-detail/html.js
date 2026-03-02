export function templateDetailHtml(templateId) {
  return `
    <section class="tpld-page">
      <header class="tpld-head">
        <button id="templateBack" class="tpld-back" type="button">Back to templates</button>
        <div>
          <h2 id="templateTitle">Template #${Number(templateId) || 0}</h2>
          <p id="templateCode">Loading hierarchy...</p>
        </div>
      </header>

      <div class="tpld-table-wrap">
        <table class="tpld-table">
          <thead>
            <tr>
              <th>Hierarchy</th>
              <th>Editable Name</th>
              <th>Image Upload</th>
              <th>Chapter Based</th>
            </tr>
          </thead>
          <tbody id="templateHierarchyRows"></tbody>
        </table>
      </div>

      <p id="templateDetailMsg" class="tpld-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
