import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { renderLayout } from './components/layout.js';
import { renderStatCards } from './components/cards.js';
import { renderUsersTable } from './components/table.js';
import { renderUserForm } from './components/form.js';
import { showToast } from './components/toast.js';
import { renderDatabasePanel } from './components/db.js';
import { renderApiManagementPanel, renderApiModal } from './components/api.js';

const app = document.getElementById('app');

const loadingState = {
  count: 0,
  timer: null,
  overlay: null
};

function ensureLoadingOverlay() {
  if (loadingState.overlay) return loadingState.overlay;
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading...</div>
    </div>
  `;
  document.body.appendChild(overlay);
  loadingState.overlay = overlay;
  return overlay;
}

function setLoading(active) {
  const overlay = ensureLoadingOverlay();
  overlay.classList.toggle('is-active', active);
  document.body.classList.toggle('is-loading', active);
  document.body.setAttribute('aria-busy', active ? 'true' : 'false');
}

function showLoading() {
  loadingState.count += 1;
  if (loadingState.timer) return;
  loadingState.timer = setTimeout(() => {
    loadingState.timer = null;
    if (loadingState.count > 0) {
      setLoading(true);
    }
  }, 120);
}

function hideLoading() {
  loadingState.count = Math.max(0, loadingState.count - 1);
  if (loadingState.count === 0) {
    if (loadingState.timer) {
      clearTimeout(loadingState.timer);
      loadingState.timer = null;
    }
    setLoading(false);
  }
}

async function withLoading(task) {
  showLoading();
  try {
    return await task();
  } finally {
    hideLoading();
  }
}

const state = {
  user: null,
  users: [],
  total: 0,
  apis: [],
  tables: [],
  selectedTable: null,
  tableRows: [],
  tableColumns: [],
  tablePrimaryKey: null,
  tableTotal: 0,
  maintenance: null
};

const api = {
  async getSession() {
    const res = await fetch('/api/v1/admin/session', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data : null;
  },
  async bootstrap(payload) {
    const res = await fetch('/api/v1/admin/bootstrap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create admin');
    }
    return data;
  },
  async bootstrapStatus() {
    const res = await fetch('/api/v1/admin/bootstrap/status');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to check bootstrap status');
    }
    return data;
  },
  async login(payload) {
    const res = await fetch('/api/v1/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },
  async logout() {
    await fetch('/api/v1/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });
  },
  async listUsers() {
    const res = await fetch('/api/v1/users?limit=50&offset=0', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load users');
    }
    return data;
  },
  async createUser(payload) {
    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create user');
    }
    return data;
  },
  async updateUser(id, payload) {
    const res = await fetch(`/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update user');
    }
    return data;
  },
  async listTables() {
    const res = await fetch('/api/v1/admin/db/tables', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load tables');
    }
    return data;
  },
  async getTable(name) {
    const res = await fetch(`/api/v1/admin/db/table/${name}?limit=50&offset=0`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load table');
    }
    return data;
  },
  async deleteRow(table, primaryKey, value) {
    const res = await fetch(`/api/v1/admin/db/table/${table}/row`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ primaryKey, value })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete row');
    }
    return data;
  },
  async truncateTable(table) {
    const res = await fetch(`/api/v1/admin/db/table/${table}/truncate`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to truncate table');
    }
    return data;
  },
  async dropTable(table) {
    const res = await fetch(`/api/v1/admin/db/table/${table}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to drop table');
    }
    return data;
  },
  async reconcileSchema() {
    const res = await fetch('/api/v1/admin/maintenance/reconcile', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Maintenance failed');
    }
    return data;
  },
  async listApiEndpoints() {
    const res = await fetch('/api/v1/admin/api/endpoints', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load APIs');
    }
    return data;
  },
  async getApiEndpoint(id) {
    const res = await fetch(`/api/v1/admin/api/endpoints/${id}`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load API');
    }
    return data;
  },
  async updateApiEndpoint(id, payload) {
    const res = await fetch(`/api/v1/admin/api/endpoints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update API');
    }
    return data;
  },
  async createApiKey(endpointId, label) {
    const res = await fetch(`/api/v1/admin/api/endpoints/${endpointId}/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ label })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create key');
    }
    return data;
  },
  async updateApiKey(keyId, payload) {
    const res = await fetch(`/api/v1/admin/api/keys/${keyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update key');
    }
    return data;
  },
  async rotateApiKey(keyId) {
    const res = await fetch(`/api/v1/admin/api/keys/${keyId}/rotate`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to rotate key');
    }
    return data;
  },
  async deleteApiKey(keyId) {
    const res = await fetch(`/api/v1/admin/api/keys/${keyId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete key');
    }
    return data;
  }
};

function getRoute() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'dashboard';
}

function renderLogin(canBootstrap) {
  const bootstrapPanel = canBootstrap ? `
      <div class="auth-panel">
        <div class="auth-brand">FREEDUCATION</div>
        <h1>First admin setup</h1>
        <p>Create the initial administrator account.</p>
        <form data-form="bootstrap">
          <div class="form-grid">
            <div class="field">
              <label>First name</label>
              <input class="input" name="firstName" required />
            </div>
            <div class="field">
              <label>Last name</label>
              <input class="input" name="lastName" required />
            </div>
            <div class="field">
              <label>Email</label>
              <input class="input" type="email" name="email" required />
            </div>
            <div class="field">
              <label>Password</label>
              <input class="input" type="password" name="password" required />
            </div>
          </div>
          <div style="margin-top:16px; display:flex; justify-content:flex-end;">
            <button class="button secondary" type="submit">Create admin</button>
          </div>
        </form>
      </div>
  ` : '';

  app.innerHTML = `
    <div class="auth-shell">
      <div class="auth-panel">
        <div class="auth-brand">FREEDUCATION</div>
        <h1>Welcome back</h1>
        <p>Sign in to manage FREEDUCATION.</p>
        <form data-form="login">
          <div class="field">
            <label>Email</label>
            <input class="input" type="email" name="email" required />
          </div>
          <div class="field" style="margin-top:12px;">
            <label>Password</label>
            <input class="input" type="password" name="password" required />
          </div>
          <div style="margin-top:16px; display:flex; justify-content:flex-end;">
            <button class="button" type="submit">Sign in</button>
          </div>
        </form>
      </div>
      ${bootstrapPanel}
    </div>
  `;

  const loginForm = app.querySelector('[data-form="login"]');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      await withLoading(async () => {
        const result = await api.login(payload);
        state.user = result.user;
        await renderApp();
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  const bootstrapForm = app.querySelector('[data-form="bootstrap"]');
  if (canBootstrap && bootstrapForm) {
    bootstrapForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(bootstrapForm);
      const payload = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        await withLoading(async () => {
          await api.bootstrap(payload);
          showToast('Admin created, you can sign in now');
          renderLogin(false);
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }
}

async function loadUsers() {
  const data = await api.listUsers();
  state.users = data.data || [];
  state.total = data.pagination?.total || 0;
}

async function loadApis() {
  const data = await api.listApiEndpoints();
  state.apis = (data.data || []).map((item) => normalizeApi(item));
}

async function loadTables() {
  const data = await api.listTables();
  state.tables = data.tables.map((item) => item.name);
  if (!state.selectedTable && state.tables.length > 0) {
    state.selectedTable = state.tables[0];
  }
}

async function loadSelectedTable() {
  if (!state.selectedTable) {
    state.tableRows = [];
    state.tableColumns = [];
    state.tablePrimaryKey = null;
    state.tableTotal = 0;
    return;
  }

  const data = await api.getTable(state.selectedTable);
  state.tableRows = data.data.rows || [];
  state.tableColumns = data.data.columns || [];
  state.tablePrimaryKey = data.data.primaryKey;
  state.tableTotal = data.data.total || 0;
}

async function renderApp() {
  await withLoading(async () => {
    const route = getRoute();

    if (route === 'dashboard' || route === 'users') {
      await loadUsers();
    }

    if (route === 'database') {
      await loadTables();
      await loadSelectedTable();
    }

    if (route === 'api') {
      try {
        await loadApis();
      } catch (error) {
        state.apis = [];
        showToast(error.message, 'error');
      }
    }

    const sidebar = renderSidebar([
      { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
      { id: 'users', label: 'Users', href: '#users' },
      { id: 'database', label: 'Database', href: '#database' },
      { id: 'api', label: 'API Management', href: '#api' }
    ], route);

    let title = 'Dashboard';
    let content = '';

    if (route === 'dashboard') {
      title = 'Dashboard';
      content = renderStatCards([
        { label: 'Total users', value: state.total, caption: 'All roles' },
        { label: 'Active admins', value: state.users.filter((u) => u.role === 'admin' && u.isActive).length, caption: 'Enabled' },
        { label: 'Active educators', value: state.users.filter((u) => u.role === 'teacher' && u.isActive).length, caption: 'Teachers' }
      ]);
    } else if (route === 'users') {
      title = 'Users';
      content = renderUsersTable(state.users);
    } else if (route === 'database') {
      title = 'Database';
      content = renderDatabasePanel(state);
    } else if (route === 'api') {
      title = 'API Management';
      content = renderApiManagementPanel(state.apis);
    }

    const topbar = renderTopbar(title, state.user);
    app.innerHTML = renderLayout({ sidebar, topbar, content });

    wireActions(route);
  });
}

function wireActions(route) {
  const refreshBtn = app.querySelector('[data-action="refresh"]');
  const openCreate = app.querySelector('[data-action="open-create"]');
  const logoutBtn = app.querySelector('[data-action="logout"]');
  const navToggle = app.querySelector('[data-action="toggle-nav"]');
  const overlay = app.querySelector('[data-action="close-nav"]');
  const sidebar = app.querySelector('.sidebar');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await withLoading(async () => {
        await renderApp();
      });
    });
  }

  if (openCreate) {
    openCreate.addEventListener('click', () => openCreateModal());
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await withLoading(async () => {
        await api.logout();
        state.user = null;
        state.users = [];
        state.total = 0;
        state.apis = [];
        state.tables = [];
        state.selectedTable = null;
        state.tableRows = [];
        state.tableColumns = [];
        state.tablePrimaryKey = null;
        state.tableTotal = 0;
        state.maintenance = null;
        renderLogin(false);
      });
    });
  }

  const closeNav = () => {
    if (sidebar) {
      sidebar.classList.remove('is-open');
    }
    if (overlay) {
      overlay.classList.remove('is-active');
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (sidebar) {
        sidebar.classList.toggle('is-open');
      }
      if (overlay) {
        overlay.classList.toggle('is-active');
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  app.querySelectorAll('.sidebar a').forEach((link) => {
    link.addEventListener('click', () => closeNav());
  });

  if (route === 'users') {
    app.querySelectorAll('[data-action="toggle"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        if (!id) return;
        const user = state.users.find((item) => String(item.id) === id);
        if (!user) return;

        try {
          await withLoading(async () => {
            await api.updateUser(id, { isActive: !user.isActive });
            await renderApp();
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  }

  if (route === 'database') {
    const refreshTables = app.querySelector('[data-action="db-refresh"]');
    const reloadTable = app.querySelector('[data-action="db-reload"]');
    const truncateTable = app.querySelector('[data-action="db-truncate"]');
    const dropTable = app.querySelector('[data-action="db-drop"]');
    const reconcile = app.querySelector('[data-action="db-reconcile"]');

    if (refreshTables) {
      refreshTables.addEventListener('click', async () => {
        await withLoading(async () => {
          await renderApp();
        });
      });
    }

    if (reloadTable) {
      reloadTable.addEventListener('click', async () => {
        await withLoading(async () => {
          await renderApp();
        });
      });
    }

    if (truncateTable) {
      truncateTable.addEventListener('click', async () => {
        if (!state.selectedTable) return;
        if (!confirm(`Format table ${state.selectedTable}? This clears all rows.`)) return;
        try {
          await withLoading(async () => {
            await api.truncateTable(state.selectedTable);
            await renderApp();
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    }

    if (dropTable) {
      dropTable.addEventListener('click', async () => {
        if (!state.selectedTable) return;
        if (!confirm(`Delete table ${state.selectedTable}? This cannot be undone.`)) return;
        try {
          await withLoading(async () => {
            await api.dropTable(state.selectedTable);
            state.selectedTable = null;
            await renderApp();
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    }

    if (reconcile) {
      reconcile.addEventListener('click', async () => {
        try {
          await withLoading(async () => {
            const data = await api.reconcileSchema();
            state.maintenance = data.data;
            await renderApp();
            showToast('Schema reconciled');
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    }

    app.querySelectorAll('[data-action="db-select"]').forEach((button) => {
      button.addEventListener('click', async () => {
        state.selectedTable = button.getAttribute('data-table');
        await withLoading(async () => {
          await renderApp();
        });
      });
    });

    app.querySelectorAll('[data-action="db-delete-row"]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!state.selectedTable || !state.tablePrimaryKey) return;
        const value = button.getAttribute('data-pk');
        if (!confirm('Delete this row?')) return;

        try {
          await withLoading(async () => {
            await api.deleteRow(state.selectedTable, state.tablePrimaryKey, value);
            await renderApp();
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  }

  if (route === 'api') {
    const refresh = app.querySelector('[data-action="api-refresh"]');
    if (refresh) {
      refresh.addEventListener('click', async () => {
        await withLoading(async () => {
          await renderApp();
        });
      });
    }

    app.querySelectorAll('[data-action="api-toggle"]').forEach((input) => {
      input.addEventListener('change', async () => {
        const id = input.getAttribute('data-id');
        if (!id) return;
        try {
          await withLoading(async () => {
            await api.updateApiEndpoint(id, { isEnabled: input.checked });
            await renderApp();
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });

    app.querySelectorAll('[data-action="api-manage"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        if (!id) return;
        await openApiModal(id);
      });
    });
  }
}

function openCreateModal() {
  const modalMarkup = renderUserForm();
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="user-create"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    };

    try {
      await withLoading(async () => {
        await api.createUser(payload);
        modal.remove();
        await renderApp();
        showToast('User created');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

async function openApiModal(id) {
  let apiItem = null;
  try {
    apiItem = await withLoading(async () => {
      const data = await api.getApiEndpoint(id);
      return normalizeApi(data.data);
    });
  } catch (error) {
    showToast(error.message, 'error');
    return;
  }

  const modalMarkup = renderApiModal(apiItem);
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="api-edit"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || apiItem.name),
      method: String(formData.get('method') || apiItem.method),
      path: String(formData.get('path') || apiItem.path),
      description: String(formData.get('description') || ''),
      dataSummary: String(formData.get('dataSummary') || ''),
      isEnabled: apiItem.enabled,
      isPublic: apiItem.public,
      roles: apiItem.roles,
      userOverrides: apiItem.userOverrides
    };

    try {
      await api.updateApiEndpoint(apiItem.id, payload);
      modal.remove();
      await loadApis();
      renderApp();
      showToast('API settings saved');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  modal.querySelectorAll('[data-action="api-user-type"]').forEach((input) => {
    input.addEventListener('change', () => {
      const role = input.getAttribute('data-role');
      if (!role) return;
      apiItem.roles[role] = input.checked;
    });
  });

  modal.querySelectorAll('[data-action="api-enabled"]').forEach((input) => {
    input.addEventListener('change', () => {
      apiItem.enabled = input.checked;
      const label = input.closest('.switch')?.querySelector('.switch-label');
      if (label) {
        label.textContent = apiItem.enabled ? 'On' : 'Off';
      }
    });
  });

  modal.querySelectorAll('[data-action="api-public"]').forEach((input) => {
    input.addEventListener('change', () => {
      apiItem.public = input.checked;
      const label = input.closest('.switch')?.querySelector('.switch-label');
      if (label) {
        label.textContent = apiItem.public ? 'Public' : 'Private';
      }
    });
  });

  modal.querySelectorAll('[data-action="api-key-toggle"]').forEach((input) => {
    input.addEventListener('change', async () => {
      const keyId = input.getAttribute('data-key');
      if (!keyId) return;
      try {
        await withLoading(async () => {
          await api.updateApiKey(keyId, { isEnabled: input.checked });
          modal.remove();
          await openApiModal(apiItem.id);
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  modal.querySelectorAll('[data-action="api-key-rotate"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const keyId = button.getAttribute('data-key');
      if (!keyId) return;
      try {
        await withLoading(async () => {
          const data = await api.rotateApiKey(keyId);
          showSecret(data.key, 'New API key');
          modal.remove();
          await openApiModal(apiItem.id);
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  modal.querySelectorAll('[data-action="api-key-delete"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const keyId = button.getAttribute('data-key');
      if (!keyId) return;
      if (!confirm('Delete this API key?')) return;
      try {
        await withLoading(async () => {
          await api.deleteApiKey(keyId);
          modal.remove();
          await openApiModal(apiItem.id);
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  const createKey = modal.querySelector('[data-action="api-key-create"]');
  if (createKey) {
    createKey.addEventListener('click', async () => {
      const input = modal.querySelector('[data-input="api-key-label"]');
      const label = input ? String(input.value || '').trim() : '';
      try {
        await withLoading(async () => {
          const data = await api.createApiKey(apiItem.id, label || 'Primary key');
          showSecret(data.key, 'New API key');
          modal.remove();
          await openApiModal(apiItem.id);
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }

  const addUser = modal.querySelector('[data-action="api-user-add"]');
  if (addUser) {
    addUser.addEventListener('click', () => {
      const input = modal.querySelector('[data-input="api-user-id"]');
      const modeInput = modal.querySelector('[data-input="api-user-mode"]');
      if (!input || !modeInput) return;
      const value = String(input.value || '').trim();
      const mode = String(modeInput.value || 'allow');
      if (!value) return;
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        showToast('User ID must be a number', 'error');
        return;
      }
      const list = mode === 'deny' ? apiItem.userOverrides.deny : apiItem.userOverrides.allow;
      if (!list.includes(parsed)) {
        list.push(parsed);
      }
      modal.remove();
      openApiModal(apiItem.id);
    });
  }

  modal.querySelectorAll('[data-action="api-user-remove"]').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user');
      const mode = button.getAttribute('data-mode');
      if (!userId) return;
      const parsed = Number(userId);
      if (!Number.isFinite(parsed)) return;
      if (mode === 'deny') {
        apiItem.userOverrides.deny = apiItem.userOverrides.deny.filter((id) => id !== parsed);
      } else {
        apiItem.userOverrides.allow = apiItem.userOverrides.allow.filter((id) => id !== parsed);
      }
      modal.remove();
      openApiModal(apiItem.id);
    });
  });
}

function normalizeApi(item) {
  return {
    id: item.id,
    name: item.name,
    method: item.method,
    path: item.path,
    description: item.description || '',
    dataSummary: item.dataSummary || '',
    enabled: Boolean(item.isEnabled),
    public: Boolean(item.isPublic),
    system: Boolean(item.isSystem),
    roles: item.roles || { admin: false, teacher: false, student: false },
    userOverrides: item.userOverrides || { allow: [], deny: [] },
    keys: (item.keys || []).map((key) => ({
      id: key.id,
      label: key.label,
      prefix: key.prefix,
      enabled: Boolean(key.isEnabled),
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt
    }))
  };
}

function showSecret(value, title) {
  const message = `${title}:\n${value}\n\nCopy this now. It will not be shown again.`;
  window.prompt(message, value);
}

async function init() {
  ensureLoadingOverlay();
  await withLoading(async () => {
    const session = await api.getSession();
    if (session && session.user) {
      state.user = session.user;
      await renderApp();
      window.addEventListener('hashchange', () => {
        renderApp();
      });
    } else {
      try {
        const status = await api.bootstrapStatus();
        renderLogin(status.canBootstrap);
      } catch (error) {
        renderLogin(false);
      }
    }
  });
}

init();
