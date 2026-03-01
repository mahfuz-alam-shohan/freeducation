export const FILE_MANAGER_SCRIPT_BOOTSTRAP = `
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

const SUB_FILTERS = {
  '': [{ value: '', label: 'Any' }, { value: 'other', label: 'Other' }],
  image: [{ value: '', label: 'Any image usage' }, { value: 'profile-pic', label: 'Profile pic' }, { value: 'cover-pic', label: 'Cover pic' }, { value: 'other', label: 'Other image' }],
  video: [{ value: '', label: 'Any video usage' }, { value: 'other', label: 'Other video' }],
  other: [{ value: '', label: 'Any' }, { value: 'other', label: 'Other' }],
  pdf: [{ value: '', label: 'No PDF sub filter yet' }],
};

let state = { files: [], cursor: '', loading: false, hasMore: false, deleting: {} };

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
const deleteIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

const typeLabel = (type) => {
  if (type === 'image') return 'Image';
  if (type === 'video') return 'Video';
  if (type === 'pdf') return 'PDF';
  return 'File';
};

const renderSubFilter = () => {
  const selectedType = typeFilter.value || '';
  const options = SUB_FILTERS[selectedType] || SUB_FILTERS[''];
  const previousValue = usageFilter.value;
  usageFilter.innerHTML = options.map((option) => '<option value="' + option.value + '">' + option.label + '</option>').join('');
  const canReuse = options.some((option) => option.value === previousValue);
  usageFilter.value = canReuse ? previousValue : '';
  usageFilter.disabled = selectedType === 'pdf';
};

const setMessage = (text, error = false) => {
  msg.textContent = text;
  msg.style.color = error ? '#ff9ca1' : '';
};

const buildQuery = (cursor = '') => {
  const params = new URLSearchParams();
  params.set('limit', '48');
  if (typeFilter.value) params.set('type', typeFilter.value);
  if (usageFilter.value && !usageFilter.disabled) params.set('usage', usageFilter.value);
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (cursor) params.set('cursor', cursor);
  return params.toString();
};
`;
