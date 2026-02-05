const loadingState = {
  count: 0,
  timer: null,
  overlay: null
};

export function ensureLoadingOverlay() {
  if (loadingState.overlay) return loadingState.overlay;
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading...</div>
    </div>
  `;
  document.body.appendChild(overlay);
  loadingState.overlay = overlay;
  return overlay;
}

function setLoading(active) {
  const overlay = ensureLoadingOverlay();
  overlay.classList.toggle('is-active', active);
  document.body.classList.toggle('is-loading', active);
  document.body.setAttribute('aria-busy', active ? 'true' : 'false');
}

export function showLoading() {
  loadingState.count += 1;
  if (loadingState.timer) return;
  loadingState.timer = setTimeout(() => {
    loadingState.timer = null;
    if (loadingState.count > 0) {
      setLoading(true);
    }
  }, 120);
}

export function hideLoading() {
  loadingState.count = Math.max(0, loadingState.count - 1);
  if (loadingState.count === 0) {
    if (loadingState.timer) {
      clearTimeout(loadingState.timer);
      loadingState.timer = null;
    }
    setLoading(false);
  }
}

export async function withLoading(task) {
  showLoading();
  try {
    return await task();
  } finally {
    hideLoading();
  }
}
