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

export const renderBellIcon = (): string =>
  renderIcon(
    '<path d="M18 9a6 6 0 1 0-12 0c0 4-2 5-2 5h16s-2-1-2-5Zm-5 9a2 2 0 0 1-4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
  );
