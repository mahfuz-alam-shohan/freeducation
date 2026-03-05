
import { imageToolsModule } from "../../shared/client/imageTools.js";

export function subjectScript(subjectId, apiBase = "/api/workspace", contentModules = []) {
  const safeContentModules = (Array.isArray(contentModules) ? contentModules : [])
    .map((item) => ({
      key: String(item?.key || "").trim().toLowerCase(),
      label: String(item?.label || "").trim(),
      editable: Boolean(item?.editable),
    }))
    .filter((item, index, list) => item.key && list.findIndex((entry) => entry.key === item.key) === index);

  return `
(() => {
  const subjectId = ${Number(subjectId) || 0};
  const apiRoot = ${JSON.stringify(String(apiBase || "/api/workspace"))};
  const contentModules = ${JSON.stringify(safeContentModules)};

  const titleEl = document.getElementById('subjectTitle');
  const subtitleEl = document.getElementById('subjectSubtitle');
  const breadcrumbEl = document.getElementById('subjectBreadcrumb');
  const dynamicArea = document.getElementById('subjectDynamicArea');
  const msgEl = document.getElementById('subjectMsg');
  const backBtn = document.getElementById('subjectBackBtn');
  const chapterModal = document.getElementById('chapterModal');
  const chapterForm = document.getElementById('chapterForm');
  const chapterModalCancel = document.getElementById('chapterModalCancel');
  const chapterModalTitle = document.getElementById('chapterModalTitle');
  const chapterModalImageSlot = document.getElementById('chapterModalImageSlot');
  const chapterModalImageInput = document.getElementById('chapterModalImageInput');
  const chapterModalImagePreview = document.getElementById('chapterModalImagePreview');
  const chapterModalImageIcon = document.getElementById('chapterModalImageIcon');
  const chapterModalImageRemove = document.getElementById('chapterModalImageRemove');
  const topicModal = document.getElementById('topicModal');
  const topicForm = document.getElementById('topicForm');
  const topicModalCancel = document.getElementById('topicModalCancel');
  const topicModalTitle = document.getElementById('topicModalTitle');
  const topicModalImageSlot = document.getElementById('topicModalImageSlot');
  const topicModalImageInput = document.getElementById('topicModalImageInput');
  const topicModalImagePreview = document.getElementById('topicModalImagePreview');
  const topicModalImageIcon = document.getElementById('topicModalImageIcon');
  const topicModalImageRemove = document.getElementById('topicModalImageRemove');
  const contentPrefsModal = document.getElementById('contentPrefsModal');
  const contentPrefsForm = document.getElementById('contentPrefsForm');
  const contentPrefsModalTitle = document.getElementById('contentPrefsModalTitle');
  const contentPrefsModalHint = document.getElementById('contentPrefsModalHint');
  const contentPrefsOptions = document.getElementById('contentPrefsOptions');
  const contentPrefsModalCancel = document.getElementById('contentPrefsModalCancel');
  const chapterTopicsToggleWrap = document.getElementById('chapterTopicsToggleWrap');
  if (!titleEl || !subtitleEl || !breadcrumbEl || !dynamicArea || !msgEl || !backBtn || !chapterModal || !chapterForm || !chapterModalCancel || !chapterModalTitle || !chapterModalImageSlot || !chapterModalImageInput || !chapterModalImagePreview || !chapterModalImageIcon || !chapterModalImageRemove || !topicModal || !topicForm || !topicModalCancel || !topicModalTitle || !topicModalImageSlot || !topicModalImageInput || !topicModalImagePreview || !topicModalImageIcon || !topicModalImageRemove || !contentPrefsModal || !contentPrefsForm || !contentPrefsModalTitle || !contentPrefsModalHint || !contentPrefsOptions || !contentPrefsModalCancel || !chapterTopicsToggleWrap) return;

  const controller = new AbortController();
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }

  let activeEditor = null;
  let editorItemsMap = new Map();
  let currentTabContext = null;
  let currentMode = 'root';
  const PHY_TEMPLATE_CODE = 'PHY-CHEM-BIO-NCTB2010';
  let expandedRootNodeId = 0;
  const rootChildrenCache = new Map();
  const autosaveTimers = new Map();
  let chapterModalPreviewUrl = '';
  let topicModalPreviewUrl = '';

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const toDate = (value) => {
    const date = new Date(value || '');
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  };
  const classText = (subject) => {
    const name = String(subject?.className || '').trim();
    if (name) return name;
    const level = Number(subject?.classLevel || 0);
    return level > 0 ? ('Class ' + String(level)) : '-';
  };

  const setMsg = (text) => {
    msgEl.textContent = String(text || '');
  };
  const isInteractiveTarget = (target) => Boolean(target?.closest?.('button,input,select,textarea,label,a,[data-action],[contenteditable="true"]'));
  const toastHostId = 'subjectToastHost';

  const showToast = (text, type = 'info') => {
    const message = String(text || '').trim();
    if (!message) return;
    let host = document.getElementById(toastHostId);
    if (!host) {
      host = document.createElement('div');
      host.id = toastHostId;
      host.className = 'sbj-toast-stack';
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.className = 'sbj-toast sbj-toast-' + String(type || 'info');
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
        showToast(error?.message || 'Unable to sync changes', 'error');
        setMsg(error?.message || 'Unable to sync changes');
      }
    }, delay);
    autosaveTimers.set(timerKey, timer);
  };

  const apiRequest = async (path, options = {}) => {
    const response = await fetch(apiRoot + path, {
      ...options,
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Request failed');
    return payload;
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

  const clearChapterModalPreviewUrl = () => {
    if (!chapterModalPreviewUrl) return;
    URL.revokeObjectURL(chapterModalPreviewUrl);
    chapterModalPreviewUrl = '';
  };

  const syncChapterModalImageUi = () => {
    const file = chapterModalImageInput.files?.[0] || null;
    clearChapterModalPreviewUrl();
    if (!file) {
      chapterModalImagePreview.hidden = true;
      chapterModalImagePreview.removeAttribute('src');
      chapterModalImageIcon.hidden = false;
      chapterModalImageRemove.hidden = true;
      chapterModalImageSlot.classList.remove('has-image');
      return;
    }
    chapterModalPreviewUrl = URL.createObjectURL(file);
    chapterModalImagePreview.src = chapterModalPreviewUrl;
    chapterModalImagePreview.hidden = false;
    chapterModalImageIcon.hidden = true;
    chapterModalImageRemove.hidden = false;
    chapterModalImageSlot.classList.add('has-image');
  };

  const clearTopicModalPreviewUrl = () => {
    if (!topicModalPreviewUrl) return;
    URL.revokeObjectURL(topicModalPreviewUrl);
    topicModalPreviewUrl = '';
  };

  const syncTopicModalImageUi = () => {
    const file = topicModalImageInput.files?.[0] || null;
    const existingImage = String(topicForm.dataset.existingImage || '').trim();
    clearTopicModalPreviewUrl();

    if (file) {
      topicModalPreviewUrl = URL.createObjectURL(file);
      topicModalImagePreview.src = topicModalPreviewUrl;
      topicModalImagePreview.hidden = false;
      topicModalImageIcon.hidden = true;
      topicModalImageRemove.hidden = false;
      topicModalImageSlot.classList.add('has-image');
      topicForm.elements.clearImage.value = '0';
      return;
    }

    if (existingImage) {
      topicModalImagePreview.src = existingImage;
      topicModalImagePreview.hidden = false;
      topicModalImageIcon.hidden = true;
      topicModalImageRemove.hidden = false;
      topicModalImageSlot.classList.add('has-image');
      return;
    }

    topicModalImagePreview.hidden = true;
    topicModalImagePreview.removeAttribute('src');
    topicModalImageIcon.hidden = false;
    topicModalImageRemove.hidden = true;
    topicModalImageSlot.classList.remove('has-image');
  };

  const currentState = () => {
    const params = new URLSearchParams(window.location.search);
    const nodeId = Number.parseInt(String(params.get('node') || 0), 10) || 0;
    const chapterId = Number.parseInt(String(params.get('chapter') || 0), 10) || 0;
    const topicId = Number.parseInt(String(params.get('topic') || 0), 10) || 0;
    const contextType = String(params.get('contextType') || '').toLowerCase();
    const contextId = Number.parseInt(String(params.get('contextId') || 0), 10) || 0;
    const editor = String(params.get('editor') || '').toLowerCase();
    const tab = String(params.get('tab') || '').toLowerCase();

    if (editor && contextType && contextId > 0) {
      return { mode: 'editor', editor, contextType, contextId, tab };
    }
    if (chapterId > 0) {
      return { mode: 'chapter', chapterId, tab };
    }
    if (topicId > 0) {
      return { mode: 'topic', topicId, tab };
    }
    if (nodeId > 0) {
      return { mode: 'node', nodeId, tab };
    }
    return { mode: 'root', tab };
  };

  const subjectHref = (query = '') => {
    const base = '/admin/subjects/' + subjectId;
    return query ? (base + '?' + query) : base;
  };

  const navigate = (href) => {
    if (!href) return;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(href);
      return;
    }
    window.location.href = href;
  };

  const setBreadcrumb = (parts = []) => {
    const items = [
      { label: 'Subjects', href: '/admin/subjects' },
      { label: titleEl.textContent || 'Subject', href: subjectHref('') },
      ...parts,
    ];

    breadcrumbEl.innerHTML = items.map((item, index) => {
      const last = index === items.length - 1;
      if (last || !item?.href) return '<span>' + escapeHtml(item?.label || '') + '</span>';
      return '<button type="button" data-nav-href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label || '') + '</button>';
    }).join('<span>/</span>');
  };

  const contentModuleMap = new Map();
  for (const item of (Array.isArray(contentModules) ? contentModules : [])) {
    const key = String(item?.key || '').toLowerCase();
    if (!key || contentModuleMap.has(key)) continue;
    contentModuleMap.set(key, {
      label: String(item?.label || '').trim(),
      editable: Boolean(item?.editable),
    });
  }

  const resolveContentTypeMeta = (key, fallback = {}) => {
    const normalizedKey = String(key || '').trim().toLowerCase();
    if (!normalizedKey) {
      return {
        key: '',
        label: String(fallback?.label || '').trim(),
        editable: Boolean(fallback?.editable),
      };
    }
    const registry = contentModuleMap.get(normalizedKey);
    return {
      key: normalizedKey,
      label: String(fallback?.label || registry?.label || normalizedKey).trim(),
      editable: fallback?.editable === undefined ? Boolean(registry?.editable) : Boolean(fallback?.editable),
    };
  };

  const contentTypeLabel = (key, fallbackLabel = '') => resolveContentTypeMeta(key, { label: fallbackLabel }).label;
  const isEditableContentType = (key, fallbackEditable = false) => resolveContentTypeMeta(key, { editable: fallbackEditable }).editable;
  const editorModeForType = (key) => {
    const normalized = String(key || '').trim().toLowerCase();
    if (normalized === 'short_notes') return 'short_notes';
    if (normalized === 'mcq_bank') return 'mcq_bank';
    if (normalized === 'summary') return 'summary';
    return '';
  };
  const nodeImagePlaceholderIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 15.2l-4.6-4.3-4.4 4.1-2.3-2.1-5.7 5.2"/></svg>';
  const editIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.6 3.4a2.1 2.1 0 1 1 3 3L8 18l-4 1 1-4z"/></svg>';
  const deleteIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 10v7"/><path d="M14 10v7"/></svg>';
  const moveUpIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18V6"/><path d="m6.5 11.5 5.5-5.5 5.5 5.5"/></svg>';
  const moveDownIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="m6.5 12.5 5.5 5.5 5.5-5.5"/></svg>';
  const prefsIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"/><path d="M12 17v4"/><path d="M4 8h16"/><path d="M4 16h16"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="16" r="2"/></svg>';
  const parseContentTypeKeys = (value) => String(value || '')
    .split(',')
    .map((item) => String(item || '').trim().toLowerCase())
    .filter((item, index, list) => Boolean(item) && list.indexOf(item) === index && contentModuleMap.has(item));
  const encodeContentTypeKeys = (value) => parseContentTypeKeys(Array.isArray(value) ? value.join(',') : value).join(',');
  const greekLowerSymbols = [
    { label: 'alpha', value: '\u03B1' }, { label: 'beta', value: '\u03B2' }, { label: 'gamma', value: '\u03B3' }, { label: 'delta', value: '\u03B4' },
    { label: 'epsilon', value: '\u03B5' }, { label: 'zeta', value: '\u03B6' }, { label: 'eta', value: '\u03B7' }, { label: 'theta', value: '\u03B8' },
    { label: 'iota', value: '\u03B9' }, { label: 'kappa', value: '\u03BA' }, { label: 'lambda', value: '\u03BB' }, { label: 'mu', value: '\u03BC' },
    { label: 'nu', value: '\u03BD' }, { label: 'xi', value: '\u03BE' }, { label: 'omicron', value: '\u03BF' }, { label: 'pi', value: '\u03C0' },
    { label: 'rho', value: '\u03C1' }, { label: 'sigma', value: '\u03C3' }, { label: 'tau', value: '\u03C4' }, { label: 'upsilon', value: '\u03C5' },
    { label: 'phi', value: '\u03C6' }, { label: 'chi', value: '\u03C7' }, { label: 'psi', value: '\u03C8' }, { label: 'omega', value: '\u03C9' },
    { label: 'vartheta', value: '\u03D1' }, { label: 'varphi', value: '\u03D5' }, { label: 'varpi', value: '\u03D6' }, { label: 'varrho', value: '\u03F1' },
    { label: 'final sigma', value: '\u03C2' },
  ];
  const greekUpperSymbols = [
    { label: 'Alpha', value: '\u0391' }, { label: 'Beta', value: '\u0392' }, { label: 'Gamma', value: '\u0393' }, { label: 'Delta', value: '\u0394' },
    { label: 'Epsilon', value: '\u0395' }, { label: 'Zeta', value: '\u0396' }, { label: 'Eta', value: '\u0397' }, { label: 'Theta', value: '\u0398' },
    { label: 'Iota', value: '\u0399' }, { label: 'Kappa', value: '\u039A' }, { label: 'Lambda', value: '\u039B' }, { label: 'Mu', value: '\u039C' },
    { label: 'Nu', value: '\u039D' }, { label: 'Xi', value: '\u039E' }, { label: 'Omicron', value: '\u039F' }, { label: 'Pi', value: '\u03A0' },
    { label: 'Rho', value: '\u03A1' }, { label: 'Sigma', value: '\u03A3' }, { label: 'Tau', value: '\u03A4' }, { label: 'Upsilon', value: '\u03A5' },
    { label: 'Phi', value: '\u03A6' }, { label: 'Chi', value: '\u03A7' }, { label: 'Psi', value: '\u03A8' }, { label: 'Omega', value: '\u03A9' },
  ];
  const mathOperatorSymbols = [
    { label: 'plus-minus', value: '\u00B1' }, { label: 'multiply', value: '\u00D7' }, { label: 'divide', value: '\u00F7' }, { label: 'dot product', value: '\u22C5' },
    { label: 'not equal', value: '\u2260' }, { label: 'approximately', value: '\u2248' }, { label: 'less or equal', value: '\u2264' }, { label: 'greater or equal', value: '\u2265' },
    { label: 'proportional', value: '\u221D' }, { label: 'infinity', value: '\u221E' }, { label: 'partial derivative', value: '\u2202' }, { label: 'nabla', value: '\u2207' },
    { label: 'summation', value: '\u2211' }, { label: 'product', value: '\u220F' }, { label: 'integral', value: '\u222B' }, { label: 'contour integral', value: '\u222E' },
    { label: 'square root', value: '\u221A' }, { label: 'cube root', value: '\u221B' }, { label: 'angle', value: '\u2220' }, { label: 'degree', value: '\u00B0' },
    { label: 'prime', value: '\u2032' }, { label: 'double prime', value: '\u2033' }, { label: 'micro', value: '\u00B5' }, { label: 'ohm', value: '\u2126' },
    { label: 'therefore', value: '\u2234' }, { label: 'because', value: '\u2235' },
  ];
  const setAndArrowSymbols = [
    { label: 'element of', value: '\u2208' }, { label: 'not element', value: '\u2209' }, { label: 'subset', value: '\u2282' }, { label: 'subset or equal', value: '\u2286' },
    { label: 'superset', value: '\u2283' }, { label: 'superset or equal', value: '\u2287' }, { label: 'union', value: '\u222A' }, { label: 'intersection', value: '\u2229' },
    { label: 'logical and', value: '\u2227' }, { label: 'logical or', value: '\u2228' }, { label: 'implies', value: '\u21D2' }, { label: 'iff', value: '\u21D4' },
    { label: 'right arrow', value: '\u2192' }, { label: 'left arrow', value: '\u2190' }, { label: 'double arrow', value: '\u2194' }, { label: 'up arrow', value: '\u2191' },
    { label: 'down arrow', value: '\u2193' }, { label: 'parallel', value: '\u2225' }, { label: 'perpendicular', value: '\u22A5' },
  ];
  const allMathSymbols = [...greekLowerSymbols, ...greekUpperSymbols, ...mathOperatorSymbols, ...setAndArrowSymbols];
  const editorTemplateMap = {
    fraction: '<span class="sbj-math-template sbj-math-fraction"><span class="sbj-math-frac-top">a+b</span><span class="sbj-math-frac-bottom">c+d</span></span>',
    radical: '<span class="sbj-math-template sbj-math-radical"><span class="sbj-math-radical-root">&#8730;</span><span class="sbj-math-radical-body">x+y</span></span>',
    power: 'x<sup>n</sup>',
    subscript: 'x<sub>n</sub>',
  };

  const symbolButtonMarkup = (rows = []) => rows
    .map((entry) => '<button type="button" class="sbj-tool-btn sbj-symbol-btn" data-action="editor-insert" data-value="' + escapeHtml(entry?.value || '') + '" title="' + escapeHtml(String(entry?.label || '')) + '">' + escapeHtml(String(entry?.value || '')) + '</button>')
    .join('');
  const allSymbolButtons = symbolButtonMarkup(allMathSymbols);

  const editorFromToolbar = (toolbarElement) => {
    const toolbar = toolbarElement?.closest?.('.sbj-editor-toolbar[data-editor-target]');
    const targetId = String(toolbar?.getAttribute('data-editor-target') || '');
    return targetId ? document.getElementById(targetId) : null;
  };

  const focusEditor = (editor) => {
    if (!(editor instanceof HTMLElement)) return false;
    activeEditor = editor;
    editor.focus();
    return true;
  };

  const closestMathTemplate = (node) => {
    const base = node instanceof HTMLElement ? node : node?.parentElement;
    return base?.closest?.('.sbj-math-template') || null;
  };

  const insertTextIntoEditor = (editor, value) => {
    if (!focusEditor(editor) || !value) return;
    try {
      document.execCommand('insertText', false, value);
    } catch {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(value);
      range.insertNode(node);
      range.setStartAfter(node);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const insertHtmlIntoEditor = (editor, html) => {
    if (!focusEditor(editor) || !html) return;
    try {
      document.execCommand('insertHTML', false, html);
      return;
    } catch {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const template = document.createElement('template');
      template.innerHTML = html;
      const fragment = template.content;
      const lastNode = fragment.lastChild;
      range.insertNode(fragment);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const insertTemplateIntoEditor = (editor, html) => {
    if (!focusEditor(editor) || !html) return;
    const selection = window.getSelection();
    if (!selection) return;

    let range = null;
    if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
      range = selection.getRangeAt(0);
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    range.deleteContents();
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    const exitNode = document.createTextNode('\u200B');
    fragment.appendChild(exitNode);
    range.insertNode(fragment);
    range.setStartAfter(exitNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const editorHtmlValue = (editor, { required = true, label = 'Content' } = {}) => {
    const raw = String(editor?.innerHTML || '').trim();
    if (!required) return raw;
    const probe = document.createElement('div');
    probe.innerHTML = raw;
    const text = String(probe.textContent || '').replace(/\u200B/g, '').replace(/\u00A0/g, ' ').trim();
    const hasMedia = Boolean(probe.querySelector('img,video,iframe,table,hr'));
    if (!text && !hasMedia) {
      throw new Error(String(label || 'Content') + ' is required');
    }
    return String(probe.innerHTML || '').trim();
  };
  const hasRichInlineMarkup = (raw) => {
    const text = String(raw || '').trim();
    if (!text) return false;
    const probe = document.createElement('div');
    probe.innerHTML = text;
    return Boolean(probe.querySelector('p,div,span,br,b,strong,i,em,u,sup,sub,ul,ol,li,img,table,tr,td,th,blockquote,code,pre'));
  };

  const normalizeInlineBlockWrappers = (value) => {
    const raw = String(value || '').trim();
    if (!raw || (!/<div\\b/i.test(raw) && !/<p\\b/i.test(raw))) return raw;
    const compactRaw = raw.replace(/\\s+/g, '');
    const blocks = raw.match(/<(?:div|p)\\b[^>]*>[\\s\\S]*?<\\/(?:div|p)>/gi);
    if (!Array.isArray(blocks) || !blocks.length) return raw;
    const compactBlocks = blocks.join('').replace(/\\s+/g, '');
    if (compactBlocks !== compactRaw) return raw;
    return blocks
      .map((block) => block
        .replace(/^<(?:div|p)\\b[^>]*>/i, '')
        .replace(/<\\/(?:div|p)>$/i, '')
        .trim())
      .filter(Boolean)
      .join(' ');
  };

  const richDisplayValue = (value) => {
    const raw = String(value || '');
    if (!raw) return '';
    if (hasRichInlineMarkup(raw)) return normalizeInlineBlockWrappers(raw);
    return escapeHtml(raw)
      .replaceAll('\\r\\n', '\\n')
      .replaceAll('\\r', '\\n')
      .replaceAll('\\n', '<br>');
  };

  const nodeImageCell = (node, canEditImage) => {
    const disabledAttr = canEditImage ? '' : 'disabled';
    return '<div class="sbj-image-slot-wrap">'
      + '<button type="button" class="sbj-image-slot ' + (node?.imageUrl ? 'has-image' : '') + '" data-action="pick-node-image" ' + disabledAttr + '>'
      + (node?.imageUrl
        ? ('<img class="sbj-thumb sbj-thumb-node" src="' + escapeHtml(node.imageUrl) + '" alt="Template image" />')
        : ('<span class="sbj-image-icon">' + nodeImagePlaceholderIcon + '</span>'))
      + '</button>'
      + '<input class="sbj-node-image-input" data-field="imageFile" type="file" accept="image/png,image/jpeg,image/webp" ' + disabledAttr + ' />'
      + (node?.imageUrl && canEditImage
        ? ('<button type="button" class="sbj-image-remove" data-action="remove-node-image" data-node-id="' + Number(node?.id || 0) + '" aria-label="Remove image">x</button>')
        : '')
      + '</div>';
  };

  const chapterImageCell = (chapter) => (
    '<div class="sbj-image-slot-wrap">'
      + '<button type="button" class="sbj-image-slot ' + (chapter?.imageUrl ? 'has-image' : '') + '" data-action="pick-chapter-image">'
      + (chapter?.imageUrl
        ? ('<img class="sbj-thumb sbj-thumb-node" src="' + escapeHtml(chapter.imageUrl) + '" alt="Chapter image" />')
        : ('<span class="sbj-image-icon">' + nodeImagePlaceholderIcon + '</span>'))
      + '</button>'
      + '<input class="sbj-node-image-input" data-field="chapterImageFile" type="file" accept="image/png,image/jpeg,image/webp" />'
      + (chapter?.imageUrl
        ? ('<button type="button" class="sbj-image-remove" data-action="remove-chapter-image" data-chapter-id="' + Number(chapter?.id || 0) + '" aria-label="Remove chapter image">x</button>')
        : '')
      + '</div>'
  );

  const topicImageCell = (topic) => (
    '<div class="sbj-image-slot-wrap">'
      + '<button type="button" class="sbj-image-slot ' + (topic?.imageUrl ? 'has-image' : '') + '" data-action="pick-topic-image">'
      + (topic?.imageUrl
        ? ('<img class="sbj-thumb sbj-thumb-node" src="' + escapeHtml(topic.imageUrl) + '" alt="Topic image" />')
        : ('<span class="sbj-image-icon">' + nodeImagePlaceholderIcon + '</span>'))
      + '</button>'
      + '<input class="sbj-node-image-input" data-field="topicImageFile" type="file" accept="image/png,image/jpeg,image/webp" />'
      + (topic?.imageUrl
        ? ('<button type="button" class="sbj-image-remove" data-action="remove-topic-image" data-topic-id="' + Number(topic?.id || 0) + '" aria-label="Remove topic image">x</button>')
        : '')
      + '</div>'
  );

  const nodeRow = (node, options = {}) => {
    const disabledEdit = node?.canEditName ? '' : 'disabled';
    const canEditImage = Boolean(node?.canUploadImage);
    const depth = Number(options?.depth || 0);
    const expandable = Boolean(options?.expandable);
    const rowClass = (expandable ? 'sbj-node-parent ' : '') + 'sbj-node-depth-' + depth;
    return '<tr data-node-row="' + Number(node?.id || 0) + '" data-open-node-id="' + Number(node?.id || 0) + '" data-node-depth="' + depth + '" class="' + rowClass + '">'
      + '<td class="sbj-row-open-cell">'
      + (expandable ? '<span class="sbj-expand-caret" aria-hidden="true">&#8250;</span>' : '')
      + '<span class="sbj-node-title">' + escapeHtml(node?.serverName || '') + '</span>'
      + '</td>'
      + '<td><input class="sbj-input" data-field="displayName" data-saved-value="' + escapeHtml(node?.displayName || '') + '" value="' + escapeHtml(node?.displayName || '') + '" ' + disabledEdit + ' /></td>'
      + '<td>' + nodeImageCell(node, canEditImage) + '</td>'
      + '</tr>';
  };

  const chapterRow = (chapter, supportsTopics = false, index = 0, total = 0) => {
    const selectedTypes = encodeContentTypeKeys(chapter?.contentTypes || []);
    const availableTypes = encodeContentTypeKeys(chapter?.availableContentTypes || []);
    return '<tr data-chapter-row="' + Number(chapter?.id || 0) + '" data-open-chapter-id="' + Number(chapter?.id || 0) + '">'
      + '<td><div class="sbj-rank-cell"><span class="sbj-rank-value">' + String(Number(index || 0) + 1) + '</span><span class="sbj-rank-controls">'
      + '<button type="button" class="sbj-rank-btn" data-action="move-chapter-up" data-chapter-id="' + Number(chapter?.id || 0) + '" aria-label="Move chapter up" ' + (index <= 0 ? 'disabled' : '') + '>' + moveUpIcon + '</button>'
      + '<button type="button" class="sbj-rank-btn" data-action="move-chapter-down" data-chapter-id="' + Number(chapter?.id || 0) + '" aria-label="Move chapter down" ' + (Number(index || 0) >= Number(total || 0) - 1 ? 'disabled' : '') + '>' + moveDownIcon + '</button>'
      + '</span></div></td>'
      + '<td><input class="sbj-input sbj-topic-name" data-field="chapterName" data-saved-value="' + escapeHtml(chapter?.name || '') + '" value="' + escapeHtml(chapter?.name || '') + '" /></td>'
      + '<td>' + (supportsTopics
        ? ('<label class="sbj-inline-check"><input type="checkbox" data-field="chapterTopicsEnabled" data-saved-value="' + (chapter?.topicsEnabled ? '1' : '0') + '" ' + (chapter?.topicsEnabled ? 'checked' : '') + ' /> Topics</label>')
        : '<span class="sbj-empty">-</span>') + '</td>'
      + '<td>' + chapterImageCell(chapter) + '</td>'
      + '<td>' + escapeHtml(toDate(chapter?.createdAt)) + '</td>'
      + '<td class="sbj-actions">'
      + '<button type="button" class="sbj-ghost sbj-pref-btn" data-action="open-content-prefs" data-context-type="chapter" data-context-id="' + Number(chapter?.id || 0) + '" data-context-label="' + escapeHtml(chapter?.name || 'Chapter') + '" data-selected-types="' + escapeHtml(selectedTypes) + '" data-available-types="' + escapeHtml(availableTypes) + '">' + prefsIcon + '<span>Preferences</span></button>'
      + '<button type="button" class="sbj-danger" data-action="delete-chapter" data-chapter-id="' + Number(chapter?.id || 0) + '" data-chapter-name="' + escapeHtml(chapter?.name || '') + '">Delete</button>'
      + '</td>'
      + '</tr>';
  };

  const topicRow = (topic, index = 0, total = 0) => {
    const selectedTypes = encodeContentTypeKeys(topic?.contentTypes || []);
    const availableTypes = encodeContentTypeKeys(topic?.availableContentTypes || []);
    return '<tr data-topic-row="' + Number(topic?.id || 0) + '" data-open-topic-id="' + Number(topic?.id || 0) + '">'
      + '<td><div class="sbj-rank-cell"><span class="sbj-rank-value">' + String(Number(index || 0) + 1) + '</span><span class="sbj-rank-controls">'
      + '<button type="button" class="sbj-rank-btn" data-action="move-topic-up" data-topic-id="' + Number(topic?.id || 0) + '" aria-label="Move topic up" ' + (index <= 0 ? 'disabled' : '') + '>' + moveUpIcon + '</button>'
      + '<button type="button" class="sbj-rank-btn" data-action="move-topic-down" data-topic-id="' + Number(topic?.id || 0) + '" aria-label="Move topic down" ' + (Number(index || 0) >= Number(total || 0) - 1 ? 'disabled' : '') + '>' + moveDownIcon + '</button>'
      + '</span></div></td>'
      + '<td><input class="sbj-input sbj-topic-name" data-field="topicName" data-saved-value="' + escapeHtml(topic?.name || '') + '" value="' + escapeHtml(topic?.name || '') + '" /></td>'
      + '<td>' + topicImageCell(topic) + '</td>'
      + '<td>' + escapeHtml(toDate(topic?.createdAt)) + '</td>'
      + '<td class="sbj-actions">'
      + '<button type="button" class="sbj-ghost sbj-pref-btn" data-action="open-content-prefs" data-context-type="topic" data-context-id="' + Number(topic?.id || 0) + '" data-context-label="' + escapeHtml(topic?.name || 'Topic') + '" data-selected-types="' + escapeHtml(selectedTypes) + '" data-available-types="' + escapeHtml(availableTypes) + '">' + prefsIcon + '<span>Preferences</span></button>'
      + '<button type="button" class="sbj-danger" data-action="delete-topic" data-topic-id="' + Number(topic?.id || 0) + '" data-topic-name="' + escapeHtml(topic?.name || '') + '">Delete</button>'
      + '</td>'
      + '</tr>';
  };

  const inlineChildrenPanel = (parentNode, childNodes) => {
    const rows = Array.isArray(childNodes) ? childNodes : [];
    return '<div class="sbj-inline-panel">'
      + '<div class="sbj-inline-head">Sections under ' + escapeHtml(parentNode?.displayName || parentNode?.serverName || '') + '</div>'
      + '<div class="sbj-table-wrap"><table class="sbj-table sbj-hierarchy-table sbj-subtable"><tbody>'
      + (rows.length ? rows.map((child) => nodeRow(child, { depth: 1 })).join('') : '<tr><td colspan="3" class="sbj-empty">No sections found.</td></tr>')
      + '</tbody></table></div>'
      + '</div>';
  };

  const closeInlineChildrenPanel = () => {
    const expandedRow = dynamicArea.querySelector('tr.sbj-node-parent.is-expanded');
    if (expandedRow) expandedRow.classList.remove('is-expanded');
    const inlineRow = dynamicArea.querySelector('tr.sbj-inline-row[data-inline-parent]');
    if (inlineRow) inlineRow.remove();
    expandedRootNodeId = 0;
  };

  const openInlineChildrenPanel = async (row, nodeId) => {
    if (!row || !nodeId) return;
    if (expandedRootNodeId === nodeId) {
      closeInlineChildrenPanel();
      return;
    }

    closeInlineChildrenPanel();
    row.classList.add('is-expanded');
    const inlineRow = document.createElement('tr');
    inlineRow.className = 'sbj-inline-row';
    inlineRow.setAttribute('data-inline-parent', String(nodeId));
    inlineRow.innerHTML = '<td colspan="3"><div class="sbj-inline-panel is-open"><div class="sbj-inline-loading">Loading sections...</div></div></td>';
    row.insertAdjacentElement('afterend', inlineRow);
    expandedRootNodeId = nodeId;

    try {
      let payload = rootChildrenCache.get(nodeId);
      if (!payload) {
        payload = await apiRequest('/subjects/' + subjectId + '/nodes/' + nodeId);
        rootChildrenCache.set(nodeId, payload);
      }
      const panelCell = inlineRow.querySelector('td');
      if (!panelCell) return;
      panelCell.innerHTML = inlineChildrenPanel(payload?.node || {}, payload?.childNodes || []);
      const panel = inlineRow.querySelector('.sbj-inline-panel');
      if (panel) {
        requestAnimationFrame(() => panel.classList.add('is-open'));
      }
    } catch (error) {
      closeInlineChildrenPanel();
      throw error;
    }
  };

  const contentTypeTabPriority = (key) => {
    const normalized = String(key || '').toLowerCase();
    if (normalized === 'summary') return 1;
    if (normalized === 'short_notes') return 2;
    if (normalized === 'mcq_bank') return 3;
    return 999;
  };

  const orderedContentTypes = (contentTypes = []) => (Array.isArray(contentTypes) ? contentTypes : [])
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const priorityDiff = contentTypeTabPriority(a?.item?.key) - contentTypeTabPriority(b?.item?.key);
      if (priorityDiff !== 0) return priorityDiff;
      return a.index - b.index;
    })
    .map((entry) => entry.item);

  const preferredTabKey = (contentTypes, state) => {
    const keys = orderedContentTypes(contentTypes)
      .map((item) => String(item?.key || '').toLowerCase())
      .filter(Boolean);
    if (!keys.length) return '';
    const fromTab = String(state?.tab || '').toLowerCase();
    const fromEditor = String(state?.editor || '').toLowerCase();
    if (fromTab && keys.includes(fromTab)) return fromTab;
    if (fromEditor && keys.includes(fromEditor)) return fromEditor;
    return keys[0];
  };

  const updateTabInUrl = (tabKey) => {
    const key = String(tabKey || '').toLowerCase();
    if (!key) return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    window.history.replaceState(window.history.state || {}, '', url.pathname + url.search + url.hash);
  };

  const renderTabsRow = (contentTypes, activeTab) => {
    const tabs = orderedContentTypes(contentTypes);
    if (!tabs.length) return '<p class="sbj-empty">No content tabs configured.</p>';
    return '<div class="sbj-tabs" role="tablist" aria-label="Subject contents">'
      + tabs.map((item) => {
        const key = String(item?.key || '').toLowerCase();
        const isActive = key === activeTab;
        return '<button type="button" role="tab" class="sbj-tab ' + (isActive ? 'is-active' : '') + '" data-action="switch-content-tab" data-tab-key="' + escapeHtml(key) + '" aria-selected="' + (isActive ? 'true' : 'false') + '">' + escapeHtml(contentTypeLabel(key, item?.label)) + '</button>';
      }).join('')
      + '<span class="sbj-tab-indicator" data-tab-indicator="1" aria-hidden="true"></span>'
      + '</div>';
  };

  const updateTabsIndicator = () => {
    const tabsWrap = dynamicArea.querySelector('.sbj-tabs');
    if (!tabsWrap) return;
    const indicator = tabsWrap.querySelector('[data-tab-indicator]');
    const activeTab = tabsWrap.querySelector('.sbj-tab.is-active');
    if (!indicator || !activeTab) return;
    const wrapRect = tabsWrap.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    indicator.style.width = Math.max(0, tabRect.width) + 'px';
    indicator.style.transform = 'translateX(' + Math.max(0, tabRect.left - wrapRect.left) + 'px)';
  };

  const buildPageTokens = (totalPages, currentPage) => {
    const total = Math.max(1, Number(totalPages || 1));
    const current = Math.min(Math.max(1, Number(currentPage || 1)), total);
    const tokens = [];
    if (total <= 9) {
      for (let p = 1; p <= total; p += 1) tokens.push(p);
      return tokens;
    }
    tokens.push(1);
    if (current > 4) tokens.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
      tokens.push(p);
    }
    if (current < total - 3) tokens.push('...');
    tokens.push(total);
    return tokens;
  };

  const readNotesPageFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const page = Number.parseInt(String(params.get('notesPage') || '1'), 10);
    return Number.isInteger(page) && page > 0 ? page : 1;
  };

  const updateNotesPageInUrl = (page) => {
    const parsed = Number.parseInt(String(page || 1), 10);
    const normalized = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
    const url = new URL(window.location.href);
    if (normalized <= 1) {
      url.searchParams.delete('notesPage');
    } else {
      url.searchParams.set('notesPage', String(normalized));
    }
    window.history.replaceState(window.history.state || {}, '', url.pathname + url.search + url.hash);
  };

  const readMcqPageFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const page = Number.parseInt(String(params.get('mcqPage') || '1'), 10);
    return Number.isInteger(page) && page > 0 ? page : 1;
  };

  const updateMcqPageInUrl = (page) => {
    const parsed = Number.parseInt(String(page || 1), 10);
    const normalized = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
    const url = new URL(window.location.href);
    if (normalized <= 1) {
      url.searchParams.delete('mcqPage');
    } else {
      url.searchParams.set('mcqPage', String(normalized));
    }
    window.history.replaceState(window.history.state || {}, '', url.pathname + url.search + url.hash);
  };

  const directChapterNodeIdForTemplate = (payload) => {
    const subject = payload?.subject || {};
    const templateCode = String(subject?.templateCode || '').trim().toUpperCase();
    if (templateCode !== PHY_TEMPLATE_CODE) return 0;
    const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
    const chapterNode = nodes.find((node) => Boolean(node?.supportsChapters));
    return Number(chapterNode?.id || 0);
  };

  const renderRoot = (payload) => {
    const subject = payload?.subject || {};
    const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
    rootChildrenCache.clear();
    expandedRootNodeId = 0;
    titleEl.textContent = subject?.name || ('Subject #' + subjectId);
    subtitleEl.textContent = classText(subject) + ' | Template: ' + String(subject?.templateCode || subject?.templateName || '-');
    setBreadcrumb([]);

    dynamicArea.innerHTML = '<section class="sbj-card">'
      + '<header class="sbj-toolbar"><h3>Books</h3></header>'
      + '<div class="sbj-table-wrap"><table class="sbj-table sbj-hierarchy-table"><thead><tr><th>Hierarchy</th><th>Display Name</th><th>Image</th></tr></thead><tbody>'
      + (nodes.length ? nodes.map((node) => nodeRow(node, { depth: 0, expandable: true })).join('') : '<tr><td colspan="3" class="sbj-empty">No nodes found for this subject.</td></tr>')
      + '</tbody></table></div>'
      + '</section>';
  };

  const renderNodeView = async (payload, state = {}) => {
    const subject = payload?.subject || {};
    const node = payload?.node || {};
    const parentNode = payload?.parentNode || null;
    const childNodes = Array.isArray(payload?.childNodes) ? payload.childNodes : [];
    const chapters = Array.isArray(payload?.chapters) ? payload.chapters : [];
    const contentTypes = Array.isArray(payload?.contentTypes) ? payload.contentTypes : [];

    titleEl.textContent = subject?.name || ('Subject #' + subjectId);
    subtitleEl.textContent = classText(subject) + ' | ' + String(node?.displayName || node?.serverName || '');
    const crumb = [];
    if (parentNode?.id) {
      crumb.push({ label: parentNode.displayName || parentNode.serverName, href: subjectHref('node=' + Number(parentNode.id)) });
    }
    crumb.push({ label: node.displayName || node.serverName });
    setBreadcrumb(crumb);

    if (childNodes.length) {
      dynamicArea.innerHTML = '<section class="sbj-card">'
        + '<header class="sbj-toolbar"><h3>Sections under ' + escapeHtml(node?.displayName || node?.serverName || '') + '</h3></header>'
        + '<div class="sbj-table-wrap"><table class="sbj-table sbj-hierarchy-table"><thead><tr><th>Hierarchy</th><th>Display Name</th><th>Image</th></tr></thead><tbody>'
        + childNodes.map((child) => nodeRow(child, { depth: 0 })).join('')
        + '</tbody></table></div>'
        + '</section>';
      return;
    }

    if (node?.supportsChapters) {
      // Keep the chapter table heading stable across template/node naming variants.
      const chapterHeading = 'Chapters';
      dynamicArea.innerHTML = '<section class="sbj-card">'
        + '<header class="sbj-toolbar"><h3>' + escapeHtml(chapterHeading) + '</h3>'
        + '<button type="button" class="sbj-primary" data-action="open-chapter-modal-create" data-node-id="' + Number(node?.id || 0) + '" data-node-supports-topics="' + (node?.supportsTopics ? '1' : '0') + '">Add Chapter</button></header>'
        + '<div class="sbj-table-wrap"><table class="sbj-table sbj-chapter-table"><thead><tr><th>Rank</th><th>Chapter</th><th>Topics</th><th>Image</th><th>Created</th><th>Actions</th></tr></thead><tbody>'
        + (chapters.length ? chapters.map((chapter, index) => chapterRow(chapter, Boolean(node?.supportsTopics), index, chapters.length)).join('') : '<tr><td colspan="6" class="sbj-empty">No chapters yet.</td></tr>')
        + '</tbody></table></div>'
        + '</section>';
      return;
    }

    dynamicArea.innerHTML = '<section class="sbj-card">'
      + '<header class="sbj-toolbar"><h3>' + escapeHtml(node?.displayName || node?.serverName || '') + '</h3></header>'
      + renderTabsRow(contentTypes, preferredTabKey(contentTypes, state))
      + '<div id="contentTabPanel" class="sbj-tab-panel"></div>'
      + '</section>';

    const tabKey = preferredTabKey(contentTypes, state);
    currentTabContext = {
      subject,
      node,
      chapter: null,
      contextType: 'node',
      contextId: Number(node?.id || 0),
      contentTypes: orderedContentTypes(contentTypes),
      activeTab: tabKey,
    };
    if (tabKey) {
      await renderActiveTabContent(tabKey, { updateUrl: true });
    }
  };

  const renderChapterView = async (payload, state = {}) => {
    const subject = payload?.subject || {};
    const node = payload?.node || {};
    const chapter = payload?.chapter || {};
    const topics = Array.isArray(payload?.topics) ? payload.topics : [];
    const contentTypes = Array.isArray(payload?.contentTypes) ? payload.contentTypes : [];

    titleEl.textContent = subject?.name || ('Subject #' + subjectId);
    subtitleEl.textContent = classText(subject) + ' | ' + String(chapter?.name || 'Chapter');
    setBreadcrumb([
      { label: node?.displayName || node?.serverName || 'Section', href: subjectHref('node=' + Number(node?.id || 0)) },
      { label: chapter?.name || 'Chapter' },
    ]);

    if (chapter?.topicsEnabled) {
      dynamicArea.innerHTML = '<section class="sbj-card">'
        + '<header class="sbj-toolbar"><h3>Topics in ' + escapeHtml(chapter?.name || '') + '</h3>'
        + '<button type="button" class="sbj-primary" data-action="open-topic-modal-create" data-chapter-id="' + Number(chapter?.id || 0) + '">Add Topic</button></header>'
        + '<div class="sbj-table-wrap"><table class="sbj-table sbj-chapter-table"><thead><tr><th>Rank</th><th>Topic</th><th>Image</th><th>Created</th><th>Actions</th></tr></thead><tbody>'
        + (topics.length ? topics.map((topic, index) => topicRow(topic, index, topics.length)).join('') : '<tr><td colspan="5" class="sbj-empty">No topics yet.</td></tr>')
        + '</tbody></table></div>'
        + '</section>';
      return;
    }

    dynamicArea.innerHTML = '<section class="sbj-card">'
      + '<header class="sbj-toolbar"><h3>' + escapeHtml(chapter?.name || '') + '</h3></header>'
      + renderTabsRow(contentTypes, preferredTabKey(contentTypes, state))
      + '<div id="contentTabPanel" class="sbj-tab-panel"></div>'
      + '</section>';

    const tabKey = preferredTabKey(contentTypes, state);
    currentTabContext = {
      subject,
      node,
      chapter,
      topic: null,
      contextType: 'chapter',
      contextId: Number(chapter?.id || 0),
      contentTypes: orderedContentTypes(contentTypes),
      activeTab: tabKey,
    };
    if (tabKey) {
      await renderActiveTabContent(tabKey, { updateUrl: true });
    }
  };

  const renderTopicView = async (payload, state = {}) => {
    const subject = payload?.subject || {};
    const node = payload?.node || {};
    const chapter = payload?.chapter || {};
    const topic = payload?.topic || {};
    const contentTypes = Array.isArray(payload?.contentTypes) ? payload.contentTypes : [];

    titleEl.textContent = subject?.name || ('Subject #' + subjectId);
    subtitleEl.textContent = classText(subject) + ' | ' + String(topic?.name || 'Topic');
    setBreadcrumb([
      { label: node?.displayName || node?.serverName || 'Section', href: subjectHref('node=' + Number(node?.id || 0)) },
      { label: chapter?.name || 'Chapter', href: subjectHref('chapter=' + Number(chapter?.id || 0)) },
      { label: topic?.name || 'Topic' },
    ]);

    dynamicArea.innerHTML = '<section class="sbj-card">'
      + '<header class="sbj-toolbar"><h3>' + escapeHtml(topic?.name || '') + '</h3></header>'
      + renderTabsRow(contentTypes, preferredTabKey(contentTypes, state))
      + '<div id="contentTabPanel" class="sbj-tab-panel"></div>'
      + '</section>';

    const tabKey = preferredTabKey(contentTypes, state);
    currentTabContext = {
      subject,
      node,
      chapter,
      topic,
      contextType: 'topic',
      contextId: Number(topic?.id || 0),
      contentTypes: orderedContentTypes(contentTypes),
      activeTab: tabKey,
    };
    if (tabKey) {
      await renderActiveTabContent(tabKey, { updateUrl: true });
    }
  };

  const editorToolbar = (options = {}) => {
    const targetId = String(options?.targetId || '').trim();
    const includeMcqImage = Boolean(options?.includeMcqImage);
    const includeNoteImage = Boolean(options?.includeNoteImage);
    const compact = Boolean(options?.compact);
    const toolbarClass = compact ? 'sbj-editor-toolbar sbj-editor-toolbar-compact' : 'sbj-editor-toolbar';
    const formattingTools = compact
      ? ''
      : ('<button type="button" class="sbj-tool-btn" title="Bold" data-action="editor-cmd" data-cmd="bold" data-toggle-cmd="bold"><b>B</b></button>'
        + '<button type="button" class="sbj-tool-btn" title="Italic" data-action="editor-cmd" data-cmd="italic" data-toggle-cmd="italic"><i>I</i></button>'
        + '<button type="button" class="sbj-tool-btn" title="Underline" data-action="editor-cmd" data-cmd="underline" data-toggle-cmd="underline"><u>U</u></button>'
        + '<button type="button" class="sbj-tool-btn" title="Bullet list" data-action="editor-cmd" data-cmd="insertUnorderedList">List</button>'
        + '<span class="sbj-tool-divider" aria-hidden="true"></span>');

    return '<div class="' + toolbarClass + '" data-editor-target="' + escapeHtml(targetId) + '">'
      + formattingTools
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-stack" title="Superscript toggle (power)" data-action="editor-cmd" data-cmd="superscript" data-toggle-cmd="superscript"><span class="sbj-tool-main">x<sup>n</sup></span><span class="sbj-tool-hint">Power</span></button>'
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-stack" title="Subscript toggle (index)" data-action="editor-cmd" data-cmd="subscript" data-toggle-cmd="subscript"><span class="sbj-tool-main">x<sub>n</sub></span><span class="sbj-tool-hint">Index</span></button>'
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-stack" title="Insert power template" data-action="editor-insert-template" data-template="power"><span class="sbj-tool-main">x<sup>n</sup></span><span class="sbj-tool-hint">Insert</span></button>'
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-stack" title="Insert subscript template" data-action="editor-insert-template" data-template="subscript"><span class="sbj-tool-main">x<sub>n</sub></span><span class="sbj-tool-hint">Insert</span></button>'
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-stack" title="Insert fraction with divide line" data-action="editor-insert-template" data-template="fraction"><span class="sbj-tool-main">a/b</span><span class="sbj-tool-hint">Fraction</span></button>'
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-stack" title="Insert root template" data-action="editor-insert-template" data-template="radical"><span class="sbj-tool-main">&#8730;x</span><span class="sbj-tool-hint">Root</span></button>'
      + '<span class="sbj-tool-divider" aria-hidden="true"></span>'
      + '<button type="button" class="sbj-tool-btn sbj-tool-btn-symbol-toggle" data-action="toggle-editor-symbols" aria-expanded="false">Add Characters</button>'
      + '<button type="button" class="sbj-tool-btn" title="Clear format" data-action="editor-cmd" data-cmd="removeFormat">Clear</button>'
      + '<div class="sbj-symbol-drawer" data-editor-symbol-drawer hidden><div class="sbj-symbol-grid" aria-label="Math symbols">' + allSymbolButtons + '</div></div>'
      + (includeNoteImage
        ? ('<span class="sbj-image-slot-wrap sbj-mcq-image-picker">'
          + '<button type="button" class="sbj-image-slot sbj-tool-btn sbj-tool-image-btn" data-action="pick-note-image" aria-label="Add image" title="Add image"><span class="sbj-image-icon">' + nodeImagePlaceholderIcon + '</span></button>'
          + '<input class="sbj-node-image-input" data-field="noteImageFile" name="noteImageFile" type="file" accept="image/png,image/jpeg,image/webp" />'
          + '<img class="sbj-thumb sbj-thumb-node sbj-mcq-image-preview" data-note-image-preview alt="Note preview" hidden />'
          + '<button type="button" class="sbj-image-remove" data-action="remove-note-image" aria-label="Remove image" hidden>x</button>'
          + '</span>')
        : '')
      + (includeMcqImage
        ? ('<span class="sbj-image-slot-wrap sbj-mcq-image-picker">'
          + '<button type="button" class="sbj-image-slot sbj-tool-btn sbj-tool-image-btn" data-action="pick-mcq-image" aria-label="Add image" title="Add image"><span class="sbj-image-icon">' + nodeImagePlaceholderIcon + '</span></button>'
          + '<input class="sbj-node-image-input" data-field="mcqImageFile" name="image" type="file" accept="image/png,image/jpeg,image/webp" />'
          + '<img class="sbj-thumb sbj-thumb-node sbj-mcq-image-preview" data-mcq-image-preview alt="MCQ preview" hidden />'
          + '<button type="button" class="sbj-image-remove" data-action="remove-mcq-image" aria-label="Remove image" hidden>x</button>'
          + '</span>')
        : '')
      + '</div>';
  };

  const updateEditorToolbarState = () => {
    const toolbars = dynamicArea.querySelectorAll('.sbj-editor-toolbar[data-editor-target]');
    toolbars.forEach((toolbar) => {
      const targetId = String(toolbar.getAttribute('data-editor-target') || '');
      const editor = targetId ? document.getElementById(targetId) : null;
      const isActiveEditor = Boolean(editor && activeEditor === editor);
      toolbar.querySelectorAll('[data-toggle-cmd]').forEach((button) => {
        const cmd = String(button.getAttribute('data-toggle-cmd') || '');
        let active = false;
        if (isActiveEditor && cmd) {
          try {
            active = Boolean(document.queryCommandState(cmd));
          } catch {
            active = false;
          }
        }
        button.classList.toggle('is-active', active);
      });
    });
  };

  const renderShortNotesEditor = (context, items, page = 1) => {
    editorItemsMap = new Map(items.map((item) => [Number(item.id), item]));
    const allItems = Array.isArray(items) ? items : [];
    const totalPages = Math.max(1, Math.ceil(allItems.length / 40));
    const currentPage = Math.min(Math.max(1, Number(page || 1)), totalPages);
    const start = (currentPage - 1) * 40;
    const pageItems = allItems.slice(start, start + 40);
    const indexedPageItems = pageItems.map((item, index) => ({ item, displayIndex: start + index + 1 }));
    const leftItems = indexedPageItems.slice(0, 20);
    const rightItems = indexedPageItems.slice(20, 40);
    const pageTokens = buildPageTokens(totalPages, currentPage);
    const renderNoteItem = (entry) => {
      const item = entry?.item || {};
      const displayIndex = Number(entry?.displayIndex || 0);
      return '<article class="sbj-note-row" data-note-id="' + Number(item.id) + '">'
        + '<span class="sbj-note-index">' + String(displayIndex) + '.</span>'
        + '<div class="sbj-note-main"><div class="sbj-note-body">' + richDisplayValue(item.body || '') + '</div>'
        + (item?.imageUrl ? ('<img class="sbj-note-image" src="' + escapeHtml(item.imageUrl) + '" alt="Note image" />') : '')
        + '</div>'
        + '<div class="sbj-note-actions">'
        + '<button type="button" class="sbj-icon-btn sbj-icon-btn-edit" data-action="edit-note" data-item-id="' + Number(item.id) + '" aria-label="Edit note" title="Edit note">' + editIcon + '</button>'
        + '<button type="button" class="sbj-icon-btn sbj-icon-btn-delete" data-action="delete-item" data-item-id="' + Number(item.id) + '" aria-label="Delete note" title="Delete note">' + deleteIcon + '</button>'
        + '</div>'
        + '</article>';
    };
    return '<section class="sbj-card">'
      + '<header class="sbj-toolbar sbj-toolbar-light"><h3>Short Notes - ' + escapeHtml(context?.label || '') + '</h3>'
      + '<div class="sbj-mcq-head-tools"><span class="sbj-mcq-count">Page ' + String(currentPage) + ' / ' + String(totalPages) + ' - ' + String(allItems.length) + ' total</span></div></header>'
      + '<form id="notesForm" class="sbj-form sbj-form-flat" autocomplete="off">'
      + '<input type="hidden" name="itemId" value="0" />'
      + '<input type="hidden" name="clearImageFlag" value="0" />'
      + editorToolbar({ targetId: 'notesBodyEditor', includeNoteImage: true })
      + '<div id="notesBodyEditor" class="sbj-editor sbj-editor-lite" contenteditable="true" data-editor-surface="true"></div>'
      + '<div class="sbj-form-actions">'
      + '<button type="button" class="sbj-secondary" data-action="cancel-item-edit">Cancel edit</button>'
      + '<button type="submit" class="sbj-primary">Save note</button>'
      + '</div>'
      + '</form>'
      + '<div class="sbj-content-columns">'
      + '<div class="sbj-content-column sbj-notes-list">' + (leftItems.length ? leftItems.map(renderNoteItem).join('') : '<p class="sbj-empty">No short notes yet.</p>') + '</div>'
      + '<div class="sbj-content-column sbj-notes-list">' + (rightItems.length ? rightItems.map(renderNoteItem).join('') : '') + '</div>'
      + '</div>'
      + (totalPages > 1
        ? ('<nav class="sbj-mcq-pager" aria-label="Short notes pages">'
          + '<button type="button" class="sbj-secondary sbj-page-btn" data-action="notes-page" data-page="' + String(Math.max(1, currentPage - 1)) + '"' + (currentPage === 1 ? ' disabled' : '') + '>Prev</button>'
          + pageTokens.map((token) => {
            if (token === '...') return '<span class="sbj-page-gap">...</span>';
            const isActive = Number(token) === currentPage;
            return '<button type="button" class="sbj-page-btn ' + (isActive ? 'is-active' : '') + '" data-action="notes-page" data-page="' + String(Number(token)) + '"' + (isActive ? ' aria-current="page"' : '') + '>' + String(Number(token)) + '</button>';
          }).join('')
          + '<button type="button" class="sbj-secondary sbj-page-btn" data-action="notes-page" data-page="' + String(Math.min(totalPages, currentPage + 1)) + '"' + (currentPage >= totalPages ? ' disabled' : '') + '>Next</button>'
          + '</nav>')
        : '')
      + '</section>';
  };

  const renderSummaryEditor = (context, items) => {
    const summary = Array.isArray(items) && items.length ? items[0] : null;
    editorItemsMap = summary ? new Map([[Number(summary.id), summary]]) : new Map();
    const hasSummary = Boolean(summary && (String(summary?.body || '').trim() || String(summary?.imageUrl || '').trim()));
    return '<section class="sbj-card">'
      + '<header class="sbj-toolbar"><h3>Summary - ' + escapeHtml(context?.label || '') + '</h3>'
      + (hasSummary ? '<span class="sbj-empty">Edit and save inline</span>' : '')
      + '</header>'
      + '<form id="summaryForm" class="sbj-form sbj-summary-single sbj-form-flat" autocomplete="off">'
      + '<input type="hidden" name="itemId" value="' + String(Number(summary?.id || 0)) + '" />'
      + editorToolbar({ targetId: 'summaryBodyEditor' })
      + '<div id="summaryBodyEditor" class="sbj-editor" contenteditable="true" data-editor-surface="true">' + richDisplayValue(summary?.body || '') + '</div>'
      + '<label>Image (optional)<input name="image" type="file" accept="image/png,image/jpeg,image/webp" /></label>'
      + '<label class="sbj-inline-check"><input name="clearImage" type="checkbox" /> Remove existing image when updating</label>'
      + (summary?.imageUrl ? ('<img class="sbj-thumb" src="' + escapeHtml(summary.imageUrl) + '" alt="Summary image" />') : '')
      + '<div class="sbj-form-actions">'
      + '<button type="submit" class="sbj-primary">' + (hasSummary ? 'Update summary' : 'Save summary') + '</button>'
      + '</div>'
      + '</form>'
      + '</section>';
  };

  const renderMcqEditor = (context, items, page = 1) => {
    editorItemsMap = new Map(items.map((item) => [Number(item.id), item]));
    const allItems = Array.isArray(items) ? items : [];
    const totalPages = Math.max(1, Math.ceil(allItems.length / 40));
    const currentPage = Math.min(Math.max(1, Number(page || 1)), totalPages);
    const start = (currentPage - 1) * 40;
    const pageItems = allItems.slice(start, start + 40);
    const indexedPageItems = pageItems.map((item, index) => ({ item, displayIndex: start + index + 1 }));
    const leftItems = indexedPageItems.slice(0, 20);
    const rightItems = indexedPageItems.slice(20, 40);
    const pageTokens = buildPageTokens(totalPages, currentPage);
    const renderMcqItem = (entry) => {
      const item = entry?.item || {};
      const displayIndex = Number(entry?.displayIndex || 0);
      return (
      '<article class="sbj-mcq-item">'
        + '<div class="sbj-mcq-headline">'
        + '<div class="sbj-mcq-question"><span class="sbj-mcq-q-no">' + String(displayIndex) + '.</span><div>' + richDisplayValue(item.body || '') + '</div></div>'
        + '<div class="sbj-note-actions">'
        + '<button type="button" class="sbj-icon-btn sbj-icon-btn-edit" data-action="edit-mcq" data-item-id="' + Number(item.id) + '" aria-label="Edit MCQ" title="Edit MCQ">' + editIcon + '</button>'
        + '<button type="button" class="sbj-icon-btn sbj-icon-btn-delete" data-action="delete-item" data-item-id="' + Number(item.id) + '" aria-label="Delete MCQ" title="Delete MCQ">' + deleteIcon + '</button>'
        + '</div>'
        + '</div>'
        + (item?.imageUrl ? ('<img class="sbj-mcq-item-image" src="' + escapeHtml(item.imageUrl) + '" alt="MCQ image" />') : '')
        + '<ol class="sbj-mcq-options">'
        + '<li><span class="sbj-mcq-opt-key">A</span><span>' + richDisplayValue(item?.options?.[0] || '') + '</span></li>'
        + '<li><span class="sbj-mcq-opt-key">B</span><span>' + richDisplayValue(item?.options?.[1] || '') + '</span></li>'
        + '<li><span class="sbj-mcq-opt-key">C</span><span>' + richDisplayValue(item?.options?.[2] || '') + '</span></li>'
        + '<li><span class="sbj-mcq-opt-key">D</span><span>' + richDisplayValue(item?.options?.[3] || '') + '</span></li>'
        + '</ol>'
        + '<div class="sbj-mcq-foot">'
        + '<button type="button" class="sbj-answer-btn" data-action="toggle-mcq-answer-admin" aria-expanded="false">Show answer</button>'
        + '<span class="sbj-mcq-answer" data-mcq-answer hidden>Ans: ' + escapeHtml(item?.correctOption || '') + '</span>'
        + '</div>'
        + '</article>'
      );
    };

    return '<section class="sbj-card">'
      + '<header class="sbj-toolbar sbj-toolbar-light"><h3>MCQ Bank - ' + escapeHtml(context?.label || '') + '</h3>'
      + '<div class="sbj-mcq-head-tools"><span class="sbj-mcq-count">Page ' + String(currentPage) + ' / ' + String(totalPages) + ' - ' + String(allItems.length) + ' total</span>'
      + '<button type="button" class="sbj-secondary" data-action="toggle-mcq-form" aria-expanded="false">Add MCQ</button></div></header>'
      + '<div class="sbj-collapsible" data-mcq-form-wrap="1" aria-hidden="true">'
      + '<form id="mcqForm" class="sbj-form sbj-form-flat sbj-mcq-form" autocomplete="off">'
      + '<input type="hidden" name="itemId" value="0" />'
      + '<input type="hidden" name="clearImageFlag" value="0" />'
      + '<div class="sbj-mcq-compose-head">'
      + editorToolbar({ targetId: 'mcqQuestionEditor', includeMcqImage: true })
      + '</div>'
      + '<div id="mcqQuestionEditor" class="sbj-editor sbj-editor-lite" contenteditable="true" data-editor-surface="true"></div>'
      + '<div class="sbj-mcq-options-grid">'
      + '<div class="sbj-mcq-option-card"><div class="sbj-mcq-option-head"><span class="sbj-mcq-opt-pill">A</span><strong>Option A</strong></div>'
      + editorToolbar({ targetId: 'mcqOptAEditor', compact: true })
      + '<div id="mcqOptAEditor" class="sbj-editor sbj-editor-option" contenteditable="true" data-editor-surface="true"></div></div>'
      + '<div class="sbj-mcq-option-card"><div class="sbj-mcq-option-head"><span class="sbj-mcq-opt-pill">B</span><strong>Option B</strong></div>'
      + editorToolbar({ targetId: 'mcqOptBEditor', compact: true })
      + '<div id="mcqOptBEditor" class="sbj-editor sbj-editor-option" contenteditable="true" data-editor-surface="true"></div></div>'
      + '<div class="sbj-mcq-option-card"><div class="sbj-mcq-option-head"><span class="sbj-mcq-opt-pill">C</span><strong>Option C</strong></div>'
      + editorToolbar({ targetId: 'mcqOptCEditor', compact: true })
      + '<div id="mcqOptCEditor" class="sbj-editor sbj-editor-option" contenteditable="true" data-editor-surface="true"></div></div>'
      + '<div class="sbj-mcq-option-card"><div class="sbj-mcq-option-head"><span class="sbj-mcq-opt-pill">D</span><strong>Option D</strong></div>'
      + editorToolbar({ targetId: 'mcqOptDEditor', compact: true })
      + '<div id="mcqOptDEditor" class="sbj-editor sbj-editor-option" contenteditable="true" data-editor-surface="true"></div></div>'
      + '</div>'
      + '<div class="sbj-mcq-form-foot">'
      + '<label class="sbj-mcq-correct">Correct<select name="correctOption"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></label>'
      + '<div class="sbj-form-actions">'
      + '<button type="button" class="sbj-secondary" data-action="cancel-item-edit">Cancel</button>'
      + '<button type="submit" class="sbj-primary">Save MCQ</button>'
      + '</div></div></form></div>'
      + '<div class="sbj-mcq-divider" aria-hidden="true"></div>'
      + '<div class="sbj-mcq-columns">'
      + '<div class="sbj-mcq-column">' + (leftItems.length ? leftItems.map(renderMcqItem).join('') : '<p class="sbj-empty">No MCQ items yet.</p>') + '</div>'
      + '<div class="sbj-mcq-column">' + (rightItems.length ? rightItems.map(renderMcqItem).join('') : '') + '</div>'
      + '</div>'
      + (totalPages > 1
        ? ('<nav class="sbj-mcq-pager" aria-label="MCQ pages">'
          + '<button type="button" class="sbj-secondary sbj-page-btn" data-action="mcq-page" data-page="' + String(Math.max(1, currentPage - 1)) + '"' + (currentPage === 1 ? ' disabled' : '') + '>Prev</button>'
          + pageTokens.map((token) => {
            if (token === '...') return '<span class="sbj-page-gap">...</span>';
            const isActive = Number(token) === currentPage;
            return '<button type="button" class="sbj-page-btn ' + (isActive ? 'is-active' : '') + '" data-action="mcq-page" data-page="' + String(Number(token)) + '"' + (isActive ? ' aria-current="page"' : '') + '>' + String(Number(token)) + '</button>';
          }).join('')
          + '<button type="button" class="sbj-secondary sbj-page-btn" data-action="mcq-page" data-page="' + String(Math.min(totalPages, currentPage + 1)) + '"' + (currentPage >= totalPages ? ' disabled' : '') + '>Next</button>'
          + '</nav>')
        : '')
      + '</section>';
  };

  const setMcqFormOpen = (open) => {
    const wrap = document.querySelector('[data-mcq-form-wrap]');
    const toggle = document.querySelector('[data-action="toggle-mcq-form"]');
    if (!wrap) return;
    const isOpen = Boolean(open);
    wrap.classList.toggle('is-open', isOpen);
    wrap.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if (toggle) {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.textContent = isOpen ? 'Close' : 'Add MCQ';
    }
  };

  const setNoteImagePreview = (form, imageUrl = '', options = {}) => {
    if (!form) return;
    const preview = form.querySelector('[data-note-image-preview]');
    const remove = form.querySelector('[data-action="remove-note-image"]');
    if (!preview || !remove) return;

    const previousTempUrl = String(form.dataset.noteTempUrl || '');
    if (previousTempUrl) {
      URL.revokeObjectURL(previousTempUrl);
      form.dataset.noteTempUrl = '';
    }

    const nextUrl = String(imageUrl || '').trim();
    if (!nextUrl) {
      preview.hidden = true;
      preview.removeAttribute('src');
      remove.hidden = true;
      form.dataset.noteUsingTemp = '0';
      return;
    }

    preview.hidden = false;
    preview.src = nextUrl;
    remove.hidden = false;
    form.dataset.noteUsingTemp = options.temp ? '1' : '0';
    if (options.temp) form.dataset.noteTempUrl = nextUrl;
  };

  const setMcqImagePreview = (form, imageUrl = '', options = {}) => {
    if (!form) return;
    const preview = form.querySelector('[data-mcq-image-preview]');
    const remove = form.querySelector('[data-action="remove-mcq-image"]');
    if (!preview || !remove) return;

    const previousTempUrl = String(form.dataset.mcqTempUrl || '');
    if (previousTempUrl) {
      URL.revokeObjectURL(previousTempUrl);
      form.dataset.mcqTempUrl = '';
    }

    const nextUrl = String(imageUrl || '').trim();
    if (!nextUrl) {
      preview.hidden = true;
      preview.removeAttribute('src');
      remove.hidden = true;
      form.dataset.mcqUsingTemp = '0';
      return;
    }

    preview.hidden = false;
    preview.src = nextUrl;
    remove.hidden = false;
    form.dataset.mcqUsingTemp = options.temp ? '1' : '0';
    if (options.temp) form.dataset.mcqTempUrl = nextUrl;
  };

  const renderPlaceholderEditor = (context, contentType) => {
    const label = contentTypeLabel(contentType);
    return '<section class="sbj-card">'
      + '<header class="sbj-toolbar"><h3>' + escapeHtml(label) + ' - ' + escapeHtml(context?.label || '') + '</h3></header>'
      + '<p class="sbj-empty">This section is intentionally blank for now. ' + escapeHtml(label) + ' editor will be added next.</p>'
      + '</section>';
  };

  const renderActiveTabContent = async (tabKey, options = {}) => {
    if (!currentTabContext) return;
    const key = String(tabKey || '').toLowerCase();
    const types = Array.isArray(currentTabContext.contentTypes) ? currentTabContext.contentTypes : [];
    const validKeys = types.map((item) => String(item?.key || '').toLowerCase()).filter(Boolean);
    if (!validKeys.includes(key)) return;
    const typeMeta = types.find((item) => String(item?.key || '').toLowerCase() === key) || null;
    const editable = isEditableContentType(key, Boolean(typeMeta?.editable));
    const editorMode = editorModeForType(key);

    currentTabContext.activeTab = key;
    if (options.updateUrl !== false) updateTabInUrl(key);

    const panel = document.getElementById('contentTabPanel');
    if (!panel) return;

    const tabButtons = dynamicArea.querySelectorAll('.sbj-tab[data-tab-key]');
    tabButtons.forEach((btn) => {
      const isActive = String(btn.getAttribute('data-tab-key') || '') === key;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    requestAnimationFrame(updateTabsIndicator);

    const contextLabel = currentTabContext.topic?.name
      || currentTabContext.chapter?.name
      || currentTabContext.node?.displayName
      || currentTabContext.node?.serverName
      || 'Content';
    const context = { label: contextLabel };

    if (!editable || !editorMode) {
      if (options.updateUrl !== false) updateNotesPageInUrl(1);
      if (options.updateUrl !== false) updateMcqPageInUrl(1);
      panel.innerHTML = renderPlaceholderEditor(context, key);
      return;
    }

    const itemsPayload = await apiRequest('/subjects/' + subjectId + '/content-items?contextType=' + encodeURIComponent(currentTabContext.contextType) + '&contextId=' + encodeURIComponent(String(currentTabContext.contextId)) + '&contentType=' + encodeURIComponent(key));
    const items = Array.isArray(itemsPayload?.items) ? itemsPayload.items : [];
    const requestedNotesPage = Number(options?.notesPage || (key === 'short_notes' ? readNotesPageFromUrl() : 1));
    const requestedMcqPage = Number(options?.mcqPage || (key === 'mcq_bank' ? readMcqPageFromUrl() : 1));
    const totalNotesPages = Math.max(1, Math.ceil(items.length / 40));
    const safeNotesPage = Math.min(Math.max(1, requestedNotesPage), totalNotesPages);
    const totalPages = Math.max(1, Math.ceil(items.length / 40));
    const safeMcqPage = Math.min(Math.max(1, requestedMcqPage), totalPages);
    panel.innerHTML = editorMode === 'short_notes'
      ? renderShortNotesEditor(context, items, safeNotesPage)
      : editorMode === 'summary'
        ? renderSummaryEditor(context, items)
        : renderMcqEditor(context, items, safeMcqPage);

    if (editorMode === 'short_notes') {
      if (options.updateUrl !== false) updateNotesPageInUrl(safeNotesPage);
      if (options.updateUrl !== false) updateMcqPageInUrl(1);
      requestAnimationFrame(updateEditorToolbarState);
    } else if (editorMode === 'mcq_bank') {
      if (options.updateUrl !== false) updateNotesPageInUrl(1);
      if (options.updateUrl !== false) updateMcqPageInUrl(safeMcqPage);
      setMcqFormOpen(false);
      requestAnimationFrame(updateEditorToolbarState);
    } else {
      if (options.updateUrl !== false) updateNotesPageInUrl(1);
      if (options.updateUrl !== false) updateMcqPageInUrl(1);
    }
  };

  const renderEditor = async (state) => {
    const context = await apiRequest('/subjects/' + subjectId + '/content-context?contextType=' + encodeURIComponent(state.contextType) + '&contextId=' + encodeURIComponent(String(state.contextId)));

    titleEl.textContent = context?.subject?.name || ('Subject #' + subjectId);
    subtitleEl.textContent = classText(context?.subject) + ' | ' + String(context?.label || 'Content');

    const crumbs = [];
    if (context?.node?.id) {
      crumbs.push({ label: context.node.displayName || context.node.serverName, href: subjectHref('node=' + Number(context.node.id)) });
    }
    if (context?.chapter?.id) {
      crumbs.push({ label: context.chapter.name || 'Chapter', href: subjectHref('chapter=' + Number(context.chapter.id)) });
    }
    if (context?.topic?.id) {
      crumbs.push({ label: context.topic.name || 'Topic', href: subjectHref('topic=' + Number(context.topic.id)) });
    }
    const contextContentTypes = Array.isArray(context?.contentTypes) ? context.contentTypes : [];
    const selectedContextType = contextContentTypes.find((item) => String(item?.key || '').toLowerCase() === String(state.editor || '').toLowerCase()) || null;
    const contentLabel = contentTypeLabel(state.editor, selectedContextType?.label);
    const editorMode = editorModeForType(state.editor);
    crumbs.push({ label: contentLabel });
    setBreadcrumb(crumbs);

    if (!editorMode || !isEditableContentType(state.editor, Boolean(selectedContextType?.editable))) {
      dynamicArea.innerHTML = renderPlaceholderEditor(context, state.editor);
      return;
    }

    const itemsPayload = await apiRequest('/subjects/' + subjectId + '/content-items?contextType=' + encodeURIComponent(state.contextType) + '&contextId=' + encodeURIComponent(String(state.contextId)) + '&contentType=' + encodeURIComponent(state.editor));
    const items = Array.isArray(itemsPayload?.items) ? itemsPayload.items : [];

    dynamicArea.innerHTML = editorMode === 'short_notes'
      ? renderShortNotesEditor(context, items, readNotesPageFromUrl())
      : editorMode === 'summary'
        ? renderSummaryEditor(context, items)
        : renderMcqEditor(context, items, readMcqPageFromUrl());
  };

  const openChapterModal = (mode, values = {}) => {
    chapterForm.reset();
    chapterForm.elements.mode.value = mode;
    chapterForm.elements.nodeId.value = String(Number(values?.nodeId || 0));
    chapterForm.elements.chapterId.value = String(Number(values?.chapterId || 0));
    chapterForm.elements.name.value = String(values?.name || '');
    chapterForm.elements.topicsEnabled.checked = Boolean(values?.topicsEnabled);
    chapterModalImageInput.value = '';
    syncChapterModalImageUi();
    chapterTopicsToggleWrap.hidden = !Boolean(values?.supportsTopics);
    chapterModalTitle.textContent = mode === 'edit' ? 'Edit chapter' : 'Add chapter';
    chapterModal.classList.add('is-open');
    chapterModal.setAttribute('aria-hidden', 'false');
  };

  const closeChapterModal = () => {
    chapterModal.classList.remove('is-open');
    chapterModal.setAttribute('aria-hidden', 'true');
    chapterForm.reset();
    chapterModalImageInput.value = '';
    syncChapterModalImageUi();
    chapterTopicsToggleWrap.hidden = false;
  };

  const openTopicModal = (mode, values = {}) => {
    topicForm.reset();
    topicForm.elements.mode.value = mode;
    topicForm.elements.chapterId.value = String(Number(values?.chapterId || 0));
    topicForm.elements.topicId.value = String(Number(values?.topicId || 0));
    topicForm.elements.name.value = String(values?.name || '');
    topicForm.elements.clearImage.value = '0';
    topicForm.dataset.existingImage = String(values?.imageUrl || '').trim();
    topicModalImageInput.value = '';
    syncTopicModalImageUi();
    topicModalTitle.textContent = mode === 'edit' ? 'Edit topic' : 'Add topic';
    topicModal.classList.add('is-open');
    topicModal.setAttribute('aria-hidden', 'false');
  };

  const closeTopicModal = () => {
    topicModal.classList.remove('is-open');
    topicModal.setAttribute('aria-hidden', 'true');
    topicForm.reset();
    topicForm.dataset.existingImage = '';
    topicModalImageInput.value = '';
    topicForm.elements.clearImage.value = '0';
    syncTopicModalImageUi();
  };

  const openContentPrefsModal = (values = {}) => {
    const contextType = String(values?.contextType || '').trim().toLowerCase();
    const contextId = Number(values?.contextId || 0);
    if (!contextId || (contextType !== 'chapter' && contextType !== 'topic')) return;

    const availableTypes = parseContentTypeKeys(values?.availableTypes || '');
    const selectedSet = new Set(parseContentTypeKeys(values?.selectedTypes || '').filter((key) => availableTypes.includes(key)));
    const contextLabel = String(values?.contextLabel || '').trim() || (contextType === 'chapter' ? 'chapter' : 'topic');

    contentPrefsForm.reset();
    contentPrefsForm.elements.contextType.value = contextType;
    contentPrefsForm.elements.contextId.value = String(contextId);
    contentPrefsModalTitle.textContent = 'Content preferences';
    contentPrefsModalHint.textContent = 'Choose which tabs will be visible for "' + contextLabel + '".';

    if (!availableTypes.length) {
      contentPrefsOptions.innerHTML = '<p class="sbj-empty">No content modules available for this item.</p>';
    } else {
      contentPrefsOptions.innerHTML = availableTypes.map((key) => (
        '<label class="sbj-pref-option">'
          + '<input type="checkbox" name="contentTypes" value="' + escapeHtml(key) + '"' + (selectedSet.has(key) ? ' checked' : '') + ' />'
          + '<span>' + escapeHtml(contentTypeLabel(key, key)) + '</span>'
          + '</label>'
      )).join('');
    }

    contentPrefsModal.classList.add('is-open');
    contentPrefsModal.setAttribute('aria-hidden', 'false');
  };

  const closeContentPrefsModal = () => {
    contentPrefsModal.classList.remove('is-open');
    contentPrefsModal.setAttribute('aria-hidden', 'true');
    contentPrefsForm.reset();
    contentPrefsOptions.innerHTML = '';
    contentPrefsModalHint.textContent = '';
  };

  const submitContentPrefsModal = async (event) => {
    event.preventDefault();
    const contextType = String(contentPrefsForm.elements.contextType.value || '').trim().toLowerCase();
    const contextId = Number(contentPrefsForm.elements.contextId.value || 0);
    if (!contextId || (contextType !== 'chapter' && contextType !== 'topic')) {
      throw new Error('Unable to resolve preference context');
    }
    const selectedTypes = Array.from(contentPrefsForm.querySelectorAll('input[name="contentTypes"]:checked'))
      .map((input) => String(input?.value || '').trim().toLowerCase())
      .filter((value, index, list) => Boolean(value) && list.indexOf(value) === index);
    const path = contextType === 'chapter'
      ? ('/subjects/' + subjectId + '/chapters/' + contextId)
      : ('/subjects/' + subjectId + '/topics/' + contextId);

    setMsg('Saving preferences...');
    await apiRequest(path, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contentTypes: selectedTypes }),
    });
    setMsg('Preferences saved.');
    showToast('Preferences saved', 'success');
    closeContentPrefsModal();
    await loadView();
  };

  const loadView = async () => {
    setMsg('Loading...');
    editorItemsMap = new Map();
    currentTabContext = null;
    try {
      const state = currentState();
      currentMode = state.mode;
      if (state.mode === 'root') {
        const payload = await apiRequest('/subjects/' + subjectId);
        const directNodeId = directChapterNodeIdForTemplate(payload);
        if (directNodeId > 0) {
          const nodePayload = await apiRequest('/subjects/' + subjectId + '/nodes/' + directNodeId);
          currentMode = 'node';
          await renderNodeView(nodePayload, { mode: 'node', nodeId: directNodeId });
        } else {
          renderRoot(payload);
        }
      } else if (state.mode === 'node') {
        const payload = await apiRequest('/subjects/' + subjectId + '/nodes/' + state.nodeId);
        await renderNodeView(payload, state);
      } else if (state.mode === 'chapter') {
        const payload = await apiRequest('/subjects/' + subjectId + '/chapters/' + state.chapterId);
        await renderChapterView(payload, state);
      } else if (state.mode === 'topic') {
        const payload = await apiRequest('/subjects/' + subjectId + '/topics/' + state.topicId);
        await renderTopicView(payload, state);
      } else {
        const tab = encodeURIComponent(state.editor || state.tab || '');
        if (state.contextType === 'node') {
          navigate(subjectHref('node=' + Number(state.contextId || 0) + (tab ? '&tab=' + tab : '')));
          return;
        }
        if (state.contextType === 'chapter') {
          navigate(subjectHref('chapter=' + Number(state.contextId || 0) + (tab ? '&tab=' + tab : '')));
          return;
        }
        if (state.contextType === 'topic') {
          navigate(subjectHref('topic=' + Number(state.contextId || 0) + (tab ? '&tab=' + tab : '')));
          return;
        }
        await renderEditor(state);
      }
      setMsg('');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      dynamicArea.innerHTML = '<section class="sbj-card"><p class="sbj-empty">Unable to load this subject view.</p></section>';
      setMsg(error?.message || 'Unable to load subject view');
    }
  };

  const saveNodeRow = async (row, nodeId, options = {}) => {
    if (!row || !nodeId) return;

    const nameInput = row.querySelector('[data-field="displayName"]');
    const nextName = String(nameInput?.value || '').trim();
    const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
    if (!nextName || nextName.length < 2) {
      throw new Error('Display name must be at least 2 characters');
    }
    if (!options.force && nextName === savedName) return;
    const payload = { displayName: nextName };

    if (nameInput) nameInput.classList.add('is-syncing');
    try {
      setMsg('Syncing section...');
      const response = await apiRequest('/subjects/' + subjectId + '/nodes/' + nodeId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const persisted = String(response?.node?.displayName || nextName);
      if (nameInput) {
        nameInput.value = persisted;
        nameInput.setAttribute('data-saved-value', persisted);
      }
      setMsg('Section synced.');
      showToast('Section synced', 'success');
    } finally {
      if (nameInput) nameInput.classList.remove('is-syncing');
    }
  };

  const updateNodeImage = async (row, nodeId, options = {}) => {
    if (!row || !nodeId) return;
    const nameInput = row.querySelector('[data-field="displayName"]');
    const payload = {
      displayName: String(nameInput?.value || '').trim(),
    };

    if (options.file) {
      payload.imageData = await fileToDataUrl(options.file);
    }
    if (options.clear) {
      payload.clearImage = true;
    }

    setMsg(options.clear ? 'Removing image...' : 'Uploading image...');
    await apiRequest('/subjects/' + subjectId + '/nodes/' + nodeId, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setMsg(options.clear ? 'Image removed.' : 'Image updated.');
    showToast(options.clear ? 'Image removed' : 'Image synced', 'success');
    await loadView();
  };

  const saveChapterRow = async (row, chapterId, options = {}) => {
    if (!row || !chapterId) return;
    const nameInput = row.querySelector('[data-field="chapterName"]');
    const topicsInput = row.querySelector('[data-field="chapterTopicsEnabled"]');
    const nextName = String(nameInput?.value || '').trim();
    const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
    const topicsEnabled = Boolean(topicsInput?.checked);
    const savedTopics = String(topicsInput?.getAttribute('data-saved-value') || '') === '1';
    if (!nextName || nextName.length < 2) {
      throw new Error('Chapter name must be at least 2 characters');
    }
    if (!options.force && nextName === savedName && topicsEnabled === savedTopics) return;

    if (nameInput) nameInput.classList.add('is-syncing');
    try {
      setMsg('Syncing chapter...');
      const response = await apiRequest('/subjects/' + subjectId + '/chapters/' + chapterId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: nextName, topicsEnabled }),
      });
      const persisted = String(response?.chapter?.name || nextName);
      if (nameInput) {
        nameInput.value = persisted;
        nameInput.setAttribute('data-saved-value', persisted);
      }
      if (topicsInput) {
        topicsInput.checked = Boolean(response?.chapter?.topicsEnabled);
        topicsInput.setAttribute('data-saved-value', topicsInput.checked ? '1' : '0');
      }
      const deleteBtn = row.querySelector('[data-action="delete-chapter"]');
      if (deleteBtn) deleteBtn.setAttribute('data-chapter-name', persisted);
      setMsg('Chapter synced.');
      showToast('Chapter synced', 'success');
    } finally {
      if (nameInput) nameInput.classList.remove('is-syncing');
    }
  };

  const updateChapterImage = async (row, chapterId, options = {}) => {
    if (!row || !chapterId) return;
    const nameInput = row.querySelector('[data-field="chapterName"]');
    const topicsInput = row.querySelector('[data-field="chapterTopicsEnabled"]');
    const chapterName = String(nameInput?.value || '').trim() || String(nameInput?.getAttribute('data-saved-value') || '').trim();
    if (!chapterName) throw new Error('Chapter name is required');
    const payload = {
      name: chapterName,
      topicsEnabled: Boolean(topicsInput?.checked),
    };
    if (options.file) payload.imageData = await fileToDataUrl(options.file);
    if (options.clear) payload.clearImage = true;

    setMsg(options.clear ? 'Removing chapter image...' : 'Uploading chapter image...');
    await apiRequest('/subjects/' + subjectId + '/chapters/' + chapterId, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setMsg(options.clear ? 'Chapter image removed.' : 'Chapter image synced.');
    showToast(options.clear ? 'Image removed' : 'Image synced', 'success');
    await loadView();
  };

  const saveTopicRow = async (row, topicId, options = {}) => {
    if (!row || !topicId) return;
    const nameInput = row.querySelector('[data-field="topicName"]');
    const nextName = String(nameInput?.value || '').trim();
    const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
    if (!nextName || nextName.length < 2) throw new Error('Topic name must be at least 2 characters');
    if (!options.force && nextName === savedName) return;

    if (nameInput) nameInput.classList.add('is-syncing');
    try {
      setMsg('Syncing topic...');
      const response = await apiRequest('/subjects/' + subjectId + '/topics/' + topicId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: nextName }),
      });
      const persisted = String(response?.topic?.name || nextName);
      if (nameInput) {
        nameInput.value = persisted;
        nameInput.setAttribute('data-saved-value', persisted);
      }
      const deleteBtn = row.querySelector('[data-action="delete-topic"]');
      if (deleteBtn) deleteBtn.setAttribute('data-topic-name', persisted);
      setMsg('Topic synced.');
      showToast('Topic synced', 'success');
    } finally {
      if (nameInput) nameInput.classList.remove('is-syncing');
    }
  };

  const updateTopicImage = async (row, topicId, options = {}) => {
    if (!row || !topicId) return;
    const nameInput = row.querySelector('[data-field="topicName"]');
    const name = String(nameInput?.value || '').trim() || String(nameInput?.getAttribute('data-saved-value') || '').trim();
    if (!name) throw new Error('Topic name is required');
    const payload = { name };
    if (options.file) payload.imageData = await fileToDataUrl(options.file);
    if (options.clear) payload.clearImage = true;
    setMsg(options.clear ? 'Removing topic image...' : 'Uploading topic image...');
    await apiRequest('/subjects/' + subjectId + '/topics/' + topicId, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setMsg(options.clear ? 'Topic image removed.' : 'Topic image synced.');
    showToast(options.clear ? 'Image removed' : 'Image synced', 'success');
    await loadView();
  };

  const submitChapterModal = async (event) => {
    event.preventDefault();
    const formData = new FormData(chapterForm);
    const mode = String(formData.get('mode') || 'create');
    const nodeId = Number(formData.get('nodeId') || 0);
    const chapterId = Number(formData.get('chapterId') || 0);
    const name = String(formData.get('name') || '').trim();
    const file = formData.get('image');
    const topicsEnabled = Boolean(formData.get('topicsEnabled'));

    const payload = { name, nodeId, topicsEnabled };
    if (file && typeof file === 'object' && file.size > 0) {
      payload.imageData = await fileToDataUrl(file);
    }

    setMsg(mode === 'edit' ? 'Updating chapter...' : 'Creating chapter...');
    if (mode === 'edit') {
      await apiRequest('/subjects/' + subjectId + '/chapters/' + chapterId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('Chapter updated.');
    } else {
      await apiRequest('/subjects/' + subjectId + '/chapters', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('Chapter created.');
    }
    closeChapterModal();
    await loadView();
  };

  const submitTopicModal = async (event) => {
    event.preventDefault();
    const formData = new FormData(topicForm);
    const mode = String(formData.get('mode') || 'create');
    const chapterId = Number(formData.get('chapterId') || 0);
    const topicId = Number(formData.get('topicId') || 0);
    const name = String(formData.get('name') || '').trim();
    const file = formData.get('image');
    const clearImage = String(formData.get('clearImage') || '0') === '1';

    const payload = { chapterId, name };
    if (file && typeof file === 'object' && file.size > 0) {
      payload.imageData = await fileToDataUrl(file);
    }
    if (clearImage) payload.clearImage = true;

    setMsg(mode === 'edit' ? 'Updating topic...' : 'Creating topic...');
    if (mode === 'edit') {
      await apiRequest('/subjects/' + subjectId + '/topics/' + topicId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('Topic updated.');
    } else {
      await apiRequest('/subjects/' + subjectId + '/topics', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('Topic created.');
    }
    closeTopicModal();
    await loadView();
  };

  const submitNotesForm = async (form) => {
    const state = currentState();
    const contextType = String(currentTabContext?.contextType || (state.mode === 'topic' ? 'topic' : state.mode === 'chapter' ? 'chapter' : state.mode === 'node' ? 'node' : state.contextType || ''));
    const contextId = Number(currentTabContext?.contextId || (state.mode === 'topic' ? state.topicId : state.mode === 'chapter' ? state.chapterId : state.mode === 'node' ? state.nodeId : state.contextId || 0));
    if (!contextType || contextId <= 0) {
      throw new Error('Unable to resolve content context. Please reopen this tab.');
    }
    const itemId = Number(form.elements.itemId.value || 0);
    const editor = document.getElementById('notesBodyEditor');
    const file = form.elements.noteImageFile?.files?.[0] || null;
    const clearImage = String(form.elements.clearImageFlag?.value || '0') === '1';

    const payload = {
      contentType: 'short_notes',
      contextType,
      contextId,
      body: editorHtmlValue(editor, { required: true, label: 'Short note' }),
    };
    if (file) payload.imageData = await fileToDataUrl(file);
    if (clearImage) payload.clearImage = true;

    if (itemId > 0) {
      setMsg('Updating note...');
      await apiRequest('/subjects/' + subjectId + '/content-items/' + itemId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('Note updated.');
    } else {
      setMsg('Saving note...');
      await apiRequest('/subjects/' + subjectId + '/content-items', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('Note added.');
    }

    await loadView();
  };

  const submitSummaryForm = async (form) => {
    const state = currentState();
    const contextType = String(currentTabContext?.contextType || (state.mode === 'topic' ? 'topic' : state.mode === 'chapter' ? 'chapter' : state.mode === 'node' ? 'node' : state.contextType || ''));
    const contextId = Number(currentTabContext?.contextId || (state.mode === 'topic' ? state.topicId : state.mode === 'chapter' ? state.chapterId : state.mode === 'node' ? state.nodeId : state.contextId || 0));
    if (!contextType || contextId <= 0) throw new Error('Unable to resolve content context. Please reopen this tab.');
    const itemId = Number(form.elements.itemId.value || 0);
    const editor = document.getElementById('summaryBodyEditor');
    const file = form.elements.image.files?.[0] || null;
    const clearImage = Boolean(form.elements.clearImage.checked);
    const payload = {
      contentType: 'summary',
      contextType,
      contextId,
      body: editorHtmlValue(editor, { required: true, label: 'Summary' }),
    };
    if (file) payload.imageData = await fileToDataUrl(file);
    if (clearImage) payload.clearImage = true;

    if (itemId > 0) {
      setMsg('Saving summary...');
      await apiRequest('/subjects/' + subjectId + '/content-items/' + itemId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      setMsg('Saving summary...');
      await apiRequest('/subjects/' + subjectId + '/content-items', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setMsg('Summary saved.');
    showToast('Summary synced', 'success');
    await loadView();
  };

  const submitMcqForm = async (form) => {
    const state = currentState();
    const contextType = String(currentTabContext?.contextType || (state.mode === 'topic' ? 'topic' : state.mode === 'chapter' ? 'chapter' : state.mode === 'node' ? 'node' : state.contextType || ''));
    const contextId = Number(currentTabContext?.contextId || (state.mode === 'topic' ? state.topicId : state.mode === 'chapter' ? state.chapterId : state.mode === 'node' ? state.nodeId : state.contextId || 0));
    if (!contextType || contextId <= 0) {
      throw new Error('Unable to resolve content context. Please reopen this tab.');
    }
    const itemId = Number(form.elements.itemId.value || 0);
    const editor = document.getElementById('mcqQuestionEditor');
    const optAEditor = document.getElementById('mcqOptAEditor');
    const optBEditor = document.getElementById('mcqOptBEditor');
    const optCEditor = document.getElementById('mcqOptCEditor');
    const optDEditor = document.getElementById('mcqOptDEditor');
    const file = form.elements.image.files?.[0] || null;
    const clearImage = String(form.elements.clearImageFlag?.value || '0') === '1';

    const payload = {
      contentType: 'mcq_bank',
      contextType,
      contextId,
      body: editorHtmlValue(editor, { required: true, label: 'MCQ question' }),
      options: [
        editorHtmlValue(optAEditor, { required: true, label: 'Option A' }),
        editorHtmlValue(optBEditor, { required: true, label: 'Option B' }),
        editorHtmlValue(optCEditor, { required: true, label: 'Option C' }),
        editorHtmlValue(optDEditor, { required: true, label: 'Option D' }),
      ],
      correctOption: String(form.elements.correctOption.value || '').trim(),
    };

    if (file) payload.imageData = await fileToDataUrl(file);
    if (clearImage) payload.clearImage = true;

    if (itemId > 0) {
      setMsg('Updating MCQ...');
      await apiRequest('/subjects/' + subjectId + '/content-items/' + itemId, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('MCQ updated.');
    } else {
      setMsg('Saving MCQ...');
      await apiRequest('/subjects/' + subjectId + '/content-items', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMsg('MCQ added.');
    }

    await loadView();
  };

  const fillNoteForEdit = (itemId) => {
    const item = editorItemsMap.get(Number(itemId));
    const form = document.getElementById('notesForm');
    const editor = document.getElementById('notesBodyEditor');
    if (!item || !form || !editor) return;
    form.elements.itemId.value = String(Number(item.id));
    editor.innerHTML = richDisplayValue(item.body || '');
    if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = '0';
    form.dataset.noteExistingImage = String(item?.imageUrl || '');
    setNoteImagePreview(form, String(item?.imageUrl || ''), { temp: false });
  };

  const fillMcqForEdit = (itemId) => {
    const item = editorItemsMap.get(Number(itemId));
    const form = document.getElementById('mcqForm');
    const editor = document.getElementById('mcqQuestionEditor');
    const optAEditor = document.getElementById('mcqOptAEditor');
    const optBEditor = document.getElementById('mcqOptBEditor');
    const optCEditor = document.getElementById('mcqOptCEditor');
    const optDEditor = document.getElementById('mcqOptDEditor');
    if (!item || !form || !editor) return;

    form.elements.itemId.value = String(Number(item.id));
    editor.innerHTML = richDisplayValue(item.body || '');
    if (optAEditor) optAEditor.innerHTML = richDisplayValue(item?.options?.[0] || '');
    if (optBEditor) optBEditor.innerHTML = richDisplayValue(item?.options?.[1] || '');
    if (optCEditor) optCEditor.innerHTML = richDisplayValue(item?.options?.[2] || '');
    if (optDEditor) optDEditor.innerHTML = richDisplayValue(item?.options?.[3] || '');
    form.elements.correctOption.value = String(item?.correctOption || 'A');
    if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = '0';
    form.dataset.mcqExistingImage = String(item?.imageUrl || '');
    setMcqImagePreview(form, String(item?.imageUrl || ''), { temp: false });
    setMcqFormOpen(true);
  };

  const clearCurrentItemEdit = () => {
    const notesForm = document.getElementById('notesForm');
    if (notesForm) {
      notesForm.reset();
      notesForm.elements.itemId.value = '0';
      if (notesForm.elements.clearImageFlag) notesForm.elements.clearImageFlag.value = '0';
      notesForm.dataset.noteExistingImage = '';
      setNoteImagePreview(notesForm, '', { temp: false });
      const editor = document.getElementById('notesBodyEditor');
      if (editor) editor.innerHTML = '';
    }

    const mcqForm = document.getElementById('mcqForm');
    if (mcqForm) {
      mcqForm.reset();
      mcqForm.elements.itemId.value = '0';
      if (mcqForm.elements.clearImageFlag) mcqForm.elements.clearImageFlag.value = '0';
      mcqForm.dataset.mcqExistingImage = '';
      setMcqImagePreview(mcqForm, '', { temp: false });
      const editor = document.getElementById('mcqQuestionEditor');
      if (editor) editor.innerHTML = '';
      const optAEditor = document.getElementById('mcqOptAEditor');
      const optBEditor = document.getElementById('mcqOptBEditor');
      const optCEditor = document.getElementById('mcqOptCEditor');
      const optDEditor = document.getElementById('mcqOptDEditor');
      if (optAEditor) optAEditor.innerHTML = '';
      if (optBEditor) optBEditor.innerHTML = '';
      if (optCEditor) optCEditor.innerHTML = '';
      if (optDEditor) optDEditor.innerHTML = '';
      setMcqFormOpen(false);
    }
  };

  backBtn.addEventListener('click', () => navigate('/admin/subjects'), { signal: controller.signal });
  chapterModalCancel.addEventListener('click', closeChapterModal, { signal: controller.signal });
  chapterModalImageSlot.addEventListener('click', () => chapterModalImageInput.click(), { signal: controller.signal });
  chapterModalImageInput.addEventListener('change', syncChapterModalImageUi, { signal: controller.signal });
  chapterModalImageRemove.addEventListener('click', () => {
    chapterModalImageInput.value = '';
    syncChapterModalImageUi();
  }, { signal: controller.signal });
  topicModalImageSlot.addEventListener('click', () => topicModalImageInput.click(), { signal: controller.signal });
  topicModalImageInput.addEventListener('change', () => {
    topicForm.elements.clearImage.value = '0';
    syncTopicModalImageUi();
  }, { signal: controller.signal });
  topicModalImageRemove.addEventListener('click', () => {
    const hadSelectedFile = Boolean(topicModalImageInput.files?.length);
    if (hadSelectedFile) {
      topicModalImageInput.value = '';
      syncTopicModalImageUi();
      return;
    }
    topicForm.dataset.existingImage = '';
    topicForm.elements.clearImage.value = '1';
    syncTopicModalImageUi();
  }, { signal: controller.signal });
  topicModalCancel.addEventListener('click', closeTopicModal, { signal: controller.signal });
  contentPrefsModalCancel.addEventListener('click', closeContentPrefsModal, { signal: controller.signal });
  chapterModal.addEventListener('click', (event) => {
    if (event.target === chapterModal) closeChapterModal();
  }, { signal: controller.signal });
  topicModal.addEventListener('click', (event) => {
    if (event.target === topicModal) closeTopicModal();
  }, { signal: controller.signal });
  contentPrefsModal.addEventListener('click', (event) => {
    if (event.target === contentPrefsModal) closeContentPrefsModal();
  }, { signal: controller.signal });
  chapterForm.addEventListener('submit', (event) => {
    submitChapterModal(event).catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to save chapter');
    });
  }, { signal: controller.signal });
  topicForm.addEventListener('submit', (event) => {
    submitTopicModal(event).catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to save topic');
    });
  }, { signal: controller.signal });
  contentPrefsForm.addEventListener('submit', (event) => {
    submitContentPrefsModal(event).catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to save preferences');
    });
  }, { signal: controller.signal });

  breadcrumbEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-nav-href]');
    if (!btn) return;
    navigate(String(btn.getAttribute('data-nav-href') || ''));
  }, { signal: controller.signal });

  window.addEventListener('resize', () => updateTabsIndicator(), { signal: controller.signal });

  dynamicArea.addEventListener('focusin', (event) => {
    if (event.target?.classList?.contains('sbj-editor')) {
      activeEditor = event.target;
      updateEditorToolbarState();
    }
  }, { signal: controller.signal });

  dynamicArea.addEventListener('keyup', (event) => {
    if (event.target?.classList?.contains('sbj-editor')) {
      updateEditorToolbarState();
    }
  }, { signal: controller.signal });

  dynamicArea.addEventListener('mouseup', () => {
    if (activeEditor) updateEditorToolbarState();
  }, { signal: controller.signal });

  document.addEventListener('selectionchange', () => {
    if (activeEditor) updateEditorToolbarState();
  }, { signal: controller.signal });

  dynamicArea.addEventListener('mousedown', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const action = String(actionEl.getAttribute('data-action') || '');
    if (action !== 'editor-cmd' && action !== 'editor-insert' && action !== 'editor-insert-template' && action !== 'toggle-editor-symbols') return;
    const targetEditor = editorFromToolbar(actionEl) || activeEditor;
    if (!(targetEditor instanceof HTMLElement)) return;
    event.preventDefault();
    focusEditor(targetEditor);
  }, { signal: controller.signal });

  document.addEventListener('keydown', (event) => {
    if (!(activeEditor instanceof HTMLElement)) return;
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    if (!activeEditor.contains(selection.anchorNode)) return;

    if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const contextNode = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement;
      if (contextNode?.closest?.('li')) return;
      event.preventDefault();
      insertHtmlIntoEditor(activeEditor, '<br>');
      return;
    }

    if (event.key !== 'ArrowRight' || !selection.isCollapsed) return;
    const template = closestMathTemplate(selection.anchorNode);
    if (!template) return;
    const cursorRange = selection.getRangeAt(0).cloneRange();
    const tailRange = cursorRange.cloneRange();
    tailRange.setEndAfter(template);
    const remaining = String(tailRange.toString() || '').replace(/\u200B/g, '');
    if (remaining.length > 0) return;
    event.preventDefault();
    const nextRange = document.createRange();
    nextRange.setStartAfter(template);
    nextRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(nextRange);
  }, { signal: controller.signal });

  dynamicArea.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) {
      const nodeRow = event.target.closest('tr[data-open-node-id]');
      if (nodeRow && !isInteractiveTarget(event.target)) {
        const nodeId = Number(nodeRow.getAttribute('data-open-node-id') || 0);
        const depth = Number(nodeRow.getAttribute('data-node-depth') || 0);
        if (nodeId > 0 && currentMode === 'root' && depth === 0) {
          openInlineChildrenPanel(nodeRow, nodeId).catch((error) => {
            if (error?.name === 'AbortError') return;
            showToast(error?.message || 'Unable to load sections', 'error');
            setMsg(error?.message || 'Unable to load sections');
          });
          return;
        }
        if (nodeId > 0) navigate(subjectHref('node=' + nodeId));
        return;
      }
      const chapterRow = event.target.closest('tr[data-open-chapter-id]');
      if (chapterRow && !isInteractiveTarget(event.target)) {
        const chapterId = Number(chapterRow.getAttribute('data-open-chapter-id') || 0);
        if (chapterId > 0) navigate(subjectHref('chapter=' + chapterId));
        return;
      }
      const topicRow = event.target.closest('tr[data-open-topic-id]');
      if (topicRow && !isInteractiveTarget(event.target)) {
        const topicId = Number(topicRow.getAttribute('data-open-topic-id') || 0);
        if (topicId > 0) navigate(subjectHref('topic=' + topicId));
      }
      return;
    }
    const action = String(actionEl.getAttribute('data-action') || '');

    const run = async () => {
      if (action === 'open-node') {
        const id = Number(actionEl.getAttribute('data-node-id') || 0);
        if (id > 0) navigate(subjectHref('node=' + id));
        return;
      }

      if (action === 'pick-node-image') {
        const row = actionEl.closest('[data-node-row]');
        if (!row) return;
        const input = row.querySelector('[data-field="imageFile"]');
        if (!input || input.disabled) return;
        input.click();
        return;
      }

      if (action === 'remove-node-image') {
        const row = actionEl.closest('[data-node-row]');
        const nodeId = Number(actionEl.getAttribute('data-node-id') || row?.getAttribute('data-node-row') || 0);
        if (!row || !nodeId) return;
        await updateNodeImage(row, nodeId, { clear: true });
        return;
      }

      if (action === 'pick-chapter-image') {
        const row = actionEl.closest('[data-chapter-row]');
        if (!row) return;
        const input = row.querySelector('[data-field="chapterImageFile"]');
        if (!input) return;
        input.click();
        return;
      }

      if (action === 'pick-topic-image') {
        const row = actionEl.closest('[data-topic-row]');
        if (!row) return;
        const input = row.querySelector('[data-field="topicImageFile"]');
        if (!input) return;
        input.click();
        return;
      }

      if (action === 'remove-topic-image') {
        const row = actionEl.closest('[data-topic-row]');
        const topicId = Number(actionEl.getAttribute('data-topic-id') || row?.getAttribute('data-topic-row') || 0);
        if (!row || !topicId) return;
        await updateTopicImage(row, topicId, { clear: true });
        return;
      }

      if (action === 'remove-chapter-image') {
        const row = actionEl.closest('[data-chapter-row]');
        const chapterId = Number(actionEl.getAttribute('data-chapter-id') || row?.getAttribute('data-chapter-row') || 0);
        if (!row || !chapterId) return;
        await updateChapterImage(row, chapterId, { clear: true });
        return;
      }

      if (action === 'open-chapter') {
        const id = Number(actionEl.getAttribute('data-chapter-id') || 0);
        if (id > 0) navigate(subjectHref('chapter=' + id));
        return;
      }

      if (action === 'open-chapter-modal-create') {
        const nodeId = Number(actionEl.getAttribute('data-node-id') || 0);
        const supportsTopics = String(actionEl.getAttribute('data-node-supports-topics') || '') === '1';
        openChapterModal('create', { nodeId, supportsTopics });
        return;
      }

      if (action === 'open-topic-modal-create') {
        const chapterId = Number(actionEl.getAttribute('data-chapter-id') || 0);
        openTopicModal('create', { chapterId });
        return;
      }

      if (action === 'open-content-prefs') {
        const contextType = String(actionEl.getAttribute('data-context-type') || '').trim().toLowerCase();
        const contextId = Number(actionEl.getAttribute('data-context-id') || 0);
        const contextLabel = String(actionEl.getAttribute('data-context-label') || '').trim();
        const selectedTypes = String(actionEl.getAttribute('data-selected-types') || '');
        const availableTypes = String(actionEl.getAttribute('data-available-types') || '');
        openContentPrefsModal({
          contextType,
          contextId,
          contextLabel,
          selectedTypes,
          availableTypes,
        });
        return;
      }

      if (action === 'move-chapter-up' || action === 'move-chapter-down') {
        const chapterId = Number(actionEl.getAttribute('data-chapter-id') || 0);
        if (!chapterId || actionEl.disabled) return;
        const direction = action === 'move-chapter-up' ? 'up' : 'down';
        setMsg('Updating chapter rank...');
        await apiRequest('/subjects/' + subjectId + '/chapters/' + chapterId + '/reorder', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ direction }),
        });
        setMsg('Chapter rank updated.');
        showToast('Chapter order updated', 'success');
        await loadView();
        return;
      }

      if (action === 'move-topic-up' || action === 'move-topic-down') {
        const topicId = Number(actionEl.getAttribute('data-topic-id') || 0);
        if (!topicId || actionEl.disabled) return;
        const direction = action === 'move-topic-up' ? 'up' : 'down';
        setMsg('Updating topic rank...');
        await apiRequest('/subjects/' + subjectId + '/topics/' + topicId + '/reorder', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ direction }),
        });
        setMsg('Topic rank updated.');
        showToast('Topic order updated', 'success');
        await loadView();
        return;
      }

      if (action === 'delete-chapter') {
        const chapterId = Number(actionEl.getAttribute('data-chapter-id') || 0);
        const name = String(actionEl.getAttribute('data-chapter-name') || 'chapter');
        if (!chapterId) return;
        if (!window.confirm('Delete "' + name + '"? This will remove all notes and MCQs inside it.')) return;
        setMsg('Deleting chapter...');
        await apiRequest('/subjects/' + subjectId + '/chapters/' + chapterId, { method: 'DELETE' });
        setMsg('Chapter deleted.');
        await loadView();
        return;
      }

      if (action === 'delete-topic') {
        const topicId = Number(actionEl.getAttribute('data-topic-id') || 0);
        const name = String(actionEl.getAttribute('data-topic-name') || 'topic');
        if (!topicId) return;
        if (!window.confirm('Delete "' + name + '"? This will remove all notes and MCQs inside it.')) return;
        setMsg('Deleting topic...');
        await apiRequest('/subjects/' + subjectId + '/topics/' + topicId, { method: 'DELETE' });
        setMsg('Topic deleted.');
        await loadView();
        return;
      }

      if (action === 'switch-content-tab') {
        const tabKey = String(actionEl.getAttribute('data-tab-key') || '').toLowerCase();
        if (!tabKey) return;
        await renderActiveTabContent(tabKey, { updateUrl: true });
        return;
      }

      if (action === 'mcq-page') {
        const page = Number.parseInt(String(actionEl.getAttribute('data-page') || '1'), 10) || 1;
        if (!currentTabContext || String(currentTabContext.activeTab || '') !== 'mcq_bank') return;
        await renderActiveTabContent('mcq_bank', { updateUrl: true, mcqPage: page });
        return;
      }

      if (action === 'notes-page') {
        const page = Number.parseInt(String(actionEl.getAttribute('data-page') || '1'), 10) || 1;
        if (!currentTabContext || String(currentTabContext.activeTab || '') !== 'short_notes') return;
        await renderActiveTabContent('short_notes', { updateUrl: true, notesPage: page });
        return;
      }

      if (action === 'toggle-mcq-form') {
        const wrap = document.querySelector('[data-mcq-form-wrap]');
        const isOpen = Boolean(wrap?.classList.contains('is-open'));
        if (isOpen) {
          clearCurrentItemEdit();
        } else {
          setMcqFormOpen(true);
          const editor = document.getElementById('mcqQuestionEditor');
          if (editor) editor.focus();
        }
        return;
      }

      if (action === 'toggle-mcq-answer-admin') {
        const card = actionEl.closest('.sbj-mcq-item');
        const answer = card?.querySelector('[data-mcq-answer]');
        if (!answer) return;
        const show = Boolean(answer.hidden);
        answer.hidden = !show;
        actionEl.setAttribute('aria-expanded', show ? 'true' : 'false');
        actionEl.textContent = show ? 'Hide answer' : 'Show answer';
        return;
      }

      if (action === 'pick-note-image') {
        const form = actionEl.closest('#notesForm');
        const input = form?.querySelector('[data-field="noteImageFile"]');
        if (input) input.click();
        return;
      }

      if (action === 'remove-note-image') {
        const form = actionEl.closest('#notesForm');
        if (!form) return;
        const input = form.querySelector('[data-field="noteImageFile"]');
        const hadTemp = String(form.dataset.noteUsingTemp || '0') === '1';
        const existingUrl = String(form.dataset.noteExistingImage || '');
        if (input) input.value = '';
        if (hadTemp && existingUrl) {
          setNoteImagePreview(form, existingUrl, { temp: false });
          if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = '0';
          return;
        }
        setNoteImagePreview(form, '', { temp: false });
        if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = existingUrl ? '1' : '0';
        form.dataset.noteExistingImage = '';
        return;
      }

      if (action === 'pick-mcq-image') {
        const form = actionEl.closest('#mcqForm');
        const input = form?.querySelector('[data-field="mcqImageFile"]');
        if (input) input.click();
        return;
      }

      if (action === 'remove-mcq-image') {
        const form = actionEl.closest('#mcqForm');
        if (!form) return;
        const input = form.querySelector('[data-field="mcqImageFile"]');
        const hadTemp = String(form.dataset.mcqUsingTemp || '0') === '1';
        const existingUrl = String(form.dataset.mcqExistingImage || '');
        if (input) input.value = '';
        if (hadTemp && existingUrl) {
          setMcqImagePreview(form, existingUrl, { temp: false });
          if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = '0';
          return;
        }
        setMcqImagePreview(form, '', { temp: false });
        if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = existingUrl ? '1' : '0';
        form.dataset.mcqExistingImage = '';
        return;
      }

      if (action === 'toggle-editor-symbols') {
        const toolbar = actionEl.closest('.sbj-editor-toolbar[data-editor-target]');
        if (!toolbar) return;
        const drawer = toolbar.querySelector('[data-editor-symbol-drawer]');
        if (!drawer) return;
        const nextOpen = !drawer.classList.contains('is-open');
        drawer.classList.toggle('is-open', nextOpen);
        drawer.hidden = !nextOpen;
        actionEl.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        actionEl.textContent = nextOpen ? 'Hide Characters' : 'Add Characters';
        return;
      }

      if (action === 'editor-cmd') {
        const cmd = String(actionEl.getAttribute('data-cmd') || '');
        const targetEditor = editorFromToolbar(actionEl);
        if (targetEditor) focusEditor(targetEditor);
        if (!cmd || !activeEditor) return;
        document.execCommand(cmd, false, null);
        updateEditorToolbarState();
        return;
      }

      if (action === 'editor-insert') {
        const value = String(actionEl.getAttribute('data-value') || '');
        const targetEditor = editorFromToolbar(actionEl) || activeEditor;
        if (!value || !targetEditor) return;
        insertTextIntoEditor(targetEditor, value);
        updateEditorToolbarState();
        return;
      }

      if (action === 'editor-insert-template') {
        const templateKey = String(actionEl.getAttribute('data-template') || '').trim();
        const html = String(editorTemplateMap?.[templateKey] || '');
        const targetEditor = editorFromToolbar(actionEl) || activeEditor;
        if (!html || !targetEditor) return;
        insertTemplateIntoEditor(targetEditor, html);
        updateEditorToolbarState();
        return;
      }

      if (action === 'edit-note') {
        fillNoteForEdit(Number(actionEl.getAttribute('data-item-id') || 0));
        return;
      }

      if (action === 'edit-mcq') {
        fillMcqForEdit(Number(actionEl.getAttribute('data-item-id') || 0));
        return;
      }

      if (action === 'cancel-item-edit') {
        clearCurrentItemEdit();
        return;
      }

      if (action === 'delete-item') {
        const itemId = Number(actionEl.getAttribute('data-item-id') || 0);
        if (!itemId) return;
        if (!window.confirm('Delete this item?')) return;
        setMsg('Deleting item...');
        await apiRequest('/subjects/' + subjectId + '/content-items/' + itemId, { method: 'DELETE' });
        setMsg('Item deleted.');
        await loadView();
      }
    };

    run().catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Action failed');
    });
  }, { signal: controller.signal });

  dynamicArea.addEventListener('input', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const field = String(input.getAttribute('data-field') || '');

    if (field === 'displayName') {
      const row = input.closest('[data-node-row]');
      const nodeId = Number(row?.getAttribute('data-node-row') || 0);
      if (!row || !nodeId || input.disabled) return;
      const nextName = String(input.value || '').trim();
      const savedName = String(input.getAttribute('data-saved-value') || '').trim();
      if (!nextName || nextName.length < 2 || nextName === savedName) return;
      input.classList.add('is-syncing');
      setMsg('Syncing changes...');
      queueAutosave('node-name:' + nodeId, () => saveNodeRow(row, nodeId), 700);
      return;
    }

    if (field === 'chapterName') {
      const row = input.closest('[data-chapter-row]');
      const chapterId = Number(row?.getAttribute('data-chapter-row') || 0);
      if (!row || !chapterId || input.disabled) return;
      const nameInput = row.querySelector('[data-field="chapterName"]');
      const nextName = String(nameInput?.value || '').trim();
      const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
      if (!nextName || nextName.length < 2 || nextName === savedName) return;
      if (nameInput) nameInput.classList.add('is-syncing');
      setMsg('Syncing changes...');
      queueAutosave('chapter-name:' + chapterId, () => saveChapterRow(row, chapterId), 700);
      return;
    }

    if (field === 'topicName') {
      const row = input.closest('[data-topic-row]');
      const topicId = Number(row?.getAttribute('data-topic-row') || 0);
      if (!row || !topicId || input.disabled) return;
      const nameInput = row.querySelector('[data-field="topicName"]');
      const nextName = String(nameInput?.value || '').trim();
      const savedName = String(nameInput?.getAttribute('data-saved-value') || '').trim();
      if (!nextName || nextName.length < 2 || nextName === savedName) return;
      if (nameInput) nameInput.classList.add('is-syncing');
      setMsg('Syncing changes...');
      queueAutosave('topic-name:' + topicId, () => saveTopicRow(row, topicId), 700);
      return;
    }

  }, { signal: controller.signal });

  dynamicArea.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const field = input.getAttribute('data-field');

    if (field === 'chapterTopicsEnabled') {
      const row = input.closest('[data-chapter-row]');
      const chapterId = Number(row?.getAttribute('data-chapter-row') || 0);
      if (!row || !chapterId) return;
      saveChapterRow(row, chapterId, { force: true }).catch((error) => {
        if (error?.name === 'AbortError') return;
        setMsg(error?.message || 'Unable to update chapter');
      });
      return;
    }

    const file = input.files?.[0] || null;
    if (!file) return;

    if (field === 'imageFile') {
      const row = input.closest('[data-node-row]');
      const nodeId = Number(row?.getAttribute('data-node-row') || 0);
      if (!row || !nodeId) return;
      updateNodeImage(row, nodeId, { file }).catch((error) => {
        if (error?.name === 'AbortError') return;
        setMsg(error?.message || 'Unable to update image');
      });
      return;
    }

    if (field === 'chapterImageFile') {
      const row = input.closest('[data-chapter-row]');
      const chapterId = Number(row?.getAttribute('data-chapter-row') || 0);
      if (!row || !chapterId) return;
      updateChapterImage(row, chapterId, { file }).catch((error) => {
        if (error?.name === 'AbortError') return;
        setMsg(error?.message || 'Unable to update chapter image');
      });
      return;
    }

    if (field === 'topicImageFile') {
      const row = input.closest('[data-topic-row]');
      const topicId = Number(row?.getAttribute('data-topic-row') || 0);
      if (!row || !topicId) return;
      updateTopicImage(row, topicId, { file }).catch((error) => {
        if (error?.name === 'AbortError') return;
        setMsg(error?.message || 'Unable to update topic image');
      });
      return;
    }

    if (field === 'noteImageFile') {
      const form = input.closest('#notesForm');
      if (!form) return;
      const tempUrl = URL.createObjectURL(file);
      setNoteImagePreview(form, tempUrl, { temp: true });
      if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = '0';
      return;
    }

    if (field === 'mcqImageFile') {
      const form = input.closest('#mcqForm');
      if (!form) return;
      const tempUrl = URL.createObjectURL(file);
      setMcqImagePreview(form, tempUrl, { temp: true });
      if (form.elements.clearImageFlag) form.elements.clearImageFlag.value = '0';
      return;
    }

  }, { signal: controller.signal });

  dynamicArea.addEventListener('submit', (event) => {
    const target = event.target;
    if (!target || !(target instanceof HTMLFormElement)) return;

    const run = async () => {
      if (target.id === 'notesForm') {
        event.preventDefault();
        await submitNotesForm(target);
      }
      if (target.id === 'mcqForm') {
        event.preventDefault();
        await submitMcqForm(target);
      }
      if (target.id === 'summaryForm') {
        event.preventDefault();
        await submitSummaryForm(target);
      }
    };

    run().catch((error) => {
      if (error?.name === 'AbortError') return;
      setMsg(error?.message || 'Unable to save content');
    });
  }, { signal: controller.signal });

  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => {
      for (const timer of autosaveTimers.values()) {
        window.clearTimeout(timer);
      }
      autosaveTimers.clear();
      const notesForm = document.getElementById('notesForm');
      const noteTempUrl = String(notesForm?.dataset?.noteTempUrl || '');
      if (noteTempUrl) URL.revokeObjectURL(noteTempUrl);
      clearChapterModalPreviewUrl();
      clearTopicModalPreviewUrl();
    });
  }

  syncChapterModalImageUi();
  syncTopicModalImageUi();
  loadView();
})();
`;
}
