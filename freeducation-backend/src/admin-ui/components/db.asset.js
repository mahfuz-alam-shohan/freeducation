export function renderDatabasePanel(state) {
  const tables = state.tables || [];
  const selected = state.selectedTable;
  const columns = state.tableColumns || [];
  const rows = state.tableRows || [];
  const primaryKey = state.tablePrimaryKey;

  const tableButtons = tables.length
    ? tables.map((name) => {
        const active = name === selected ? 'active' : '';
        return `<button class="db-item ${active}" data-action="db-select" data-table="${name}">${name}</button>`;
      }).join('')
    : '<p class="db-empty">No tables found.</p>';

  const headers = columns.map((column) => `<th>${column.name}</th>`).join('');
  const actionHeader = primaryKey ? '<th>Actions</th>' : '';

  const rowsMarkup = rows.map((row) => {
    const cells = columns.map((column) => {
      const value = row[column.name];
      return `<td>${formatCell(value)}</td>`;
    }).join('');

    const actionCell = primaryKey
      ? `<td><button class="button ghost" data-action="db-delete-row" data-pk="${row[primaryKey]}">Delete</button></td>`
      : '';

    return `<tr>${cells}${actionCell}</tr>`;
  }).join('');

  const emptyTable = selected && rows.length === 0
    ? '<div class="db-empty">No rows found for this table.</div>'
    : '';

  const toolbar = selected
    ? `
      <div class="db-toolbar">
        <div>
          <h3>${selected}</h3>
          <p>${state.tableTotal} rows</p>
        </div>
        <div class="db-actions">
          <button class="button ghost" data-action="db-reload">Reload</button>
          <button class="button secondary" data-action="db-truncate" title="Clear all rows">Format table</button>
          <button class="button danger" data-action="db-drop">Delete table</button>
        </div>
      </div>
    `
    : '<div class="db-empty">Select a table to view data.</div>';

  const reconcileStatus = state.maintenance
    ? `<div class="db-meta">Last reconcile: ${summary(state.maintenance)}</div>`
    : '';

  return `
    <div class="db-page">
      <div class="db-sidebar">
        <div class="db-sidebar-header">
          <div>
            <h3>Database</h3>
            <p>Tables</p>
          </div>
          <button class="button ghost" data-action="db-refresh">Refresh</button>
        </div>
        <div class="db-list">${tableButtons}</div>
        <button class="button secondary" data-action="db-reconcile">Reconcile schema</button>
        ${reconcileStatus}
      </div>
      <div class="db-content">
        ${toolbar}
        ${selected ? `
          <div class="table-scroll">
            <table class="table">
              <thead>
                <tr>${headers}${actionHeader}</tr>
              </thead>
              <tbody>
                ${rowsMarkup}
              </tbody>
            </table>
          </div>
          ${emptyTable}
        ` : ''}
      </div>
    </div>
  `;
}

function formatCell(value) {
  if (value === null || value === undefined) {
    return '<span class="muted">null</span>';
  }
  if (typeof value === 'object') {
    return escapeHtml(JSON.stringify(value));
  }
  return escapeHtml(String(value));
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function summary(result) {
  return `dropped ${result.droppedTables.length}, created ${result.createdTables.length}, rebuilt ${result.rebuiltTables.length}`;
}
