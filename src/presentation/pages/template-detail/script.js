export function templateDetailScript(templateId, apiBase = "/api/workspace") {
  return `
(() => {
  const rowsEl = document.getElementById('templateHierarchyRows');
  const msgEl = document.getElementById('templateDetailMsg');
  const titleEl = document.getElementById('templateTitle');
  const codeEl = document.getElementById('templateCode');
  const backBtn = document.getElementById('templateBack');
  if (!rowsEl || !msgEl || !titleEl || !codeEl || !backBtn) return;

  const apiRoot = ${JSON.stringify(String(apiBase || "/api/workspace"))};
  const templateId = ${Number(templateId) || 0};
  const controller = new AbortController();
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }

  backBtn.addEventListener('click', () => {
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate('/admin/templates');
      return;
    }
    window.location.href = '/admin/templates';
  }, { signal: controller.signal });

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const setMsg = (text) => {
    msgEl.textContent = String(text || '');
  };

  const yesNo = (value) => value
    ? '<span class="tpld-yes">Yes</span>'
    : '<span class="tpld-no">No</span>';

  const renderRows = (rows) => {
    if (!Array.isArray(rows) || !rows.length) {
      rowsEl.innerHTML = '<tr><td colspan="4" class="tpld-no">No hierarchy rows found.</td></tr>';
      return;
    }

    rowsEl.innerHTML = rows.map((row) => {
      const depth = Math.max(0, Number(row?.depth || 0));
      const node = '<span class="tpld-node" style="padding-left:' + (depth * 16) + 'px"><span class="tpld-dot"></span>' + escapeHtml(row?.name || '') + '</span>';
      return '<tr>'
        + '<td>' + node + '</td>'
        + '<td>' + yesNo(Boolean(row?.editable)) + '</td>'
        + '<td>' + yesNo(Boolean(row?.imageUpload)) + '</td>'
        + '<td>' + yesNo(Boolean(row?.supportsChapters)) + '</td>'
        + '</tr>';
    }).join('');
  };

  const loadTemplate = async () => {
    setMsg('Loading template...');
    try {
      const response = await fetch(apiRoot + '/templates/' + templateId, { signal: controller.signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Failed to load template');

      const template = payload?.template || {};
      titleEl.textContent = template?.name || ('Template #' + templateId);
      codeEl.textContent = template?.code ? ('Code: ' + template.code) : 'Template code unavailable';
      renderRows(template?.rows || []);
      setMsg('');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      rowsEl.innerHTML = '<tr><td colspan="4" class="tpld-no">Unable to load template hierarchy.</td></tr>';
      setMsg(error?.message || 'Unable to load template hierarchy');
    }
  };

  loadTemplate();
})();
`;
}
