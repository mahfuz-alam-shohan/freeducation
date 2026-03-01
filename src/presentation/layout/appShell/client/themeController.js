export const APP_SHELL_CLIENT_THEME = `
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  applyTheme(savedTheme);
  setThemeState('idle');

  if (themeToggle) {
    themeToggle.addEventListener('click', async () => {
      const isLight = body.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      await switchTheme(nextTheme);
    }, { signal });
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== themeStorageKey) return;
    applyTheme(String(event.newValue || '').trim());
  }, { signal });
`;
