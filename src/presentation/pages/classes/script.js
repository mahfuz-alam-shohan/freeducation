import { imageToolsModule } from "../../shared/client/imageTools.js";

export function classesScript(apiBase = "/api/workspace") {
  return `
(() => {
  const rowsEl = document.getElementById('classRows');
  const msgEl = document.getElementById('classesMsg');
  const toggleBtn = document.getElementById('toggleClassCreateForm');
  const cancelBtn = document.getElementById('cancelClassCreateForm');
  const panelEl = document.getElementById('classCreatePanel');
  const formEl = document.getElementById('createClassForm');
  const createImageSlot = document.getElementById('classCreateImageSlot');
  const createImageInput = document.getElementById('classCreateImageInput');
  const createImagePreview = document.getElementById('classCreateImagePreview');
  const createImageIcon = document.getElementById('classCreateImageIcon');
  const createImageRemove = document.getElementById('classCreateImageRemove');
  if (!rowsEl || !msgEl || !toggleBtn || !cancelBtn || !panelEl || !formEl || !createImageSlot || !createImageInput || !createImagePreview || !createImageIcon || !createImageRemove) return;

  const apiRoot = ${JSON.stringify(String(apiBase || "/api/workspace"))};
  const controller = new AbortController();
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }

  const autosaveTimers = new Map();
  const toastHostId = 'classesToastHost';
  const imagePlaceholderIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 15.2l-4.6-4.3-4.4 4.1-2.3-2.1-5.7 5.2"/></svg>';
  let createPreviewUrl = '';

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
  const isInteractiveTarget = (target) => Boolean(target?.closest?.('button,input,select,textarea,label,a,[data-action],[contenteditable="true"]'));

  const setMsg = (text) => {
    msgEl.textContent = String(text || '');
  };

  const showToast = (text, type = 'info') => {
    const message = String(text || '').trim();
    if (!message) return;
    let host = document.getElementById(toastHostId);
    if (!host) {
      host = document.createElement('div');
      host.id = toastHostId;
      host.className = 'cls-toast-stack';
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.className = 'cls-toast cls-toast-' + String(type || 'info');
    toast.textContent = message;
    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 220);
    }, 1900);
  };

  const queueAutosave = (key, run, delay = 700) => {
    const timerKey = String(key || '');
    if (!timerKey || typeof run !== 'function') return;
    const existing = autosaveTimers.get(timerKey);
    if (existing) window.clearTimeout(existing);
    const timer = window.setTimeout(async () => {
      autosaveTimers.delete(timerKey);
      try {
        await run();
      } catch (error) {
        if (error?.name === 'AbortError') return;
        showToast(error?.message || 'Unable to sync', 'error');
        setMsg(error?.message || 'Unable to sync');
      }
    }, delay);
    autosaveTimers.set(timerKey, timer);
  };
${imageToolsModule()}
  const fileToDataUrl = async (file, options = {}) => (
    compressFileToDataUrl(file, {
      maxWidth: Number(options.maxWidth || 1600),
      maxHeight: Number(options.maxHeight || 1600),
      targetBytes: Number(options.targetBytes || (900 * 1024)),
      minQuality: Number(options.minQuality || 0.5),
      quality: Number(options.quality || 0.84),
      outputType: 'image/webp',
    })
  );

  const toDate = (value) => {
    const date = new Date(value || '');
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  };

  const clearCreatePreviewUrl = () => {
    if (!createPreviewUrl) return;
    URL.revokeObjectURL(createPreviewUrl);
    createPreviewUrl = '';
  };

  const syncCreateImageUi = () => {
    const file = createImageInput.files?.[0] || null;
    clearCreatePreviewUrl();
    if (!file) {
      createImagePreview.hidden = true;
      createImagePreview.removeAttribute('src');
      createImageIcon.hidden = false;
      createImageRemove.hidden = true;
      createImageSlot.classList.remove('has-image');
      return;
    }
    createPreviewUrl = URL.createObjectURL(file);
    createImagePreview.src = createPreviewUrl;
    createImagePreview.hidden = false;
    createImageIcon.hidden = true;
    createImageRemove.hidden = false;
    createImageSlot.classList.add('has-image');
  };

  const setCreatePanelOpen = (open) => {
    const isOpen = Boolean(open);
    panelEl.classList.toggle('is-open', isOpen);
    panelEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (!isOpen) {
      formEl.reset();
      createImageInput.value = '';
      syncCreateImageUi();
    }
  };

  const renderRows = (classes) => {
    if (!Array.isArray(classes) || !classes.length) {
      rowsEl.innerHTML = '<tr><td colspan="4" class="cls-empty">No classes yet. Add your first class.</td></tr>';
      return;
    }

    rowsEl.innerHTML = classes.map((item) => {
      const id = Number(item?.id || 0);
      return '<tr data-class-id="' + id + '">'
        + '<td><input type="checkbox" class="cls-home-check" data-field="classShowInHome" data-saved-value="' + (item?.showInHome ? '1' : '0') + '"' + (item?.showInHome ? ' checked' : '') + ' /></td>'
        + '<td><div class="cls-image-slot-wrap">'
        + '<button type="button" class="cls-image-slot ' + (item?.imageUrl ? 'has-image' : '') + '" data-action="pick-class-image">'
        + (item?.imageUrl
          ? ('<img class="cls-thumb" src="' + escapeHtml(item.imageUrl) + '" alt="Class image" />')
          : ('<span class="cls-image-icon">' + imagePlaceholderIcon + '</span>'))
        + '</button>'
        + '<input class="cls-image-input" data-field="classImageFile" type="file" accept="image/png,image/jpeg,image/webp" />'
        + (item?.imageUrl
          ? '<button type="button" class="cls-image-remove" data-action="remove-class-image" aria-label="Remove image">x</button>'
          : '')
        + '</div></td>'
        + '<td><input class="cls-input" data-field="className" data-saved-value="' + escapeHtml(item?.name || '') + '" value="' + escapeHtml(item?.name || '') + '" /></td>'
        + '<td>' + escapeHtml(toDate(item?.createdAt)) + '</td>'
        + '</tr>';
    }).join('');
  };

  const loadClasses = async () => {
    const response = await fetch(apiRoot + '/classes', { signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to load classes');
    renderRows(payload?.classes || []);
  };

  const reload = async () => {
    setMsg('Loading classes...');
    try {
      await loadClasses();
      setMsg('');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      rowsEl.innerHTML = '<tr><td colspan="4" class="cls-empty">Unable to load classes.</td></tr>';
      setMsg(error?.message || 'Unable to load classes');
    }
  };

  const updateClassMeta = async (row, options = {}) => {
    const classId = Number(row?.getAttribute('data-class-id') || 0);
    if (!classId) return;
    const nameInput = row.querySelector('[data-field="className"]');
    const checkInput = row.querySelector('[data-field="classShowInHome"]');
    const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
    const nextName = String(nameInput?.value || '').trim() || savedName;
    const showInHome = Boolean(checkInput?.checked);
    if (!nextName) throw new Error('Class name is required');

    const payload = {
      name: nextName,
      showInHome,
    };
    if (options.file) payload.imageData = await fileToDataUrl(options.file);
    if (options.clear) payload.clearImage = true;

    setMsg(options.file ? 'Uploading image...' : options.clear ? 'Removing image...' : 'Syncing class...');
    const response = await fetch(apiRoot + '/classes/' + classId, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body?.error || 'Unable to update class');

    const persisted = body?.classItem || {};
    const persistedName = String(persisted?.name || nextName);
    if (nameInput) {
      nameInput.value = persistedName;
      nameInput.setAttribute('data-saved-value', persistedName);
      nameInput.classList.remove('is-syncing');
    }
    if (checkInput) {
      checkInput.checked = Boolean(persisted?.showInHome);
      checkInput.setAttribute('data-saved-value', checkInput.checked ? '1' : '0');
    }
    if (options.file || options.clear) {
      await loadClasses();
    }
    setMsg('Class synced.');
    showToast('Class synced', 'success');
  };

  toggleBtn.addEventListener('click', () => {
    const open = panelEl.getAttribute('aria-hidden') !== 'false';
    setCreatePanelOpen(open);
  }, { signal: controller.signal });

  cancelBtn.addEventListener('click', () => setCreatePanelOpen(false), { signal: controller.signal });
  createImageSlot.addEventListener('click', () => createImageInput.click(), { signal: controller.signal });
  createImageInput.addEventListener('change', () => syncCreateImageUi(), { signal: controller.signal });
  createImageRemove.addEventListener('click', () => {
    createImageInput.value = '';
    syncCreateImageUi();
  }, { signal: controller.signal });

  rowsEl.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (actionEl) {
      const row = actionEl.closest('tr[data-class-id]');
      if (!row) return;
      const action = String(actionEl.getAttribute('data-action') || '');
      if (action === 'pick-class-image') {
        const input = row.querySelector('[data-field="classImageFile"]');
        if (input) input.click();
        return;
      }
      if (action === 'remove-class-image') {
        updateClassMeta(row, { clear: true }).catch((error) => {
          if (error?.name === 'AbortError') return;
          setMsg(error?.message || 'Unable to remove image');
        });
      }
      return;
    }

    if (isInteractiveTarget(event.target)) return;
    const row = event.target.closest('tr[data-class-id]');
    if (!row) return;
    const classId = Number(row.getAttribute('data-class-id') || 0);
    if (!classId) return;
    const href = '/admin/classes/' + classId;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(href);
    } else {
      window.location.href = href;
    }
  }, { signal: controller.signal });

  rowsEl.addEventListener('input', (event) => {
    const input = event.target.closest('input[data-field="className"]');
    if (!input) return;
    const row = input.closest('tr[data-class-id]');
    if (!row) return;
    const classId = Number(row.getAttribute('data-class-id') || 0);
    if (!classId) return;
    const nextName = String(input.value || '').trim();
    const savedName = String(input.getAttribute('data-saved-value') || '').trim();
    if (!nextName || nextName.length < 2 || nextName === savedName) return;
    input.classList.add('is-syncing');
    queueAutosave('class-name:' + classId, () => updateClassMeta(row), 700);
  }, { signal: controller.signal });

  rowsEl.addEventListener('change', (event) => {
    const check = event.target.closest('input[data-field="classShowInHome"]');
    if (check) {
      const row = check.closest('tr[data-class-id]');
      if (!row) return;
      updateClassMeta(row).catch((error) => {
        if (error?.name === 'AbortError') return;
        setMsg(error?.message || 'Unable to update visibility');
      });
      return;
    }

    const fileInput = event.target.closest('input[data-field="classImageFile"]');
    if (!fileInput) return;
    const row = fileInput.closest('tr[data-class-id]');
    const file = fileInput.files?.[0] || null;
    if (!row || !file) return;
    updateClassMeta(row, { file }).catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to update image');
    }).finally(() => {
      fileInput.value = '';
    });
  }, { signal: controller.signal });

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const imageFile = createImageInput.files?.[0] || null;
    const payload = {
      name: String(formEl.elements.name?.value || '').trim(),
      showInHome: Boolean(formEl.elements.showInHome?.checked),
    };
    if (imageFile && imageFile.size > 0) {
      payload.imageData = await fileToDataUrl(imageFile);
    }

    setMsg('Creating class...');
    try {
      const response = await fetch(apiRoot + '/classes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || 'Unable to create class');
      setCreatePanelOpen(false);
      await loadClasses();
      setMsg('Class created.');
      showToast('Class created', 'success');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to create class');
    }
  }, { signal: controller.signal });

  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => {
      for (const timer of autosaveTimers.values()) {
        window.clearTimeout(timer);
      }
      autosaveTimers.clear();
      clearCreatePreviewUrl();
    });
  }

  syncCreateImageUi();
  reload();
})();
`;
}
