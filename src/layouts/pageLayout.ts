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
  .home-hero {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--color-border);
    padding: 18px 16px;
    background: #fff7f0;
  }
  .home-hero__content {
    position: relative;
    display: grid;
    gap: 10px;
    text-align: center;
    z-index: 1;
  }
  .home-hero__eyebrow {
    margin: 0;
    font-size: 14px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7a4e4e;
  }
  .home-hero__title {
    margin: 0;
    font-size: 48px;
    font-family: "Playfair Display", "Times New Roman", serif;
    color: #1f2a3a;
  }
  .home-hero__subtitle {
    margin: 0;
    font-size: 16px;
    color: #4a596f;
  }
  .home-hero__shapes {
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
  .shape--square { border-radius: 12px; }
  .shape--pill { border-radius: 999px; }
  .shape--diamond {
    border-radius: 8px;
    animation-name: float-diamond;
  }
  .shape--one {
    width: 90px;
    height: 90px;
    background: #ffd1dc;
    top: -20px;
    left: -10px;
    animation-delay: 0s;
  }
  .shape--two {
    width: 60px;
    height: 60px;
    background: #c5f1e8;
    top: 22px;
    right: 28px;
    animation-delay: 1.5s;
  }
  .shape--three {
    width: 120px;
    height: 50px;
    background: #cde2ff;
    bottom: 14px;
    left: 18px;
    animation-delay: 2.5s;
  }
  .shape--four {
    width: 160px;
    height: 44px;
    background: #ffe6b7;
    bottom: -18px;
    right: 16px;
    animation-delay: 3.5s;
  }
  .shape--five {
    width: 56px;
    height: 56px;
    background: #d9c8ff;
    top: 62px;
    left: 46%;
    animation-delay: 4.5s;
  }
  .home-quotes {
    display: grid;
    gap: 10px;
  }
  .home-quotes__title {
    margin: 0;
    font-size: 20px;
    color: #1f2a3a;
  }
  .home-quotes__rail {
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 12px 14px;
    background: #f4fbff;
    min-height: 110px;
    overflow: hidden;
  }
  .home-quotes__list {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    height: 100%;
  }
  .home-quotes__item {
    position: absolute;
    inset: 0;
    margin: 0;
    font-size: 15px;
    line-height: 1.4;
    color: #314056;
    opacity: 0;
    animation: quote-cycle 20s ease-in-out infinite;
  }
  .home-quotes__item:nth-child(1) { animation-delay: 0s; }
  .home-quotes__item:nth-child(2) { animation-delay: 5s; }
  .home-quotes__item:nth-child(3) { animation-delay: 10s; }
  .home-quotes__item:nth-child(4) { animation-delay: 15s; }
  .home-highlights {
    display: grid;
    gap: 10px;
  }
  .home-highlight {
    border-radius: 14px;
    border: 1px solid var(--color-border);
    padding: 12px 14px;
    display: grid;
    gap: 6px;
  }
  .home-highlight h3 {
    margin: 0;
    font-size: 18px;
  }
  .home-highlight p {
    margin: 0;
    color: #445166;
    font-size: 14px;
  }
  .home-highlight--coral { background: #ffe9e5; }
  .home-highlight--mint { background: #e5fbf5; }
  .home-highlight--sky { background: #e8f1ff; }
  @keyframes float-shape {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  @keyframes float-diamond {
    0% { transform: translateY(0) rotate(45deg); }
    50% { transform: translateY(-10px) rotate(45deg); }
    100% { transform: translateY(0) rotate(45deg); }
  }
  @keyframes quote-cycle {
    0% { opacity: 0; transform: translateY(6px); }
    8% { opacity: 1; transform: translateY(0); }
    22% { opacity: 1; transform: translateY(0); }
    30% { opacity: 0; transform: translateY(-6px); }
    100% { opacity: 0; transform: translateY(-6px); }
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

  const sidebar = device === "mobile" ? renderSidebarMobile() : device === "tablet" ? renderSidebarTablet() : renderSidebarDesktop();
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
