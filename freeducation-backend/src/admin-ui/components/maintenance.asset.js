export function renderMaintenanceCard(result) {
  const summary = result
    ? `Dropped tables: ${result.droppedTables.length} | Created tables: ${result.createdTables.length} | Rebuilt tables: ${result.rebuiltTables.length}`
    : 'Run a schema check to reconcile database tables.';

  const details = result
    ? `<pre style="margin:0; font-size:12px; color:#54605d;">${escapeJson(result)}</pre>`
    : '';

  return `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:16px;">
        <div>
          <h3>Schema maintenance</h3>
          <p>${summary}</p>
        </div>
        <button class="button secondary" data-action="reconcile">Reconcile schema</button>
      </div>
      ${details}
    </div>
  `;
}

function escapeJson(value) {
  return JSON.stringify(value, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
