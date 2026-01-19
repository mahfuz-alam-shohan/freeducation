import { renderContentShellDesktop, desktopShellStyles } from "../components/content-shell/desktop/shell";
import { renderContentShellMobile, mobileShellStyles } from "../components/content-shell/mobile/shell";
import { renderContentShellTablet, tabletShellStyles } from "../components/content-shell/tablet/shell";
import { renderFooterDesktop } from "../components/footer/desktop/footer";
import { renderFooterMobile } from "../components/footer/mobile/footer";
import { renderFooterTablet } from "../components/footer/tablet/footer";
import { renderHeaderDesktop } from "../components/header/desktop/header";
import { renderHeaderMobile } from "../components/header/mobile/header";
import { renderHeaderTablet } from "../components/header/tablet/header";
import { renderSidebarDesktop } from "../components/sidebar/desktop/sidebar";
import { renderSidebarMobile } from "../components/sidebar/mobile/sidebar";
import { renderSidebarTablet } from "../components/sidebar/tablet/sidebar";
import { renderNotificationMenu } from "../components/ui/notification-menu";
import { renderProfileMenu } from "../components/ui/profile-menu";
import type { AdminSession } from "../services/security/session";
import { themeStyles } from "../styles/theme";

export type DeviceType = "mobile" | "tablet" | "desktop";

export type PageLayoutProps = {
  device: DeviceType;
  content: string;
  session: AdminSession | null;
};

const baseStyles = `
  ${themeStyles}
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; overflow: hidden; }
  a { color: var(--color-link); text-decoration: none; }
  a:hover { color: var(--color-link-hover); }
  hr { border: none; border-top: 1px solid var(--color-border); margin: 12px 0; }
  .icon { width: 18px; height: 18px; display: inline-block; }
  .button-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    text-decoration: none;
  }
  .button-link--primary {
    background: var(--color-accent);
    color: #fff;
    border-color: transparent;
  }
  .page { max-width: 640px; margin: 0 auto; display: grid; gap: 12px; }
  .page-header { display: grid; gap: 6px; }
  .page-title { margin: 0; font-size: 28px; }
  .page-subtitle { margin: 0; color: var(--color-text-muted); }
  .page-section { display: grid; gap: 8px; }
  .page-actions { display: flex; justify-content: flex-start; flex-wrap: wrap; gap: 8px; }
  .section-title { margin: 0; font-size: 20px; }
  .form-card {
    display: grid;
    gap: 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 14px;
    background: var(--color-surface);
  }
  .form-grid { display: grid; gap: 10px; }
  .form-field { display: grid; gap: 6px; }
  .form-actions { display: flex; justify-content: flex-start; }
  .helper-text { margin: 0; font-size: 14px; color: var(--color-text-muted); }
  .filter-bar {
    display: grid;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }
  .filter-fields { display: grid; gap: 10px; }
  .filter-field { display: grid; gap: 6px; }
  .filter-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-surface);
  }
  .data-table th,
  .data-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--color-border); }
  .data-table th { font-size: 14px; color: var(--color-text-muted); background: var(--color-surface-muted); }
  .data-table tbody tr:last-child td { border-bottom: none; }
  .alert {
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    padding: 8px 10px;
    background: var(--color-surface-muted);
  }
  .alert--error { border-color: #d98989; color: #8a1f1f; background: #fdecec; }
  .home {
    max-width: 760px;
    gap: 16px;
  }
  .home-cover {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--color-border);
    padding: 18px 16px;
    background: linear-gradient(135deg, #fff7f0 0%, #f2f7ff 100%);
  }
  .home-cover__content {
    position: relative;
    display: grid;
    gap: 12px;
    text-align: center;
    z-index: 1;
  }
  .home-cover__title {
    margin: 0;
    font-size: 48px;
    font-family: "Playfair Display", "Times New Roman", serif;
    color: #1f2a3a;
  }
  .home-cover__quotes {
    border-radius: 14px;
    border: 1px solid var(--color-border);
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.75);
    text-align: left;
  }
  .home-cover__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  .home-cover__item {
    margin: 0;
    font-size: 15px;
    line-height: 1.4;
    color: #314056;
  }
  .home-cover__shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .shape {
    position: absolute;
    display: block;
    opacity: 0.9;
    animation: float-shape 9s ease-in-out infinite;
  }
  .shape--circle { border-radius: 50%; }
  .shape--pill { border-radius: 999px; }
  .shape--one {
    width: 90px;
    height: 90px;
    background: #ffd1dc;
    top: -24px;
    left: -18px;
    animation-delay: 0s;
  }
  .shape--two {
    width: 66px;
    height: 66px;
    background: #c5f1e8;
    top: 20px;
    right: 24px;
    animation-delay: 1.5s;
  }
  .shape--three {
    width: 140px;
    height: 44px;
    background: #cde2ff;
    bottom: 16px;
    left: 22px;
    animation-delay: 2.5s;
  }
  @keyframes float-shape {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
`;

const renderShell = (device: DeviceType, header: string, sidebar: string, content: string, footer: string): string => {
  if (device === "mobile") {
    return renderContentShellMobile({ header, sidebar, main: content, footer });
  }

  if (device === "tablet") {
    return renderContentShellTablet({ header, sidebar, main: content, footer });
  }

  return renderContentShellDesktop({ header, sidebar, main: content, footer });
};

const renderShellStyles = (device: DeviceType): string => {
  if (device === "mobile") {
    return mobileShellStyles;
  }

  if (device === "tablet") {
    return tabletShellStyles;
  }

  return desktopShellStyles;
};

export const renderPageLayout = ({ device, content, session }: PageLayoutProps): string => {
  const profileMenu = renderProfileMenu({ session });
  const notificationMenu = renderNotificationMenu({ session });

  const header = device === "mobile"
    ? renderHeaderMobile({ siteName: "freeducation", profileMenu })
    : device === "tablet"
      ? renderHeaderTablet({ siteName: "freeducation", profileMenu, notificationMenu })
      : renderHeaderDesktop({ siteName: "freeducation", profileMenu, notificationMenu });

  const sidebar = device === "mobile"
    ? renderSidebarMobile({ session })
    : device === "tablet"
      ? renderSidebarTablet({ session })
      : renderSidebarDesktop({ session });
  const footer = device === "mobile" ? renderFooterMobile() : device === "tablet" ? renderFooterTablet() : renderFooterDesktop();
  const body = renderShell(device, header, sidebar, content, footer);
  const styles = `${baseStyles}\n${renderShellStyles(device)}`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Freeducation</title>
    <style>${styles}</style>
  </head>
  <body>
    ${body}
  </body>
</html>`;
};
