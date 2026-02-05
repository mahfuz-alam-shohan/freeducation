import { api } from '../api/index.js';
import { withLoading } from '../core/loading.js';
import { invalidateApis } from '../core/cache.js';
import { renderApiModal } from '../../components/api.js';
import { showToast } from '../../components/toast.js';

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

export async function openApiModal(id, { refresh } = {}) {
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
      invalidateApis();
      if (refresh) {
        await refresh({ force: true });
      }
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
          await openApiModal(apiItem.id, { refresh });
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
          await openApiModal(apiItem.id, { refresh });
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  modal.querySelectorAll('[data-action="api-key-revoke"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const keyId = button.getAttribute('data-key');
      if (!keyId) return;
      if (!confirm('Delete this API key?')) return;
      try {
        await withLoading(async () => {
          await api.deleteApiKey(keyId);
          modal.remove();
          await openApiModal(apiItem.id, { refresh });
          invalidateApis();
          if (refresh) {
            await refresh({ force: true });
          }
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  modal.querySelectorAll('[data-action="api-key-create"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const label = String(button.getAttribute('data-label') || '').trim() || null;
      try {
        await withLoading(async () => {
          const data = await api.createApiKey(apiItem.id, label);
          showSecret(data.key, 'New API key');
          modal.remove();
          await openApiModal(apiItem.id, { refresh });
          invalidateApis();
          if (refresh) {
            await refresh({ force: true });
          }
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  modal.querySelectorAll('[data-action="api-user-add"]').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = Number(button.getAttribute('data-user'));
      const mode = button.getAttribute('data-mode');
      if (!Number.isFinite(userId)) return;
      if (mode === 'deny') {
        apiItem.userOverrides.deny = apiItem.userOverrides.deny.filter((id) => id !== userId);
        apiItem.userOverrides.allow.push(userId);
      } else {
        apiItem.userOverrides.allow = apiItem.userOverrides.allow.filter((id) => id !== userId);
        apiItem.userOverrides.deny.push(userId);
      }
      modal.remove();
      openApiModal(apiItem.id, { refresh });
    });
  });

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
      openApiModal(apiItem.id, { refresh });
    });
  });
}
