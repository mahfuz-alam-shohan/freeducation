import { renderShellNav } from "../navigation.js";

export function renderAppSidebar({ navItems, activeMenu }) {
  const nav = renderShellNav(navItems, activeMenu);

  return `<aside id="appSidebar" class="app-sidebar">${nav}<div class="app-theme-wrap"><button id="themeToggle" class="app-theme-toggle" type="button" data-theme-state="idle" aria-pressed="false" aria-busy="false"><span class="app-theme-orb" aria-hidden="true"><svg class="app-theme-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"></path></svg><svg class="app-theme-moon" viewBox="0 0 24 24"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"></path></svg></span><span class="app-theme-copy"><span class="app-theme-label">Theme</span><span id="themeToggleText" class="app-theme-text">Dark mode on</span></span><span id="themeToggleChip" class="app-theme-chip">Dark</span></button></div></aside>`;
}
