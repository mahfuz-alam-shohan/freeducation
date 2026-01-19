export type HeaderProps = {
  siteName: string;
  profileMenu: string;
  notificationMenu: string;
};

export const renderHeaderDesktop = ({ siteName, profileMenu, notificationMenu }: HeaderProps): string => `
  <header class="app-header app-header--desktop">
    <div class="app-header__left">
      <label class="icon-button" for="sidebar-toggle" aria-label="Toggle sidebar">☰</label>
    </div>
    <div class="app-header__center">
      <div class="logo">${siteName}</div>
    </div>
    <div class="app-header__right">
      ${notificationMenu}
      ${profileMenu}
    </div>
  </header>
`;
