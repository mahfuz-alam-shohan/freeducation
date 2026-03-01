export const FILE_MANAGER_SCRIPT_RENDER_AND_API = `
const render = () => {
  const items = state.files;
  fileCountChip.textContent = items.length + ' files';

  if (!items.length) {
    fileGrid.innerHTML = '<article class="fm-item fm-empty-card"><div><strong>No files found</strong><br /><span>Try changing filters</span></div></article>';
  } else {
    fileGrid.innerHTML = items.map((file, index) => {
      const usage = file.usage === 'profile-pic' ? 'Profile pic' : file.usage === 'cover-pic' ? 'Cover pic' : 'Other';
      const safeKey = escapeHtml(file.key);
      const fileName = escapeHtml(file.key.split('/').pop() || file.key);
      const isDeleting = Boolean(state.deleting[file.key]);
      let thumb = '<div class="fm-thumb">' + pdfThumb + '</div>';
      if (file.type === 'image') {
        thumb = '<div class="fm-thumb"><img src="' + file.previewUrl + '" loading="lazy" alt="' + safeKey + '" /></div>';
      } else if (file.type === 'video') {
        thumb = '<div class="fm-thumb"><video src="' + file.previewUrl + '" preload="metadata" muted playsinline></video></div>';
      }
      return '<article class="fm-item" style="--item-index:' + index + '">'
        + thumb
        + '<span class="fm-type-badge">' + typeLabel(file.type) + '</span>'
        + '<button class="fm-delete" type="button" data-key="' + safeKey + '" aria-label="Delete file ' + fileName + '" title="Delete file"' + (isDeleting ? ' disabled' : '') + '>' + deleteIcon + '</button>'
        + '<div class="fm-meta">'
        + '<strong class="fm-name" title="' + safeKey + '">' + fileName + '</strong>'
        + '<span class="fm-detail"><span>' + usage + '</span><span>' + formatBytes(file.size) + '</span></span>'
        + '<span class="fm-detail"><span>' + (file.extension || file.type) + '</span><span>' + formatDate(file.uploadedAt) + '</span></span>'
        + '</div>'
        + '</article>';
    }).join('');
  }

  loadMoreButton.hidden = !state.hasMore;
};

const loadFiles = async (append = false) => {
  if (state.loading) return;
  state.loading = true;
  setMessage(append ? 'Loading more files...' : 'Loading files...');
  loadMoreButton.disabled = true;

  try {
    const cursor = append ? state.cursor : '';
    const response = await fetch('/api/workspace/files?' + buildQuery(cursor), { signal });
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

const deleteFile = async (key) => {
  if (!key || state.deleting[key]) return;
  const confirmed = window.confirm('Delete this file from storage and all references?');
  if (!confirmed) return;

  state.deleting[key] = true;
  render();
  setMessage('Deleting file...');

  try {
    const response = await fetch('/api/workspace/files/object?key=' + encodeURIComponent(key), { method: 'DELETE', signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not delete file');

    state.files = state.files.filter((file) => file.key !== key);
    setMessage('File deleted successfully');
  } catch (error) {
    if (error.name === 'AbortError') return;
    setMessage(error.message || 'Unable to delete file', true);
  } finally {
    delete state.deleting[key];
    render();
  }
};
`;
