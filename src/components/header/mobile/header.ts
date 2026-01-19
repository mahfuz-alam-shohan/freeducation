import { renderMenuIcon } from "../../ui/icons";

export type HeaderProps = {
  siteName: string;
  profileMenu: string;
};

export const renderHeaderMobile = ({ siteName, profileMenu }: HeaderProps): string => `
  <header class="app-header app-header--mobile">
    <div class="app-header__left">
      <label class="icon-button" for="sidebar-toggle" aria-label="Toggle sidebar">${renderMenuIcon()}</label>
    </div>
    <div class="app-header__center">
      <div class="logo">${siteName}</div>
    </div>
    <div class="app-header__right">
      ${profileMenu}
    </div>
  </header>
`;
