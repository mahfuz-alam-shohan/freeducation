export const appScript = `
const shell = document.querySelector('[data-shell]');
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
const mobileToggle = document.querySelector('[data-mobile-toggle]');
const overlay = document.querySelector('[data-overlay]');
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


function slugifyTemplateKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[_\-]+|[_\-]+$/g, '')
    .slice(0, 140);
}

function initializeTemplateBuilder() {
  document.querySelectorAll('[data-template-builder]').forEach((form) => {
    if (form.dataset.bound === '1') return;
    const rowsHost = form.querySelector('[data-template-builder-rows]');
    const addBtn = form.querySelector('[data-template-builder-add]');
    const storage = form.querySelector('[data-template-builder-storage]');
    const treeHost = form.querySelector('[data-template-builder-tree]');
    const healthHost = form.querySelector('[data-template-builder-health]');
    const presetSelect = form.querySelector('[data-template-builder-preset]');
    const generateBtn = form.querySelector('[data-template-builder-generate]');
    const focusInput = form.querySelector('[data-template-builder-focus]');
    const depthSelect = form.querySelector('[data-template-builder-depth]');
    if (!rowsHost || !addBtn || !storage) return;

    const presetSeeds = {
      exam: [
        { serverName: 'Core Topics', nodeKey: 'core_topics', nodeType: 'section', supportsEdit: true, supportsImage: true },
        { serverName: 'Chapter Tests', nodeKey: 'chapter_tests', nodeType: 'content', contentKind: 'CQ Bank' },
        { serverName: 'Objective Tests', nodeKey: 'objective_tests', nodeType: 'content', contentKind: 'MCQ Bank' },
      ],
      concept: [
        { serverName: 'Concept Blocks', nodeKey: 'concept_blocks', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true },
        { serverName: 'Learning Notes', nodeKey: 'learning_notes', nodeType: 'content', contentKind: 'Short Notes' },
        { serverName: 'Activities', nodeKey: 'activities', nodeType: 'content', contentKind: 'Activities' },
      ],
      language: [
        { serverName: 'Literature', nodeKey: 'literature', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true },
        { serverName: 'Grammar', nodeKey: 'grammar', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true },
        { serverName: 'Comprehension', nodeKey: 'comprehension', nodeType: 'content', contentKind: 'Short Notes' },
      ],
    };

    const smartTemplateBlueprint = (focus, depthTarget = 5) => {
      const safeFocus = focus || 'Subject';
      const depth = Math.max(3, Math.min(Number(depthTarget || 5), 6));
      const rootId = 'node_' + Math.random().toString(36).slice(2, 9);
      const unitId = 'node_' + Math.random().toString(36).slice(2, 9);
      const lessonId = 'node_' + Math.random().toString(36).slice(2, 9);
      const nodes = [
        { clientId: rootId, serverName: safeFocus + ' Foundations', nodeKey: slugifyTemplateKey(safeFocus + '_foundations'), nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true },
        { clientId: unitId, parentClientId: rootId, serverName: 'Core Units', nodeKey: 'core_units', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true },
        { clientId: lessonId, parentClientId: unitId, serverName: 'Lesson Concepts', nodeKey: 'lesson_concepts', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: depth >= 5 },
      ];

      const contentMatrix = [
        { name: 'Short Notes', key: 'short_notes' },
        { name: 'CQ Bank', key: 'cq_bank' },
        { name: 'MCQ Bank', key: 'mcq_bank' },
        { name: 'Worked Examples', key: 'worked_examples' },
      ];

      contentMatrix.forEach((entry) => {
        nodes.push({
          clientId: 'node_' + Math.random().toString(36).slice(2, 9),
          parentClientId: lessonId,
          serverName: entry.name,
          nodeKey: entry.key,
          nodeType: 'content',
          contentKind: entry.name,
          supportsEdit: true,
          supportsImage: true,
          supportsChapters: false,
        });
      });

      if (depth >= 5) {
        const practiceId = 'node_' + Math.random().toString(36).slice(2, 9);
        nodes.push({ clientId: practiceId, parentClientId: unitId, serverName: 'Practice Ladder', nodeKey: 'practice_ladder', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true });
        ['Drills', 'Mixed Review', 'Previous Questions'].forEach((name) => {
          nodes.push({ clientId: 'node_' + Math.random().toString(36).slice(2, 9), parentClientId: practiceId, serverName: name, nodeKey: slugifyTemplateKey(name), nodeType: 'content', contentKind: name, supportsEdit: true, supportsImage: true, supportsChapters: false });
        });
      }

      if (depth >= 6) {
        const masteryId = 'node_' + Math.random().toString(36).slice(2, 9);
        nodes.push({ clientId: masteryId, parentClientId: rootId, serverName: 'Mastery + Diagnostics', nodeKey: 'mastery_diagnostics', nodeType: 'section', supportsEdit: true, supportsImage: true, supportsChapters: true });
        ['Skill Gaps', 'Revision Tracker', 'Challenge Tasks'].forEach((name) => {
          nodes.push({ clientId: 'node_' + Math.random().toString(36).slice(2, 9), parentClientId: masteryId, serverName: name, nodeKey: slugifyTemplateKey(name), nodeType: 'content', contentKind: name, supportsEdit: true, supportsImage: true, supportsChapters: false });
        });
      }

      return nodes;
    };

    const rowTemplate = (id) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-builder-row', id);
      tr.innerHTML = '<td><input class="input" data-field="serverName" maxlength="140" placeholder="Stories" required /></td>' +
        '<td><input class="input" data-field="nodeKey" maxlength="140" placeholder="stories" required /></td>' +
        '<td><select class="select" data-field="parent"><option value="">Root</option></select></td>' +
        '<td><select class="select" data-field="nodeType"><option value="section">Section</option><option value="content">Content</option></select></td>' +
        '<td><input class="input" data-field="contentKind" maxlength="80" placeholder="CQ Bank" /></td>' +
        '<td><div class="template-options">' +
          '<label><input type="checkbox" data-field="supportsEdit" checked /> Editable</label>' +
          '<label><input type="checkbox" data-field="supportsImage" checked /> Image</label>' +
          '<label><input type="checkbox" data-field="supportsChapters" /> Chapters</label>' +
        '</div></td>' +
        '<td class="template-row-actions"><div class="toolbar-group">' +
          '<button type="button" class="btn btn-secondary" data-row-up>↑</button>' +
          '<button type="button" class="btn btn-secondary" data-row-down>↓</button>' +
          '<button type="button" class="btn btn-secondary" data-row-duplicate>Copy</button>' +
          '<button type="button" class="btn btn-danger" data-row-remove>Remove</button>' +
        '</div></td>';
      return tr;
    };

    const updateTypeState = (row) => {
      const type = row.querySelector('[data-field="nodeType"]')?.value;
      const contentKind = row.querySelector('[data-field="contentKind"]');
      const chapterInput = row.querySelector('[data-field="supportsChapters"]');
      if (!contentKind || !chapterInput) return;
      if (type === 'content') {
        contentKind.required = true;
      } else {
        contentKind.required = false;
        contentKind.value = '';
      }
    };

    const serializeRows = () => Array.from(rowsHost.querySelectorAll('[data-builder-row]')).map((row, index) => ({
      clientId: row.getAttribute('data-builder-row') || '',
      parentClientId: row.querySelector('[data-field="parent"]')?.value || null,
      serverName: row.querySelector('[data-field="serverName"]')?.value?.trim() || '',
      nodeKey: slugifyTemplateKey(row.querySelector('[data-field="nodeKey"]')?.value || ''),
      nodeType: row.querySelector('[data-field="nodeType"]')?.value || 'section',
      contentKind: row.querySelector('[data-field="contentKind"]')?.value?.trim() || '',
      supportsEdit: Boolean(row.querySelector('[data-field="supportsEdit"]')?.checked),
      supportsImage: Boolean(row.querySelector('[data-field="supportsImage"]')?.checked),
      supportsChapters: Boolean(row.querySelector('[data-field="supportsChapters"]')?.checked),
      sortOrder: index + 1,
    }));

    const renderTree = () => {
      if (!treeHost) return;
      const nodes = serializeRows();
      if (!nodes.length) {
        treeHost.innerHTML = '<li class="muted">No nodes yet.</li>';
        return;
      }
      const childrenByParent = new Map();
      nodes.forEach((node) => {
        const key = node.parentClientId || 'root';
        const list = childrenByParent.get(key) || [];
        list.push(node);
        childrenByParent.set(key, list);
      });
      const renderLevel = (parent) => {
        const list = childrenByParent.get(parent) || [];
        if (!list.length) return '';
        return '<ol>' + list.map((node) => '<li><span>' + (node.serverName || 'Untitled').replace(/</g, '&lt;').replace(/>/g, '&gt;') + ' <small class="muted">(' + (node.nodeType === 'content' ? 'Content' : 'Section') + ')</small></span>' + renderLevel(node.clientId) + '</li>').join('') + '</ol>';
      };
      treeHost.innerHTML = renderLevel('root') || '<li class="muted">No root nodes found.</li>';
    };

    const analyzeTemplate = () => {
      if (!healthHost) return;
      const nodes = serializeRows();
      if (!nodes.length) {
        healthHost.innerHTML = '<li class="muted">No nodes yet.</li>';
        return;
      }
      const childrenByParent = new Map();
      nodes.forEach((node) => {
        const key = node.parentClientId || 'root';
        const list = childrenByParent.get(key) || [];
        list.push(node.clientId);
        childrenByParent.set(key, list);
      });

      const depthFor = (id, seen = new Set()) => {
        if (seen.has(id)) return 0;
        seen.add(id);
        const children = childrenByParent.get(id) || [];
        if (!children.length) return 1;
        return 1 + Math.max(...children.map((child) => depthFor(child, new Set(seen))));
      };

      const rootNodes = childrenByParent.get('root') || [];
      const maxDepth = rootNodes.length ? Math.max(...rootNodes.map((id) => depthFor(id))) : 0;
      const contentNodes = nodes.filter((node) => node.nodeType === 'content');
      const chapterNodes = nodes.filter((node) => node.supportsChapters);
      const duplicateKeys = new Set();
      const seenKeys = new Set();
      nodes.forEach((node) => {
        if (!node.nodeKey) return;
        if (seenKeys.has(node.nodeKey)) duplicateKeys.add(node.nodeKey);
        seenKeys.add(node.nodeKey);
      });

      const messages = [];
      messages.push('Nodes: ' + nodes.length + ' | Content nodes: ' + contentNodes.length + ' | Max depth: ' + maxDepth);
      if (maxDepth < 4) messages.push('Increase hierarchy depth to at least 4 levels for richer navigation.');
      if (contentNodes.length < 4) messages.push('Add more content branches (notes, CQ, MCQ, examples) for balanced coverage.');
      if (!chapterNodes.length) messages.push('No chapter-enabled node found. Consider enabling chapters for large subjects.');
      if (duplicateKeys.size) messages.push('Duplicate node keys detected: ' + Array.from(duplicateKeys).join(', '));
      if (messages.length === 1) messages.push('Good structure. You can still add mastery/revision branches for deeper intelligence.');

      healthHost.innerHTML = messages.map((msg) => '<li>' + msg.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</li>').join('');
    };

    const refreshParentOptions = () => {
      const rows = Array.from(rowsHost.querySelectorAll('[data-builder-row]'));
      rows.forEach((row) => {
        const parentSelect = row.querySelector('[data-field="parent"]');
        if (!parentSelect) return;
        const selected = parentSelect.value;
        const rowId = row.getAttribute('data-builder-row');
        const options = ['<option value="">Root</option>'];
        rows.forEach((candidate) => {
          const candidateId = candidate.getAttribute('data-builder-row');
          if (!candidateId || candidateId === rowId) return;
          const label = candidate.querySelector('[data-field="serverName"]')?.value?.trim() || 'Node';
          options.push('<option value="' + candidateId + '">' + label.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</option>');
        });
        parentSelect.innerHTML = options.join('');
        if (selected && selected !== rowId) parentSelect.value = selected;
      });
      renderTree();
      analyzeTemplate();
    };

    const duplicateFromRow = (row) => {
      const current = {
        serverName: row.querySelector('[data-field="serverName"]')?.value || '',
        nodeKey: (row.querySelector('[data-field="nodeKey"]')?.value || '') + '_copy',
        parentClientId: row.querySelector('[data-field="parent"]')?.value || null,
        nodeType: row.querySelector('[data-field="nodeType"]')?.value || 'section',
        contentKind: row.querySelector('[data-field="contentKind"]')?.value || '',
        supportsEdit: Boolean(row.querySelector('[data-field="supportsEdit"]')?.checked),
        supportsImage: Boolean(row.querySelector('[data-field="supportsImage"]')?.checked),
        supportsChapters: Boolean(row.querySelector('[data-field="supportsChapters"]')?.checked),
      };
      addRow(current);
    };

    const bindRow = (row) => {
      const nameInput = row.querySelector('[data-field="serverName"]');
      const keyInput = row.querySelector('[data-field="nodeKey"]');
      const typeInput = row.querySelector('[data-field="nodeType"]');
      const parentInput = row.querySelector('[data-field="parent"]');
      row.querySelector('[data-row-remove]')?.addEventListener('click', () => {
        const rowId = row.getAttribute('data-builder-row');
        row.remove();
        rowsHost.querySelectorAll('[data-field="parent"]').forEach((select) => {
          if (select.value === rowId) select.value = '';
        });
        refreshParentOptions();
      });
      row.querySelector('[data-row-up]')?.addEventListener('click', () => {
        const previous = row.previousElementSibling;
        if (previous) rowsHost.insertBefore(row, previous);
        refreshParentOptions();
      });
      row.querySelector('[data-row-down]')?.addEventListener('click', () => {
        const next = row.nextElementSibling;
        if (next) rowsHost.insertBefore(next, row);
        refreshParentOptions();
      });
      row.querySelector('[data-row-duplicate]')?.addEventListener('click', () => duplicateFromRow(row));

      nameInput?.addEventListener('blur', () => {
        if (!keyInput) return;
        if (!keyInput.value.trim()) keyInput.value = slugifyTemplateKey(nameInput.value);
        refreshParentOptions();
      });
      nameInput?.addEventListener('input', refreshParentOptions);
      keyInput?.addEventListener('blur', () => {
        keyInput.value = slugifyTemplateKey(keyInput.value);
      });
      keyInput?.addEventListener('input', () => {
        renderTree();
        analyzeTemplate();
      });
      typeInput?.addEventListener('change', () => {
        updateTypeState(row);
        renderTree();
        analyzeTemplate();
      });
      parentInput?.addEventListener('change', () => {
        renderTree();
        analyzeTemplate();
      });
      updateTypeState(row);
    };

    const addRow = (seed = null) => {
      const rowId = seed?.clientId || 'node_' + Math.random().toString(36).slice(2, 9);
      const row = rowTemplate(rowId);
      rowsHost.appendChild(row);
      bindRow(row);
      if (seed) {
        row.querySelector('[data-field="serverName"]').value = seed.serverName || '';
        row.querySelector('[data-field="nodeKey"]').value = slugifyTemplateKey(seed.nodeKey || '');
        row.querySelector('[data-field="nodeType"]').value = seed.nodeType || 'section';
        row.querySelector('[data-field="contentKind"]').value = seed.contentKind || '';
        row.querySelector('[data-field="supportsEdit"]').checked = seed.supportsEdit !== false;
        row.querySelector('[data-field="supportsImage"]').checked = seed.supportsImage !== false;
        row.querySelector('[data-field="supportsChapters"]').checked = Boolean(seed.supportsChapters);
        row.setAttribute('data-parent-id-seed', seed.parentClientId || '');
      }
      updateTypeState(row);
      refreshParentOptions();
    };

    const loadInitialRows = () => {
      const raw = form.getAttribute('data-template-builder-initial') || '';
      if (!raw) return false;
      let initial = [];
      try {
        initial = JSON.parse(raw);
      } catch {
        return false;
      }
      if (!Array.isArray(initial) || !initial.length) return false;
      initial.forEach((seed) => addRow(seed));
      rowsHost.querySelectorAll('[data-builder-row]').forEach((row) => {
        const seedParent = row.getAttribute('data-parent-id-seed');
        if (!seedParent) return;
        const parent = row.querySelector('[data-field="parent"]');
        if (parent) parent.value = seedParent;
      });
      renderTree();
      return true;
    };

    addBtn.addEventListener('click', () => addRow());
    generateBtn?.addEventListener('click', () => {
      const focus = focusInput?.value?.trim();
      if (!focus) {
        window.alert('Add a blueprint focus (example: Class 10 Biology) before generating.');
        return;
      }
      if (rowsHost.querySelectorAll('[data-builder-row]').length > 0 && !window.confirm('Replace current nodes with an intelligent deep blueprint?')) {
        return;
      }
      rowsHost.innerHTML = '';
      const seeds = smartTemplateBlueprint(focus, Number(depthSelect?.value || 5));
      seeds.forEach((seed) => addRow(seed));
      rowsHost.querySelectorAll('[data-builder-row]').forEach((row) => {
        const seedParent = row.getAttribute('data-parent-id-seed');
        if (!seedParent) return;
        const parent = row.querySelector('[data-field="parent"]');
        if (parent) parent.value = seedParent;
      });
      renderTree();
      analyzeTemplate();
    });
    presetSelect?.addEventListener('change', () => {
      const preset = presetSeeds[presetSelect.value];
      if (!preset) return;
      if (rowsHost.querySelectorAll('[data-builder-row]').length > 0 && !window.confirm('Replace current nodes with this starter?')) {
        presetSelect.value = '';
        return;
      }
      rowsHost.innerHTML = '';
      preset.forEach((seed) => addRow(seed));
      presetSelect.value = '';
    });

    form.addEventListener('submit', (event) => {
      const nodes = serializeRows();
      if (!nodes.length) {
        event.preventDefault();
        window.alert('Add at least one node in your template.');
        return;
      }
      const duplicateKeys = new Set();
      const seenKeys = new Set();
      nodes.forEach((node) => {
        if (!node.nodeKey) return;
        if (seenKeys.has(node.nodeKey)) duplicateKeys.add(node.nodeKey);
        seenKeys.add(node.nodeKey);
      });
      if (duplicateKeys.size) {
        event.preventDefault();
        window.alert('Duplicate node keys found: ' + Array.from(duplicateKeys).join(', ') + '. Please make keys unique.');
        return;
      }
      storage.value = JSON.stringify(nodes);
    });

    if (!loadInitialRows()) addRow();
    analyzeTemplate();
    form.dataset.bound = '1';
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
  initializeTemplateBuilder();
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
  initializeTemplateBuilder();
  initializeFormHandlers();
}
`;
