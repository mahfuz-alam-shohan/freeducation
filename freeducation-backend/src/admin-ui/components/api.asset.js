export function renderApiManagementPanel(apis) {
  const rows = apis.map((api) => renderApiRow(api)).join('');
  const emptyRow = `
    <tr>
      <td class="table-empty" colspan="7">No APIs configured yet.</td>
    </tr>
  `;

  return `
    <div class="api-page">
      <div class="card table-card">
        <div class="table-header">
          <div>
            <h3>API management</h3>
            <p>Control access, keys, and payload details.</p>
          </div>
          <div class="table-actions">
            <button class="button ghost" data-action="api-refresh">Refresh</button>
          </div>
        </div>
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Method</th>
                <th>API</th>
                <th>Path</th>
                <th>Access</th>
                <th>Users</th>
                <th>Keys</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows || emptyRow}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function renderApiModal(api) {
  const userTypeControls = Object.entries(api.roles || {}).map(([role, enabled]) => {
    return `
      <label class="switch">
        <input type="checkbox" data-action="api-user-type" data-role="${role}" ${enabled ? 'checked' : ''} />
        <span class="switch-ui"></span>
        <span class="switch-label">${role}</span>
      </label>
    `;
  }).join('');

  const allowOverrides = renderOverrideChips(api.userOverrides?.allow || [], 'allow');
  const denyOverrides = renderOverrideChips(api.userOverrides?.deny || [], 'deny');

  const keyRows = (api.keys || []).map((key) => {
    return `
      <div class="api-key-row">
        <div>
          <div class="api-key-label">${key.label}</div>
          <div class="api-key-value">${key.prefix}****</div>
        </div>
        <div class="api-key-actions">
          <label class="switch">
            <input type="checkbox" data-action="api-key-toggle" data-key="${key.id}" ${key.enabled ? 'checked' : ''} />
            <span class="switch-ui"></span>
            <span class="switch-label">${key.enabled ? 'On' : 'Off'}</span>
          </label>
          <button class="button ghost" data-action="api-key-rotate" data-key="${key.id}">Rotate</button>
          <button class="button ghost" data-action="api-key-delete" data-key="${key.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="modal" data-modal>
      <div class="modal-card modal-wide">
        <div class="modal-header">
          <div>
            <h2>${api.name}</h2>
            <p>${api.description}</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="api-edit">
          <div class="form-grid">
            <div class="field">
              <label>Name</label>
              <input class="input" name="name" value="${api.name}" required />
            </div>
            <div class="field">
              <label>Status</label>
              <div class="switch-row">
                <label class="switch">
                  <input type="checkbox" data-action="api-enabled" ${api.enabled ? 'checked' : ''} />
                  <span class="switch-ui"></span>
                  <span class="switch-label">${api.enabled ? 'On' : 'Off'}</span>
                </label>
                <label class="switch">
                  <input type="checkbox" data-action="api-public" ${api.public ? 'checked' : ''} />
                  <span class="switch-ui"></span>
                  <span class="switch-label">${api.public ? 'Public' : 'Private'}</span>
                </label>
              </div>
            </div>
            <div class="field">
              <label>Method</label>
              <select class="input" name="method">
                ${renderMethodOption('GET', api.method)}
                ${renderMethodOption('POST', api.method)}
                ${renderMethodOption('PUT', api.method)}
                ${renderMethodOption('PATCH', api.method)}
                ${renderMethodOption('DELETE', api.method)}
              </select>
            </div>
            <div class="field">
              <label>Endpoint</label>
              <input class="input" name="path" value="${api.path}" required />
            </div>
            <div class="field">
              <label>Description</label>
              <input class="input" name="description" value="${api.description || ''}" required />
            </div>
            <div class="field">
              <label>Payload summary</label>
              <textarea class="input textarea" name="dataSummary" rows="3">${api.dataSummary || ''}</textarea>
            </div>
          </div>
          <div class="api-section">
            <h4>Access control</h4>
            <div class="api-section-grid">
              <div>
                <p class="muted">User types</p>
                <div class="switch-row">${userTypeControls}</div>
              </div>
              <div>
                <p class="muted">User overrides</p>
                <div class="override-section">
                  <div>
                    <p class="muted">Allow</p>
                    <div class="chip-row">${allowOverrides}</div>
                  </div>
                  <div>
                    <p class="muted">Deny</p>
                    <div class="chip-row">${denyOverrides}</div>
                  </div>
                </div>
                <div class="chip-input">
                  <select class="input" data-input="api-user-mode">
                    <option value="allow">Allow</option>
                    <option value="deny">Deny</option>
                  </select>
                  <input class="input" data-input="api-user-id" placeholder="Add user ID" />
                  <button class="button secondary" type="button" data-action="api-user-add">Add</button>
                </div>
              </div>
            </div>
          </div>
          <div class="api-section">
            <h4>API keys</h4>
            <div class="api-key-list">
              ${keyRows || '<p class="muted">No keys yet.</p>'}
            </div>
            <div class="chip-input" style="margin-top:10px;">
              <input class="input" data-input="api-key-label" placeholder="Key label" />
              <button class="button secondary" type="button" data-action="api-key-create">Create key</button>
            </div>
          </div>
          <div class="modal-actions">
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderApiRow(api) {
  const activeKeys = (api.keys || []).filter((key) => key.enabled).length;
  const userTypes = Object.entries(api.roles || {})
    .filter(([, enabled]) => enabled)
    .map(([role]) => role)
    .join(', ') || 'none';
  const privacy = api.public ? 'Public' : 'Private';
  const status = api.enabled ? 'Enabled' : 'Disabled';
  const access = `${privacy} | ${status}`;

  return `
    <tr>
      <td><span class="cell-tag">${api.method}</span></td>
      <td class="cell-wrap">
        <div class="table-title">${api.name}</div>
        <div class="table-sub">${api.description || ''}</div>
      </td>
      <td class="cell-mono">${api.path}</td>
      <td>${access}</td>
      <td>${userTypes}</td>
      <td>${activeKeys}</td>
      <td class="cell-actions">
        <label class="switch">
          <input type="checkbox" data-action="api-toggle" data-id="${api.id}" ${api.enabled ? 'checked' : ''} />
          <span class="switch-ui"></span>
          <span class="switch-label">${api.enabled ? 'On' : 'Off'}</span>
        </label>
        <button class="button secondary" data-action="api-manage" data-id="${api.id}">Manage</button>
      </td>
    </tr>
  `;
}

function renderOverrideChips(ids, mode) {
  if (!ids || ids.length === 0) {
    return '<span class="muted">None</span>';
  }
  return ids.map((id) => {
    return `<span class="chip">${id}<button class="chip-remove" data-action="api-user-remove" data-mode="${mode}" data-user="${id}">x</button></span>`;
  }).join('');
}

function renderMethodOption(value, current) {
  return `<option value="${value}" ${value === current ? 'selected' : ''}>${value}</option>`;
}
