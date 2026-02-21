export const appScript = `
const shell = document.querySelector('[data-shell]');
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
const mobileToggle = document.querySelector('[data-mobile-toggle]');
const overlay = document.querySelector('[data-overlay]');
const profileMenu = document.querySelector('[data-profile-menu]');
const profileTrigger = profileMenu?.querySelector('[data-profile-trigger]');
const profilePopup = profileMenu?.querySelector('[data-profile-popup]');
const sidebarStateKey = 'freeducation.sidebar.collapsed';
const mobileViewport = window.matchMedia('(max-width: 840px)');

function readSidebarCollapsedState() {
  try {
    return window.localStorage.getItem(sidebarStateKey) === '1';
  } catch {
    return false;
  }
}

function writeSidebarCollapsedState(isCollapsed) {
  try {
    window.localStorage.setItem(sidebarStateKey, isCollapsed ? '1' : '0');
  } catch {
    // no-op when storage is unavailable
  }
}

function syncSidebarToggleLabel(isCollapsed) {
  if (!sidebarToggle) return;
  const expanded = !isCollapsed;
  sidebarToggle.setAttribute('aria-expanded', String(expanded));
  sidebarToggle.setAttribute('aria-label', expanded ? 'Collapse sidebar' : 'Expand sidebar');
}

function initializeRichEditors() {
  document.querySelectorAll('[data-rich-editor]').forEach((editor) => {
    if (editor.dataset.bound === '1') return;
    const input = editor.querySelector('[data-editor-input]');
    const storage = editor.querySelector('[data-editor-storage]');
    const preview = editor.querySelector('[data-editor-preview]');
    if (!input || !storage) return;

    const sync = () => {
      const html = input.innerHTML.trim();
      storage.value = html;
      if (preview) preview.innerHTML = html || '<p class="muted">Nothing to preview yet.</p>';
    };

    const refreshToolStates = () => {
      editor.querySelectorAll('[data-editor-command]').forEach((button) => {
        const command = button.getAttribute('data-editor-command');
        const value = button.getAttribute('data-editor-value');
        let isActive = false;
        if (command === 'formatBlock' && value) {
          const current = (document.queryCommandValue('formatBlock') || '').replace(/[<>]/g, '').toLowerCase();
          isActive = current === value.toLowerCase();
        } else if (command === 'createLink') {
          isActive = Boolean(document.queryCommandState('createLink'));
        } else {
          isActive = Boolean(document.queryCommandState(command));
        }
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const activateTab = (mode) => {
      const isPreview = mode === 'preview';
      editor.classList.toggle('preview-mode', isPreview);
      if (preview) preview.hidden = !isPreview;
      input.hidden = isPreview;
      editor.querySelectorAll('[data-editor-tab]').forEach((tab) => {
        const active = tab.getAttribute('data-editor-tab') === mode;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
    };

    editor.querySelectorAll('[data-editor-command]').forEach((button) => {
      button.addEventListener('click', () => {
        const command = button.getAttribute('data-editor-command');
        let value = button.getAttribute('data-editor-value') || null;
        const promptText = button.getAttribute('data-editor-prompt');
        if (promptText) {
          value = window.prompt(promptText, 'https://') || null;
          if (!value) return;
        }

        input.focus();
        document.execCommand(command, false, value);
        sync();
        refreshToolStates();
      });
    });

    editor.querySelectorAll('[data-editor-image-float]').forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.getAttribute('data-editor-image-float') || 'none';
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        let node = selection.anchorNode;
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        const image = node?.closest ? node.closest('img') : null;
        if (!image) return;
        if (mode === 'left') {
          image.style.cssFloat = 'left';
          image.style.margin = '0 12px 8px 0';
        } else if (mode === 'right') {
          image.style.cssFloat = 'right';
          image.style.margin = '0 0 8px 12px';
        } else {
          image.style.cssFloat = 'none';
          image.style.margin = '8px 0';
          image.style.display = 'inline-block';
        }
        sync();
      });
    });

    editor.querySelectorAll('[data-editor-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        activateTab(tab.getAttribute('data-editor-tab') || 'write');
      });
    });

    input.addEventListener('input', () => {
      sync();
      refreshToolStates();
    });
    input.addEventListener('keyup', refreshToolStates);
    input.addEventListener('mouseup', refreshToolStates);
    input.addEventListener('focus', refreshToolStates);
    document.addEventListener('selectionchange', () => {
      if (!editor.contains(document.activeElement)) return;
      refreshToolStates();
    });
    sync();
    refreshToolStates();
    activateTab('write');
    editor.dataset.bound = '1';
  });
}

function initializeAddFormToggles() {
  const isMobile = window.matchMedia('(max-width: 840px)').matches;
  document.querySelectorAll('[data-add-form-shell]').forEach((shell) => {
    const toggle = shell.querySelector('[data-add-form-toggle]');
    const panel = shell.querySelector('[data-add-form-panel]');
    if (!toggle || !panel) return;

    const label = toggle.getAttribute('data-add-form-label') || 'form';
    const setExpanded = (expanded) => {
      shell.classList.toggle('form-expanded', expanded);
      panel.hidden = !expanded;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? 'Hide ' + label : 'Add ' + label;
      if (expanded && isMobile) {
        const firstInput = panel.querySelector('input, textarea, [contenteditable="true"]');
        if (firstInput && typeof firstInput.focus === 'function') {
          firstInput.focus({ preventScroll: true });
        }
        panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    };

    if (shell.dataset.bound !== '1') {
      toggle.addEventListener('click', () => {
        setExpanded(!shell.classList.contains('form-expanded'));
      });
      shell.dataset.bound = '1';
    }

    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  });
}


function initializeContentModals() {
  const closeDialog = (dialog) => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  const closeAllContentModals = (exceptDialog) => {
    document.querySelectorAll('dialog[data-content-modal]').forEach((dialog) => {
      if (dialog === exceptDialog || !dialog.hasAttribute('open')) return;
      closeDialog(dialog);
    });
  };

  document.querySelectorAll('[data-content-modal-open]').forEach((button) => {
    if (button.dataset.bound === '1') return;
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-content-modal-open');
      if (!modalId) return;
      const dialog = document.querySelector('[data-content-modal="' + modalId + '"]');
      if (!dialog) return;
      closeAllContentModals(dialog);
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'open');
      }
    });
    button.dataset.bound = '1';
  });

  document.querySelectorAll('[data-content-modal-close]').forEach((button) => {
    if (button.dataset.bound === '1') return;
    button.addEventListener('click', () => {
      const dialog = button.closest('dialog');
      closeDialog(dialog);
    });
    button.dataset.bound = '1';
  });

  document.querySelectorAll('dialog[data-content-modal]').forEach((dialog) => {
    if (dialog.dataset.bound === '1') return;
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        closeDialog(dialog);
      }
    });
    dialog.dataset.bound = '1';
  });
}

function initializeFileIndicators() {
  document.querySelectorAll('.js-file-indicator-input').forEach((input) => {
    if (input.dataset.boundFileIndicator === '1') return;
    const targetId = input.dataset.fileIndicatorTarget;
    const status = targetId ? document.getElementById(targetId) : null;
    if (!status) return;

    const syncStatus = () => {
      const selected = input.files && input.files[0] ? input.files[0].name : '';
      status.textContent = selected || 'No image selected';
      status.dataset.tone = selected ? 'ready' : 'idle';
    };

    input.addEventListener('change', syncStatus);
    syncStatus();
    input.dataset.boundFileIndicator = '1';
  });
}

function initializeImageSlots() {
  document.querySelectorAll('[data-image-slot]').forEach((slot) => {
    if (slot.dataset.boundImageSlot === '1') return;
    const input = slot.querySelector('[data-image-slot-input]');
    const uploadButton = slot.querySelector('[data-image-slot-upload]');
    const seeButton = slot.querySelector('[data-image-slot-see]');
    const removeButton = slot.querySelector('[data-image-slot-remove-action]');
    const removeInput = slot.querySelector('[data-image-slot-remove]');
    const trigger = slot.querySelector('[data-image-slot-trigger]');
    const previewLarge = slot.querySelector('.image-slot-preview-large');
    if (!input || !uploadButton || !removeInput) return;

    const defaultIconMarkup = '<span class="image-slot-icon" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><rect x="2.25" y="3.25" width="15.5" height="13.5" rx="2"></rect><circle cx="7" cy="8" r="1.6"></circle><path d="M4.75 14l3.6-3.9 2.35 2.45 2.35-2.95 2.2 4.4"></path></svg></span>';
    const initialImageSrc = (slot.dataset.imageSlotSrc || '').trim();
    let hasPersistedImage = slot.dataset.imageSlotHasImage === '1' && Boolean(initialImageSrc);
    let previewUrl = '';

    const closeSlotDialog = () => {
      const dialog = uploadButton.closest('dialog[data-content-modal]');
      if (!dialog) return;
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    };

    const renderSlotState = ({ hasImage, src = '' }) => {
      const normalizedSrc = typeof src === 'string' ? src.trim() : '';
      const showImage = Boolean(hasImage && normalizedSrc);
      uploadButton.textContent = showImage ? 'Change image' : 'Upload image';
      if (removeButton) removeButton.hidden = !showImage;
      if (seeButton) seeButton.hidden = !showImage;

      if (previewLarge) {
        previewLarge.hidden = !showImage;
        previewLarge.src = showImage ? normalizedSrc : '';
      }

      slot.dataset.imageSlotHasImage = showImage ? '1' : '0';
      slot.dataset.imageSlotSrc = showImage ? normalizedSrc : '';

      if (!trigger) return;
      if (!showImage) {
        trigger.innerHTML = defaultIconMarkup;
        return;
      }
      trigger.innerHTML = '';
      const img = document.createElement('img');
      img.alt = 'Uploaded image';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = normalizedSrc;
      trigger.appendChild(img);
    };

    const currentImage = slot.querySelector('[data-image-slot-trigger] img');
    const currentImageSrc = (currentImage?.getAttribute('src') || '').trim();
    const effectiveInitialSrc = hasPersistedImage ? initialImageSrc : currentImageSrc;
    hasPersistedImage = Boolean(effectiveInitialSrc);
    renderSlotState({ hasImage: hasPersistedImage, src: effectiveInitialSrc });

    uploadButton.addEventListener('click', () => {
      removeInput.value = '0';
      input.value = '';
      input.click();
      closeSlotDialog();
    });

    if (removeButton) {
      removeButton.addEventListener('click', () => {
        removeInput.value = '1';
        input.value = '';
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          previewUrl = '';
        }
        hasPersistedImage = false;
        renderSlotState({ hasImage: false });
        input.dispatchEvent(new Event('change', { bubbles: true }));
        closeSlotDialog();
      });
    }

    input.addEventListener('change', () => {
      if (input.files && input.files[0]) {
        removeInput.value = '0';
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(input.files[0]);
        renderSlotState({ hasImage: true, src: previewUrl });
      } else if (!hasPersistedImage) {
        renderSlotState({ hasImage: false });
      } else {
        renderSlotState({ hasImage: true, src: initialImageSrc });
      }
    });

    slot.dataset.boundImageSlot = '1';
  });
}

function initializeClassMoveControls() {
  document.querySelectorAll('[data-class-move]').forEach((button) => {
    if (button.dataset.boundClassMove === '1') return;
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      const classId = button.getAttribute('data-class-id');
      const direction = button.getAttribute('data-class-move');
      if (!classId || !direction) return;

      const row = button.closest('[data-class-row]');
      if (!row || !row.parentElement) return;
      const targetRow = direction === 'up' ? row.previousElementSibling : row.nextElementSibling;
      if (!targetRow) return;

      if (direction === 'up') {
        row.parentElement.insertBefore(row, targetRow);
      } else {
        row.parentElement.insertBefore(targetRow, row);
      }

      const body = new FormData();
      body.set('intent', direction === 'up' ? 'move-up' : 'move-down');
      const response = await fetch('/api/classes/' + classId, {
        method: 'POST',
        body,
        credentials: 'same-origin',
      }).catch(() => null);

      if (!response || !response.ok) {
        window.location.reload();
        return;
      }

      window.location.reload();
    });
    button.dataset.boundClassMove = '1';
  });
}

async function refreshLiveRegion(regionName) {
  const response = await fetch(window.location.href, { method: 'GET', credentials: 'same-origin' });
  if (!response.ok) return;
  const html = await response.text();
  const parser = new DOMParser();
  const nextDoc = parser.parseFromString(html, 'text/html');
  const current = document.querySelector('[data-live-region="' + regionName + '"]');
  const incoming = nextDoc.querySelector('[data-live-region="' + regionName + '"]');
  if (!current || !incoming) return;
  current.replaceWith(incoming);
  initializeRichEditors();
  initializeAddFormToggles();
  initializeContentModals();
  initializeFileIndicators();
  initializeImageSlots();
  initializeClassMoveControls();
  initializeFormHandlers();
}

function setAutoSaveStatus(form, message, tone) {
  const formId = form.getAttribute('id');
  if (!formId) return;
  const status = document.querySelector('[data-auto-save-status][form="' + formId + '"]');
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone || 'idle';
}

async function submitLiveForm(form) {
  await prepareImageInputs(form).catch(() => null);
  syncRichEditorStorage(form);
  const body = new FormData(form);
  return submitLiveBody(form, body);
}

function syncRichEditorStorage(form) {
  form.querySelectorAll('[data-rich-editor]').forEach((editor) => {
    const input = editor.querySelector('[data-editor-input]');
    const storage = editor.querySelector('[data-editor-storage]');
    if (input && storage) storage.value = input.innerHTML.trim();
  });
}

async function submitLiveBody(form, body) {
  const response = await fetch(form.action, {
    method: (form.method || 'POST').toUpperCase(),
    body,
    credentials: 'same-origin',
    redirect: 'follow',
  }).catch(() => null);

  if (!response || !response.ok) return false;
  const regionName = String(body.get('liveRegion') || '').trim();
  if (regionName) {
    await refreshLiveRegion(regionName).catch(() => null);
  }
  return true;
}

function getFormFields(form) {
  const fields = new Set(form.querySelectorAll('input, textarea, select'));
  const formId = form.getAttribute('id');
  if (!formId) return Array.from(fields);
  document.querySelectorAll('input[form], textarea[form], select[form]').forEach((field) => {
    if (field.getAttribute('form') === formId) fields.add(field);
  });
  return Array.from(fields);
}

function captureFormState(form) {
  syncRichEditorStorage(form);
  const body = new FormData(form);
  const pairs = [];
  for (const [name, value] of body.entries()) {
    if (value instanceof File) {
      pairs.push(name + '=[file:' + value.name + ':' + value.size + ':' + value.type + ':no-last-mod]');
      continue;
    }
    pairs.push(name + '=' + String(value));
  }
  pairs.sort();
  return pairs.join('&');
}

function initializeFormHandlers() {
  const scheduleAutoSave = (form, delayMs = 700) => {
    const nextState = captureFormState(form);
    if (nextState === (form.dataset.autoSaveSyncedState || '')) {
      setAutoSaveStatus(form, 'Synced', 'success');
      return;
    }

    const timerKey = Number(form.dataset.autoSaveTimer || '0');
    if (timerKey) {
      window.clearTimeout(timerKey);
    }
    setAutoSaveStatus(form, 'Saving…', 'working');
    const nextTimer = window.setTimeout(async () => {
      form.dataset.autoSaveTimer = '0';
      const stateBeforeSave = captureFormState(form);
      if (stateBeforeSave === (form.dataset.autoSaveSyncedState || '')) {
        setAutoSaveStatus(form, 'Synced', 'success');
        return;
      }
      if (form.dataset.submitting === '1') {
        form.dataset.autoSaveQueued = '1';
        return;
      }
      form.dataset.submitting = '1';
      await prepareImageInputs(form).catch(() => null);
      syncRichEditorStorage(form);
      const body = new FormData(form);
      const submittedState = captureFormState(form);
      const ok = await submitLiveBody(form, body);
      form.dataset.submitting = '0';
      if (ok) {
        form.dataset.autoSaveSyncedState = submittedState;
      }

      const latestState = captureFormState(form);
      if (latestState !== (form.dataset.autoSaveSyncedState || '')) {
        setAutoSaveStatus(form, ok ? 'Unsynced changes' : 'Retry needed', 'error');
        if (ok || form.dataset.autoSaveQueued === '1') {
          form.dataset.autoSaveQueued = '0';
          scheduleAutoSave(form, 0);
          return;
        }
      }

      setAutoSaveStatus(form, ok ? 'Synced' : 'Retry needed', ok ? 'success' : 'error');
    }, delayMs);
    form.dataset.autoSaveTimer = String(nextTimer);
  };

  document.querySelectorAll('form[enctype="multipart/form-data"], form').forEach((form) => {
    if (form.dataset.bound === '1') return;
    const isAutoSaveForm = form.dataset.autoSave === 'true';

    if (isAutoSaveForm) {
      getFormFields(form).forEach((field) => {
        if (field.matches('input[type="file"], input[type="checkbox"], select')) {
          field.addEventListener('change', () => scheduleAutoSave(form, 0));
          return;
        }
        field.addEventListener('input', () => scheduleAutoSave(form));
        field.addEventListener('blur', () => scheduleAutoSave(form, 0));
      });
      form.dataset.autoSaveSyncedState = captureFormState(form);
      form.dataset.autoSaveQueued = '0';
      setAutoSaveStatus(form, 'Synced', 'success');
    }

    form.addEventListener('submit', async (event) => {
      if (form.dataset.submitting === '1') return;
      if (isAutoSaveForm) {
        event.preventDefault();
        scheduleAutoSave(form, 0);
        return;
      }

      const hasLiveButton = Boolean(form.querySelector('[data-live-form="true"]'));
      const isMultipartForm = form.matches('[enctype="multipart/form-data"]');
      if (!hasLiveButton && !isMultipartForm) return;

      event.preventDefault();
      form.dataset.submitting = '1';

      if (isMultipartForm) {
        await prepareImageInputs(form).catch(() => null);
      }

      if (!hasLiveButton) {
        form.dataset.submitting = '0';
        form.submit();
        return;
      }

      const ok = await submitLiveForm(form);

      form.dataset.submitting = '0';
      if (!ok) {
        form.submit();
      }
    });
    form.dataset.bound = '1';
  });
}

async function readImageDimensions(file) {
  if (typeof createImageBitmap === 'function') {
    const sourceBitmap = await createImageBitmap(file);
    return {
      width: sourceBitmap.width,
      height: sourceBitmap.height,
      release: () => {
        if (typeof sourceBitmap.close === 'function') sourceBitmap.close();
      },
      draw(ctx, width, height) {
        ctx.drawImage(sourceBitmap, 0, 0, width, height);
      },
    };
  }

  const imageUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = 'async';

  await new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Unable to decode image.'));
    image.src = imageUrl;
  });

  return {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
    release: () => URL.revokeObjectURL(imageUrl),
    draw(ctx, width, height) {
      ctx.drawImage(image, 0, 0, width, height);
    },
  };
}

async function downscaleImageFile(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;

  const maxEdge = 240;
  const source = await readImageDimensions(file);
  const longestEdge = Math.max(source.width, source.height);
  const scale = longestEdge > maxEdge ? maxEdge / longestEdge : 1;
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    source.release();
    return file;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  source.draw(ctx, width, height);
  source.release();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.7));
  if (!blob) return file;

  const targetName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], targetName + '.webp', { type: 'image/webp', lastModified: Date.now() });
}

async function prepareImageInputs(form) {
  const fileInputs = Array.from(form.querySelectorAll('input[type="file"]'));
  const imageInputs = fileInputs.filter((input) => {
    const selected = input.files;
    if (!selected || selected.length === 0) return false;
    return Array.from(selected).some((file) => file.type.startsWith('image/'));
  });

  for (const input of imageInputs) {
    const files = Array.from(input.files || []);
    const optimized = await Promise.all(files.map((file) => downscaleImageFile(file)));
    const dataTransfer = new DataTransfer();
    optimized.forEach((file) => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
  }
}

if (!shell) {
  // no-op when app shell is not present
} else {
  let hoverExpanded = false;
  let preferredCollapsed = readSidebarCollapsedState();

  const applySidebarViewportMode = () => {
    if (mobileViewport.matches) {
      shell.classList.remove('collapsed', 'hover-expanded');
      hoverExpanded = false;
      syncSidebarToggleLabel(false);
      return;
    }
    shell.classList.toggle('collapsed', preferredCollapsed);
    shell.classList.remove('hover-expanded');
    hoverExpanded = false;
    syncSidebarToggleLabel(preferredCollapsed);
  };

  applySidebarViewportMode();
  if (typeof mobileViewport.addEventListener === 'function') {
    mobileViewport.addEventListener('change', applySidebarViewportMode);
  } else if (typeof mobileViewport.addListener === 'function') {
    mobileViewport.addListener(applySidebarViewportMode);
  }

  if(sidebarToggle){
    sidebarToggle.addEventListener('click', ()=>{
      if (mobileViewport.matches) {
        shell.classList.remove('collapsed', 'hover-expanded');
        hoverExpanded = false;
        syncSidebarToggleLabel(false);
        return;
      }
      shell.classList.toggle('collapsed');
      shell.classList.remove('hover-expanded');
      hoverExpanded = false;
      const isCollapsed = shell.classList.contains('collapsed');
      preferredCollapsed = isCollapsed;
      writeSidebarCollapsedState(isCollapsed);
      syncSidebarToggleLabel(isCollapsed);
    });
  }

  if(sidebar){
    sidebar.addEventListener('mouseenter', ()=>{
      if (window.innerWidth <= 840) return;
      if (shell.classList.contains('collapsed')) {
        shell.classList.add('hover-expanded');
        hoverExpanded = true;
      }
    });

    sidebar.addEventListener('mouseleave', ()=>{
      if (window.innerWidth <= 840) return;
      if (hoverExpanded) {
        shell.classList.remove('hover-expanded');
        hoverExpanded = false;
      }
    });
  }

  if(mobileToggle){
    mobileToggle.addEventListener('click', ()=>{
      shell.classList.toggle('mobile-open');
      const open = shell.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
  }

  if(overlay){
    overlay.addEventListener('click', ()=>{
      shell.classList.remove('mobile-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  }

  if (profileMenu && profileTrigger && profilePopup) {
    const closeProfilePopup = () => {
      profilePopup.hidden = true;
      profileTrigger.setAttribute('aria-expanded', 'false');
    };

    closeProfilePopup();

    profileTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = !profilePopup.hidden;
      profilePopup.hidden = isOpen;
      profileTrigger.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (event) => {
      if (profileMenu.contains(event.target)) return;
      closeProfilePopup();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeProfilePopup();
    });
  }

  document.querySelectorAll('[data-expand]').forEach((el)=>{
    el.addEventListener('click', ()=>{
      const block = el.closest('.menu-block');
      block?.classList.toggle('open');
      el.setAttribute('aria-expanded', String(block?.classList.contains('open')));
    });
  });

  document.querySelectorAll('.sidebar a').forEach((link)=>{
    link.addEventListener('click', ()=>{
      shell.classList.remove('mobile-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  });

  initializeRichEditors();
  initializeAddFormToggles();
  initializeContentModals();
  initializeFileIndicators();
  initializeImageSlots();
  initializeClassMoveControls();
  initializeFormHandlers();
}
`;
