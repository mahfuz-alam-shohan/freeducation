const renderIcon = (path: string): string => `
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img">
    ${path}
  </svg>
`;

export const renderMenuIcon = (): string =>
  renderIcon(
    '<path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />',
  );

export const renderCloseIcon = (): string =>
  renderIcon(
    '<path d="M6 6l12 12M18 6l-12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />',
  );

export const renderHomeIcon = (): string =>
  renderIcon(
    '<path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />',
  );

export const renderUserIcon = (): string =>
  renderIcon(
    '<path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 8a7 7 0 0 0-14 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />',
  );

export const renderUsersIcon = (): string =>
  renderIcon(
    '<path d="M8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-8 2c-2.8 0-5 1.8-5 4v2m13-6c2.8 0 5 1.8 5 4v2M8 16h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
  );

export const renderModulesIcon = (): string =>
  renderIcon(
    '<path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />',
  );

export const renderBellIcon = (): string =>
  renderIcon(
    '<path d="M18 9a6 6 0 1 0-12 0c0 4-2 5-2 5h16s-2-1-2-5Zm-5 9a2 2 0 0 1-4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
  );

export const renderSunIcon = (): string =>
  renderIcon(
    '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />' +
      '<path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />',
  );

export const renderMoonIcon = (): string =>
  renderIcon(
    '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
  );

export const renderMinimizeIcon = (): string =>
  renderIcon(
    '<path d="M4 14h6v6M14 4h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
  );

export const renderMaximizeIcon = (): string =>
  renderIcon(
    '<path d="M4 10h6V4M14 20h6v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
  );
