export function templatesScript(apiBase = "/api/workspace") {
  return `
(() => {
  const rowsEl = document.getElementById('templateRows');
  const msgEl = document.getElementById('templateMsg');
  if (!rowsEl || !msgEl) return;

  const apiRoot = ${JSON.stringify(String(apiBase || "/api/workspace"))};
  const controller = new AbortController();
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }

  const setMessage = (text) => {
    msgEl.textContent = String(text || '');
  };

  const isInteractiveTarget = (target) => Boolean(target?.closest?.('button,input,select,textarea,label,a,[data-action],[contenteditable="true"]'));

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const renderRows = (templates) => {
    if (!Array.isArray(templates) || !templates.length) {
      rowsEl.innerHTML = '<tr><td colspan="3" class="mod-empty">No templates found.</td></tr>';
      return;
    }

    rowsEl.innerHTML = templates.map((template) => {
      const id = Number(template?.id || 0);
      const href = '/admin/templates/' + id;
      return '<tr class="mod-row-open" data-template-href="' + href + '">'
        + '<td>' + escapeHtml(template?.name || '') + '</td>'
        + '<td>' + escapeHtml(template?.code || '') + '</td>'
        + '<td>' + String(Number(template?.subjectCount || 0)) + '</td>'
        + '</tr>';
    }).join('');
  };

  rowsEl.addEventListener('click', (event) => {
    if (isInteractiveTarget(event.target)) return;
    const row = event.target.closest('tr[data-template-href]');
    if (!row) return;
    const href = String(row.getAttribute('data-template-href') || '');
    if (!href) return;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(href);
      return;
    }
    window.location.href = href;
  }, { signal: controller.signal });

  const loadTemplates = async () => {
    setMessage('Loading templates...');
    try {
      const response = await fetch(apiRoot + '/templates', { signal: controller.signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Failed to load templates');
      renderRows(payload?.templates || []);
      setMessage('');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      rowsEl.innerHTML = '<tr><td colspan="3" class="mod-empty">Unable to load templates.</td></tr>';
      setMessage(error?.message || 'Unable to load templates');
    }
  };

  loadTemplates();
})();
`;
}
