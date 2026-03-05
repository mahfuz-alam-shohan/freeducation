import { imageToolsModule } from "../../shared/client/imageTools.js";

export function subjectsScript(apiBase = "/api/workspace") {
  return `
(() => {
  const rowsEl = document.getElementById('subjectRows');
  const msgEl = document.getElementById('subjectsMsg');
  const modalEl = document.getElementById('subjectModal');
  const openBtn = document.getElementById('openSubjectModal');
  const cancelBtn = document.getElementById('cancelSubjectModal');
  const formEl = document.getElementById('createSubjectForm');
  const templateSelect = document.getElementById('subjectTemplateSelect');
  const classSelect = document.getElementById('subjectClassSelect');
  const createImageSlot = document.getElementById('subjectCreateImageSlot');
  const createImageInput = document.getElementById('subjectCreateImageInput');
  const createImagePreview = document.getElementById('subjectCreateImagePreview');
  const createImageIcon = document.getElementById('subjectCreateImageIcon');
  const createImageRemove = document.getElementById('subjectCreateImageRemove');
  if (!rowsEl || !msgEl || !modalEl || !openBtn || !cancelBtn || !formEl || !templateSelect || !classSelect || !createImageSlot || !createImageInput || !createImagePreview || !createImageIcon || !createImageRemove) return;

  const apiRoot = ${JSON.stringify(String(apiBase || "/api/workspace"))};
  const controller = new AbortController();
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }

  let templates = [];
  let classes = [];
  let subjects = [];
  let createPreviewUrl = '';
  const subjectSaveSequence = new Map();
  const toastHostId = 'subjectsToastHost';
  const subjectImagePlaceholderIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 15.2l-4.6-4.3-4.4 4.1-2.3-2.1-5.7 5.2"/></svg>';

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
      host.className = 'sub-toast-stack';
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.className = 'sub-toast sub-toast-' + String(type || 'info');
    toast.textContent = message;
    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 220);
    }, 1900);
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

  const openModal = () => {
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    formEl.reset();
    createImageInput.value = '';
    syncCreateImageUi();
  };

  const toDate = (value) => {
    const date = new Date(value || '');
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  };

  const renderTemplateSelect = () => {
    if (!templates.length) {
      templateSelect.innerHTML = '<option value="">No templates found</option>';
      return;
    }
    templateSelect.innerHTML = templates.map((template, index) => (
      '<option value="' + Number(template?.id || 0) + '"' + (index === 0 ? ' selected' : '') + '>'
      + escapeHtml(template?.code || template?.name || '')
      + '</option>'
    )).join('');
  };

  const renderClassSelect = () => {
    if (!classes.length) {
      classSelect.innerHTML = '<option value="">No classes found</option>';
      return;
    }
    classSelect.innerHTML = classes.map((item, index) => (
      '<option value="' + Number(item?.id || 0) + '"' + (index === 0 ? ' selected' : '') + '>'
      + escapeHtml(item?.name || '')
      + '</option>'
    )).join('');
  };

  const classOptionsHtml = (selectedClassId) => {
    if (!classes.length) {
      return '<option value="">No classes</option>';
    }
    const selectedId = Number(selectedClassId || 0);
    return classes.map((item) => {
      const id = Number(item?.id || 0);
      return '<option value="' + id + '"' + (id === selectedId ? ' selected' : '') + '>' + escapeHtml(item?.name || '') + '</option>';
    }).join('');
  };

  const renderSubjects = () => {
    if (!Array.isArray(subjects) || !subjects.length) {
      rowsEl.innerHTML = '<tr><td colspan="6" class="sub-empty">No subjects yet. Create one from a template.</td></tr>';
      return;
    }

    rowsEl.innerHTML = subjects.map((subject) => {
      const id = Number(subject?.id || 0);
      const classId = Number(subject?.classId || 0);
      const href = '/admin/subjects/' + id;
      return '<tr class="sub-row-open" data-subject-id="' + id + '" data-subject-href="' + href + '">'
        + '<td><div class="sub-image-slot-wrap">'
        + '<button type="button" class="sub-image-slot ' + (subject?.thumbnailUrl ? 'has-image' : '') + '" data-action="pick-subject-image" data-subject-id="' + id + '">'
        + (subject?.thumbnailUrl
          ? ('<img class="sub-thumb" src="' + escapeHtml(subject.thumbnailUrl) + '" alt="Subject thumbnail" />')
          : ('<span class="sub-image-icon">' + subjectImagePlaceholderIcon + '</span>'))
        + '</button>'
        + '<input class="sub-image-input" data-field="subjectImageFile" data-subject-id="' + id + '" type="file" accept="image/png,image/jpeg,image/webp" />'
        + (subject?.thumbnailUrl
          ? ('<button type="button" class="sub-image-remove" data-action="remove-subject-image" data-subject-id="' + id + '" aria-label="Remove subject image">x</button>')
          : '')
        + '</div></td>'
        + '<td><input class="sub-input" data-field="subjectName" data-saved-value="' + escapeHtml(subject?.name || '') + '" value="' + escapeHtml(subject?.name || '') + '" /></td>'
        + '<td><select class="sub-select" data-field="subjectClass" data-saved-value="' + classId + '">' + classOptionsHtml(classId) + '</select></td>'
        + '<td>' + escapeHtml(subject?.templateCode || subject?.templateName || '') + '</td>'
        + '<td>' + escapeHtml(toDate(subject?.createdAt)) + '</td>'
        + '<td><button type="button" class="sub-danger" data-action="delete-subject" data-subject-id="' + id + '" data-subject-name="' + escapeHtml(subject?.name || '') + '">Delete</button></td>'
        + '</tr>';
    }).join('');
  };

  const loadTemplates = async () => {
    const response = await fetch(apiRoot + '/templates', { signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to load templates');
    templates = Array.isArray(payload?.templates) ? payload.templates : [];
    renderTemplateSelect();
  };

  const loadClasses = async () => {
    const response = await fetch(apiRoot + '/classes', { signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to load classes');
    classes = Array.isArray(payload?.classes) ? payload.classes : [];
    renderClassSelect();
    renderSubjects();
  };

  const loadSubjects = async () => {
    const response = await fetch(apiRoot + '/subjects', { signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to load subjects');
    subjects = Array.isArray(payload?.subjects) ? payload.subjects : [];
    renderSubjects();
  };

  const reloadAll = async () => {
    setMsg('Loading subjects...');
    const errors = [];
    const collectError = (error) => {
      if (error?.name === 'AbortError') throw error;
      errors.push(error);
    };
    try {
      await Promise.all([
        loadTemplates().catch(collectError),
        loadClasses().catch(collectError),
        loadSubjects().catch(collectError),
      ]);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      errors.push(error);
    }

    if (!errors.length) {
      setMsg('');
      return;
    }

    const primaryError = errors[0];
    setMsg(primaryError?.message || 'Unable to load module data');
    if (!Array.isArray(subjects) || !subjects.length) {
      rowsEl.innerHTML = '<tr><td colspan="6" class="sub-empty">Unable to load subjects.</td></tr>';
    }
  };

  const updateSubjectMeta = async (row, options = {}) => {
    const subjectId = Number(row?.getAttribute('data-subject-id') || 0);
    if (!subjectId) return;
    const saveSeq = Number(subjectSaveSequence.get(subjectId) || 0) + 1;
    subjectSaveSequence.set(subjectId, saveSeq);

    const nameInput = row.querySelector('[data-field="subjectName"]');
    const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
    const typedName = String(nameInput?.value || '').trim();
    const name = typedName || savedName;
    const classInput = row.querySelector('[data-field="subjectClass"]');
    const savedClassId = Number(classInput?.getAttribute('data-saved-value') || 0);
    const chosenClassId = Number(classInput?.value || savedClassId || 0);
    if (!name) {
      throw new Error('Subject name is required');
    }
    if (!Number.isInteger(chosenClassId) || chosenClassId <= 0) {
      throw new Error('Class is required');
    }

    const payload = { name, classId: chosenClassId };
    if (options.file) payload.imageData = await fileToDataUrl(options.file);
    if (options.clear) payload.clearImage = true;

    if (!options.file && !options.clear) {
      if (name.length < 2) throw new Error('Subject name must be at least 2 characters');
      if (name === savedName && chosenClassId === savedClassId) return;
      if (nameInput) nameInput.classList.add('is-syncing');
      if (classInput) classInput.classList.add('is-syncing');
    }

    setMsg(options.clear ? 'Removing subject image...' : (options.file ? 'Uploading subject image...' : 'Syncing subject...'));
    const response = await fetch(apiRoot + '/subjects/' + subjectId, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (nameInput) nameInput.classList.remove('is-syncing');
      if (classInput) classInput.classList.remove('is-syncing');
      throw new Error(body?.error || 'Unable to update subject');
    }
    if (Number(subjectSaveSequence.get(subjectId) || 0) !== saveSeq) return;

    const persistedName = String(body?.subject?.name || name);
    const persistedClassId = Number(body?.subject?.classId || chosenClassId || savedClassId || 0);
    if (nameInput && persistedName) {
      nameInput.value = persistedName;
      nameInput.setAttribute('data-saved-value', persistedName);
      nameInput.classList.remove('is-syncing');
      const deleteBtn = row.querySelector('[data-action="delete-subject"]');
      if (deleteBtn) deleteBtn.setAttribute('data-subject-name', persistedName);
    }
    if (classInput && persistedClassId > 0) {
      classInput.value = String(persistedClassId);
      classInput.setAttribute('data-saved-value', String(persistedClassId));
      classInput.classList.remove('is-syncing');
    }

    if (options.file || options.clear) {
      await loadSubjects();
    }
    setMsg('Subject synced.');
    showToast(options.file || options.clear ? 'Image synced' : 'Subject synced', 'success');
  };

  openBtn.addEventListener('click', openModal, { signal: controller.signal });
  cancelBtn.addEventListener('click', closeModal, { signal: controller.signal });
  createImageSlot.addEventListener('click', () => createImageInput.click(), { signal: controller.signal });
  createImageInput.addEventListener('change', syncCreateImageUi, { signal: controller.signal });
  createImageRemove.addEventListener('click', () => {
    createImageInput.value = '';
    syncCreateImageUi();
  }, { signal: controller.signal });
  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl) closeModal();
  }, { signal: controller.signal });

  rowsEl.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (actionEl) {
      const action = String(actionEl.getAttribute('data-action') || '');
      const subjectId = Number(actionEl.getAttribute('data-subject-id') || 0);
      const row = subjectId > 0 ? rowsEl.querySelector('tr[data-subject-id="' + subjectId + '"]') : actionEl.closest('tr[data-subject-id]');

      if (action === 'pick-subject-image') {
        const input = row?.querySelector('[data-field="subjectImageFile"]');
        if (input) input.click();
        return;
      }

      if (action === 'remove-subject-image') {
        updateSubjectMeta(row, { clear: true }).catch((error) => {
          if (error?.name === 'AbortError') return;
          setMsg(error?.message || 'Unable to remove subject image');
        });
        return;
      }

      if (action === 'delete-subject') {
        const name = String(actionEl.getAttribute('data-subject-name') || 'subject').trim();
        if (!window.confirm('Delete "' + name + '"? This will remove all chapters, topics, and contents under this subject.')) return;
        setMsg('Deleting subject...');
        fetch(apiRoot + '/subjects/' + subjectId, {
          method: 'DELETE',
          signal: controller.signal,
        }).then(async (response) => {
          const body = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(body?.error || 'Unable to delete subject');
          await loadSubjects();
          setMsg('Subject deleted.');
          showToast('Subject deleted', 'success');
        }).catch((error) => {
          if (error?.name === 'AbortError') return;
          setMsg(error?.message || 'Unable to delete subject');
        });
        return;
      }
    }

    if (isInteractiveTarget(event.target)) return;
    const row = event.target.closest('tr[data-subject-href]');
    if (!row) return;
    const href = String(row.getAttribute('data-subject-href') || '');
    if (!href) return;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(href);
      return;
    }
    window.location.href = href;
  }, { signal: controller.signal });

  rowsEl.addEventListener('keydown', (event) => {
    const input = event.target.closest('input[data-field="subjectName"]');
    if (!input) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      input.blur();
      return;
    }
    if (event.key === 'Escape') {
      const savedName = String(input.getAttribute('data-saved-value') || '').trim();
      input.value = savedName;
      input.classList.remove('is-syncing');
      input.blur();
    }
  }, { signal: controller.signal });

  rowsEl.addEventListener('focusout', (event) => {
    const input = event.target.closest('input[data-field="subjectName"]');
    if (!input) return;
    const row = input.closest('tr[data-subject-id]');
    if (!row) return;
    const subjectId = Number(row.getAttribute('data-subject-id') || 0);
    if (!subjectId) return;

    const nextName = String(input.value || '').trim();
    const savedName = String(input.getAttribute('data-saved-value') || '').trim();
    if (!nextName || nextName.length < 2 || nextName === savedName) return;

    input.classList.add('is-syncing');
    setMsg('Syncing...');
    updateSubjectMeta(row).catch((error) => {
      if (error?.name === 'AbortError') return;
      input.classList.remove('is-syncing');
      setMsg(error?.message || 'Unable to update subject name');
    });
  }, { signal: controller.signal });

  rowsEl.addEventListener('change', (event) => {
    const classInput = event.target.closest('select[data-field="subjectClass"]');
    if (classInput) {
      const row = classInput.closest('tr[data-subject-id]');
      const subjectId = Number(row?.getAttribute('data-subject-id') || 0);
      if (!row || !subjectId) return;
      const nextClassId = Number(classInput.value || 0);
      const savedClassId = Number(classInput.getAttribute('data-saved-value') || 0);
      if (nextClassId === savedClassId) return;
      classInput.classList.add('is-syncing');
      updateSubjectMeta(row).catch((error) => {
        if (error?.name === 'AbortError') return;
        classInput.classList.remove('is-syncing');
        setMsg(error?.message || 'Unable to update subject class');
      });
      return;
    }

    const input = event.target.closest('input[data-field="subjectImageFile"]');
    if (!input) return;
    const subjectId = Number(input.getAttribute('data-subject-id') || 0);
    const row = subjectId > 0 ? rowsEl.querySelector('tr[data-subject-id="' + subjectId + '"]') : input.closest('tr[data-subject-id]');
    const file = input.files && input.files[0] ? input.files[0] : null;
    if (!file) return;
    updateSubjectMeta(row, { file }).catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to update subject image');
    }).finally(() => {
      input.value = '';
    });
  }, { signal: controller.signal });

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(formEl);
    const imageFile = createImageInput.files?.[0] || null;
    const payload = {
      name: String(formData.get('name') || ''),
      classId: Number(formData.get('classId') || 0),
      templateId: Number(formData.get('templateId') || 0),
    };
    if (imageFile && imageFile.size > 0) {
      payload.imageData = await fileToDataUrl(imageFile);
    }

    setMsg('Creating subject...');
    try {
      const response = await fetch(apiRoot + '/subjects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || 'Unable to create subject');
      closeModal();
      await loadSubjects();
      setMsg('Subject created successfully.');
      showToast('Subject created', 'success');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to create subject');
    }
  }, { signal: controller.signal });

  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => {
      clearCreatePreviewUrl();
    });
  }

  syncCreateImageUi();
  reloadAll();
})();
`;
}
