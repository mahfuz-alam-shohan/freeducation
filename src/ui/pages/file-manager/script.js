export function fileManagerScript() {
  return `
(() => {
const typeFilter = document.getElementById('fileTypeFilter');
const usageFilter = document.getElementById('fileUsageFilter');
const searchInput = document.getElementById('fileSearch');
const fileGrid = document.getElementById('fileGrid');
const msg = document.getElementById('fileManagerMsg');
const fileCountChip = document.getElementById('fileCountChip');
const loadMoreButton = document.getElementById('loadMoreFiles');

if (!typeFilter || !usageFilter || !searchInput || !fileGrid || !msg || !fileCountChip || !loadMoreButton) return;

const controller = new AbortController();
const { signal } = controller;
if (typeof window.__registerCleanup === 'function') {
  window.__registerCleanup(() => controller.abort());
}

let state = { files: [], cursor: '', loading: false, hasMore: false, append: false };

const formatBytes = (bytes) => {
  const size = Number(bytes || 0);
  if (!size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return value.toFixed(value >= 10 || idx === 0 ? 0 : 1) + ' ' + units[idx];
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const pdfThumb = '<svg class="fm-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/><path d="M8 16h8"/><path d="M8 12h8"/></svg>';

const typeLabel = (type) => {
  if (type === 'image') return 'Image';
  if (type === 'video') return 'Video';
  if (type === 'pdf') return 'PDF';
  return 'File';
};

const render = () => {
  const items = state.files;
  fileCountChip.textContent = items.length + ' files';

  if (!items.length) {
    fileGrid.innerHTML = '<article class="fm-item"><div class="fm-meta"><strong class="fm-name">No files found</strong><span class="fm-detail">Try changing filters</span></div><div class="fm-thumb"></div></article>';
  } else {
    fileGrid.innerHTML = items.map((file, index) => {
      const usage = file.usage === 'profile-pic' ? 'Profile pic' : file.usage === 'cover-pic' ? 'Cover pic' : 'Other';
      let thumb = '<div class="fm-thumb">' + pdfThumb + '<span class="fm-type-badge">' + typeLabel(file.type) + '</span></div>';
      if (file.type === 'image') {
        thumb = '<div class="fm-thumb"><img src="' + file.previewUrl + '" loading="lazy" alt="' + escapeHtml(file.key) + '" /><span class="fm-type-badge">Image</span></div>';
      } else if (file.type === 'video') {
        thumb = '<div class="fm-thumb"><video src="' + file.previewUrl + '" preload="metadata" muted playsinline></video><span class="fm-type-badge">Video</span></div>';
      }
      return '<article class="fm-item" style="--item-index:' + index + '">'
        + '<div class="fm-meta">'
        + '<strong class="fm-name" title="' + escapeHtml(file.key) + '">' + escapeHtml(file.key.split('/').pop() || file.key) + '</strong>'
        + '<span class="fm-detail"><span>' + usage + '</span><span>' + formatBytes(file.size) + '</span></span>'
        + '<span class="fm-detail"><span>' + (file.extension || file.type) + '</span><span>' + formatDate(file.uploadedAt) + '</span></span>'
        + '</div>'
        + thumb
        + '</article>';
    }).join('');
  }

  loadMoreButton.hidden = !state.hasMore;
};

const setMessage = (text, error = false) => {
  msg.textContent = text;
  msg.style.color = error ? '#ff9ca1' : '';
};

const buildQuery = (cursor = '') => {
  const params = new URLSearchParams();
  params.set('limit', '48');
  if (typeFilter.value) params.set('type', typeFilter.value);
  if (usageFilter.value) params.set('usage', usageFilter.value);
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (cursor) params.set('cursor', cursor);
  return params.toString();
};

const loadFiles = async (append = false) => {
  if (state.loading) return;
  state.loading = true;
  state.append = append;
  setMessage(append ? 'Loading more files...' : 'Loading files...');
  loadMoreButton.disabled = true;

  try {
    const cursor = append ? state.cursor : '';
    const response = await fetch('/api/admin/files?' + buildQuery(cursor), { signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not load files');

    state.files = append ? state.files.concat(data.files || []) : (data.files || []);
    state.cursor = data.cursor || '';
    state.hasMore = Boolean(data.truncated && state.cursor);
    render();
    setMessage(state.files.length ? 'Showing ' + state.files.length + ' files' : 'No files found');
  } catch (error) {
    if (error.name === 'AbortError') return;
    setMessage(error.message || 'Unable to load files', true);
  } finally {
    state.loading = false;
    loadMoreButton.disabled = false;
  }
};

let searchTimer;
const triggerReload = () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => loadFiles(false), 180);
};

typeFilter.addEventListener('change', triggerReload, { signal });
usageFilter.addEventListener('change', triggerReload, { signal });
searchInput.addEventListener('input', triggerReload, { signal });
loadMoreButton.addEventListener('click', () => loadFiles(true), { signal });

loadFiles(false);
})();
`;
}
