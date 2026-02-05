import { renderStatCards } from './cards.js';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function renderSnapshotRow(label, value, note = '') {
  return `
    <tr>
      <td>${label}</td>
      <td class="cell-mono">${value}</td>
      <td class="cell-wrap">${note || '-'}</td>
    </tr>
  `;
}

function renderEmptyRow(colspan, text) {
  return `
    <tr>
      <td class="table-empty" colspan="${colspan}">${text}</td>
    </tr>
  `;
}

function renderRecentSubjects(subjects) {
  if (!subjects.length) {
    return renderEmptyRow(5, 'No subjects created yet.');
  }

  return subjects.map((subject) => {
    const status = subject.isActive
      ? '<span class="cell-tag good">Active</span>'
      : '<span class="cell-tag bad">Inactive</span>';

    return `
      <tr>
        <td>
          <div class="table-title">${subject.name}</div>
          <div class="table-sub">${subject.templateName}</div>
        </td>
        <td class="cell-mono">${subject.templateCode}</td>
        <td>${status}</td>
        <td class="cell-mono">${formatDate(subject.updatedAt)}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#subjects/${subject.id}">Open</a>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSubjectModules(modules) {
  if (!modules.length) {
    return renderEmptyRow(5, 'No subject skeletons created yet.');
  }

  return modules.map((module) => {
    const status = module.isActive
      ? '<span class="cell-tag good">Active</span>'
      : '<span class="cell-tag bad">Disabled</span>';

    return `
      <tr>
        <td>
          <div class="table-title">${module.name}</div>
          <div class="table-sub">${module.code}</div>
        </td>
        <td class="cell-mono">${module.nodeCount}</td>
        <td>${status}</td>
        <td class="cell-mono">${formatDate(module.updatedAt)}</td>
        <td class="cell-actions">
          <a class="button secondary" href="#modules/subjects/${module.id}">Open</a>
        </td>
      </tr>
    `;
  }).join('');
}

function renderQuickActions() {
  const actions = [
    { label: 'Manage users', note: 'Add or update admin accounts.', href: '#users' },
    { label: 'Subject skeletons', note: 'Configure curriculum templates.', href: '#modules/subjects' },
    { label: 'Subjects', note: 'Create or edit subjects.', href: '#subjects' },
    { label: 'API management', note: 'Access keys and endpoints.', href: '#api' },
    { label: 'Database', note: 'Inspect tables and data.', href: '#database' }
  ];

  const rows = actions.map((action) => `
      <tr>
        <td>${action.label}</td>
        <td class="cell-wrap">${action.note}</td>
        <td class="cell-actions">
          <a class="button secondary" href="${action.href}">Open</a>
        </td>
      </tr>
    `).join('');

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>Quick Actions</h3>
          <p>Jump to the most used admin areas.</p>
        </div>
        <div class="table-actions">
          <button class="button ghost" data-action="refresh">Refresh</button>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Description</th>
              <th>Go</th>
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

export function renderDashboard({ users, totalUsers, subjectModules, subjects, apis, tables }) {
  const activeUsers = users.filter((user) => user.isActive).length;
  const activeAdmins = users.filter((user) => user.role === 'admin' && user.isActive).length;
  const activeEducators = users.filter((user) => user.role === 'teacher' && user.isActive).length;
  const activeStudents = users.filter((user) => user.role === 'student' && user.isActive).length;
  const inactiveUsers = users.filter((user) => !user.isActive).length;

  const activeSubjects = subjects.filter((subject) => subject.isActive).length;
  const inactiveSubjects = subjects.filter((subject) => !subject.isActive).length;
  const activeModules = subjectModules.filter((module) => module.isActive).length;

  const enabledApis = apis.filter((api) => api.enabled).length;
  const publicApis = apis.filter((api) => api.public).length;
  const systemApis = apis.filter((api) => api.system).length;
  const apiKeys = apis.reduce((sum, api) => sum + (api.keys ? api.keys.length : 0), 0);

  const stats = [
    { label: 'Total users', value: totalUsers || users.length, caption: 'All roles' },
    { label: 'Loaded users', value: users.length, caption: 'Current list' },
    { label: 'Active admins', value: activeAdmins, caption: 'Enabled' },
    { label: 'Active educators', value: activeEducators, caption: 'Teachers' },
    { label: 'Active students', value: activeStudents, caption: 'Students' },
    { label: 'Subject skeletons', value: subjectModules.length, caption: 'Templates' },
    { label: 'Subjects', value: subjects.length, caption: 'Published' },
    { label: 'API endpoints', value: apis.length, caption: 'Registered' },
    { label: 'DB tables', value: tables.length, caption: 'D1 tables' }
  ];

  const recentSubjects = [...subjects]
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    .slice(0, 6);

  const recentModules = [...subjectModules]
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    .slice(0, 6);

  const snapshotRows = [
    renderSnapshotRow('Last refresh', formatDateTime(new Date()), 'Local time'),
    renderSnapshotRow('Active users', `${activeUsers}/${totalUsers || users.length}`, 'Accounts enabled'),
    renderSnapshotRow('Inactive users', inactiveUsers, 'Disabled accounts'),
    renderSnapshotRow('Active subjects', `${activeSubjects}/${subjects.length}`, 'Subjects enabled'),
    renderSnapshotRow('Inactive subjects', inactiveSubjects, 'Subjects disabled'),
    renderSnapshotRow('Active skeletons', `${activeModules}/${subjectModules.length}`, 'Templates enabled'),
    renderSnapshotRow('API endpoints enabled', `${enabledApis}/${apis.length}`, 'Enabled endpoints'),
    renderSnapshotRow('Public endpoints', publicApis, 'Publicly accessible'),
    renderSnapshotRow('System endpoints', systemApis, 'System protected'),
    renderSnapshotRow('API keys', apiKeys, 'Total keys issued'),
    renderSnapshotRow('Database tables', tables.length, 'Configured tables')
  ].join('');

  return `
    ${renderStatCards(stats, { className: 'stats-grid' })}
    <div class="dashboard-grid">
      <div class="card table-card">
        <div class="table-header">
          <div>
            <h3>System Snapshot</h3>
            <p>Live overview of admin data.</p>
          </div>
        </div>
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${snapshotRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-header">
          <div>
            <h3>Recent Subjects</h3>
            <p>Latest updated subjects.</p>
          </div>
          <div class="table-actions">
            <a class="button ghost" href="#subjects">View all</a>
          </div>
        </div>
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Template</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderRecentSubjects(recentSubjects)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-header">
          <div>
            <h3>Subject Skeletons</h3>
            <p>Templates ready for authoring.</p>
          </div>
          <div class="table-actions">
            <a class="button ghost" href="#modules/subjects">View all</a>
          </div>
        </div>
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Template</th>
                <th>Nodes</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderSubjectModules(recentModules)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-header">
          <div>
            <h3>API Snapshot</h3>
            <p>Endpoint coverage and keys.</p>
          </div>
          <div class="table-actions">
            <a class="button ghost" href="#api">Manage APIs</a>
          </div>
        </div>
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${[
                renderSnapshotRow('Total endpoints', apis.length, 'All configured APIs'),
                renderSnapshotRow('Enabled endpoints', enabledApis, 'Enabled and ready'),
                renderSnapshotRow('Public endpoints', publicApis, 'No auth required'),
                renderSnapshotRow('System endpoints', systemApis, 'System restricted'),
                renderSnapshotRow('API keys', apiKeys, 'Keys issued')
              ].join('')}
            </tbody>
          </table>
        </div>
      </div>

      ${renderQuickActions()}
    </div>
  `;
}
