export function classSubjectsScript(classId, apiBase = "/api/workspace") {
  return `
(() => {
  const classId = ${Number(classId) || 0};
  const rowsEl = document.getElementById('classSubjectsRows');
  const msgEl = document.getElementById('classSubjectsMsg');
  const titleEl = document.getElementById('classSubjectsTitle');
  const subtitleEl = document.getElementById('classSubjectsSubtitle');
  if (!classId || !rowsEl || !msgEl || !titleEl || !subtitleEl) return;

  const apiRoot = ${JSON.stringify(String(apiBase || "/api/workspace"))};
  const controller = new AbortController();
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const setMsg = (text) => {
    msgEl.textContent = String(text || '');
  };

  const toDate = (value) => {
    const date = new Date(value || '');
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  };

  const renderRows = (subjects) => {
    const rows = Array.isArray(subjects) ? subjects : [];
    if (!rows.length) {
      rowsEl.innerHTML = '<tr><td colspan="3" class="cls-sub-empty">No subjects found in this class.</td></tr>';
      return;
    }
    rowsEl.innerHTML = rows.map((subject) => {
      const subjectId = Number(subject?.id || 0);
      return '<tr class="cls-sub-row" data-subject-id="' + subjectId + '">'
        + '<td>' + escapeHtml(subject?.name || '') + '</td>'
        + '<td>' + escapeHtml(subject?.templateCode || subject?.templateName || '-') + '</td>'
        + '<td>' + escapeHtml(toDate(subject?.createdAt)) + '</td>'
        + '</tr>';
    }).join('');
  };

  const load = async () => {
    setMsg('Loading class subjects...');
    try {
      const response = await fetch(apiRoot + '/classes/' + classId, { signal: controller.signal });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || 'Unable to load class subjects');
      const className = String(body?.classItem?.name || 'Class Subjects');
      titleEl.textContent = className;
      subtitleEl.textContent = 'Subjects under ' + className;
      renderRows(body?.subjects || []);
      setMsg('');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      rowsEl.innerHTML = '<tr><td colspan="3" class="cls-sub-empty">Unable to load subjects.</td></tr>';
      setMsg(error?.message || 'Unable to load class subjects');
    }
  };

  rowsEl.addEventListener('click', (event) => {
    const row = event.target.closest('tr[data-subject-id]');
    if (!row) return;
    const subjectId = Number(row.getAttribute('data-subject-id') || 0);
    if (!subjectId) return;
    const href = '/admin/subjects/' + subjectId;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(href);
      return;
    }
    window.location.href = href;
  }, { signal: controller.signal });

  load();
})();
`;
}

