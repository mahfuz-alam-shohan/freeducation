export const FILE_MANAGER_SCRIPT_ACTIONS = `
let searchTimer;
const triggerReload = () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => loadFiles(false), 180);
};

typeFilter.addEventListener('change', () => {
  renderSubFilter();
  triggerReload();
}, { signal });
usageFilter.addEventListener('change', triggerReload, { signal });
searchInput.addEventListener('input', triggerReload, { signal });
loadMoreButton.addEventListener('click', () => loadFiles(true), { signal });
fileGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.fm-delete');
  if (!button) return;
  deleteFile(button.getAttribute('data-key') || '');
}, { signal });

renderSubFilter();
loadFiles(false);
})();
`;
