export function renderUsersTable(users) {
  const rows = users.map((user) => renderRow(user)).join('');

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>Users</h3>
          <p>Manage accounts and roles</p>
        </div>
        <div class="table-actions">
          <button class="button ghost" data-action="refresh">Refresh</button>
          <button class="button" data-action="open-create">New user</button>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRow(user) {
  const statusClass = user.isActive ? 'good' : 'bad';
  const statusText = user.isActive ? 'Active' : 'Inactive';
  const actionLabel = user.isActive ? 'Deactivate' : 'Activate';

  return `
    <tr>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td><span class="badge warn">${user.role}</span></td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
      <td>
        <button class="button secondary" data-action="toggle" data-id="${user.id}">
          ${actionLabel}
        </button>
      </td>
    </tr>
  `;
}
