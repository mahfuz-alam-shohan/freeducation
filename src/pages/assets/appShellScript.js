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
  document.querySelectorAll('[data-content-modal-open]').forEach((button) => {
    if (button.dataset.bound === '1') return;
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-content-modal-open');
      if (!modalId) return;
      const dialog = document.querySelector('[data-content-modal="' + modalId + '"]');
      if (!dialog) return;
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
      if (!dialog) return;
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    });
    button.dataset.bound = '1';
  });

  document.querySelectorAll('dialog[data-content-modal]').forEach((dialog) => {
    if (dialog.dataset.bound === '1') return;
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      }
    });
    dialog.dataset.bound = '1';
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
  initializeFormHandlers();
}

function initializeFormHandlers() {
  document.querySelectorAll('form[enctype="multipart/form-data"], form').forEach((form) => {
    if (form.dataset.bound === '1') return;
    form.addEventListener('submit', async (event) => {
      if (form.dataset.submitting === '1') return;
      const hasLiveButton = Boolean(form.querySelector('[data-live-form="true"]'));
      if (!hasLiveButton && !form.matches('[enctype="multipart/form-data"]')) return;

      event.preventDefault();
      form.dataset.submitting = '1';
      await prepareImageInputs(form).catch(() => null);
      form.querySelectorAll('[data-rich-editor]').forEach((editor) => {
        const input = editor.querySelector('[data-editor-input]');
        const storage = editor.querySelector('[data-editor-storage]');
        if (input && storage) storage.value = input.innerHTML.trim();
      });

      if (!hasLiveButton) {
        form.dataset.submitting = '0';
        form.submit();
        return;
      }

      const body = new FormData(form);
      const response = await fetch(form.action, {
        method: (form.method || 'POST').toUpperCase(),
        body,
        credentials: 'same-origin',
        redirect: 'follow',
      }).catch(() => null);

      form.dataset.submitting = '0';
      if (!response || !response.ok) {
        form.submit();
        return;
      }

      const regionName = String(body.get('liveRegion') || '').trim();
      if (regionName) {
        await refreshLiveRegion(regionName).catch(() => null);
      }
    });
    form.dataset.bound = '1';
  });
}

async function downscaleImageFile(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  const bitmap = await createImageBitmap(file);
  const maxEdge = 960;
  const longestEdge = Math.max(bitmap.width, bitmap.height);
  const scale = longestEdge > maxEdge ? maxEdge / longestEdge : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.72));
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
  initializeFormHandlers();
}
`;
