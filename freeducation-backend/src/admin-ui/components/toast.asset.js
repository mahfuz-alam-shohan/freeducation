export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  if (type === 'error') {
    toast.style.background = '#c9422f';
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
