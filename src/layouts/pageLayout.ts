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
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .button-link:hover { background: var(--color-surface-muted); border-color: var(--color-border-strong); transform: translateY(-1px); }
  .button-link:active { background: var(--color-surface-elevated); }
  .button-link--primary {
    background: var(--color-accent);
    color: #fff;
    border-color: transparent;
  }
  .button-link--danger {
    background: #ffe8ed;
    color: #8b1f3c;
    border-color: #f4bcc8;
  }
  .button-link--danger:hover {
    background: #ffd9e1;
    color: #7a1733;
  }
  .page { max-width: 640px; margin: 0 auto; display: grid; gap: 12px; }
  .page-header { display: grid; gap: 6px; }
  .page-title { margin: 0; font-size: 28px; }
  .page-subtitle { margin: 0; color: var(--color-text-muted); }
  .page-section { display: grid; gap: 8px; animation: fade-in 0.3s ease; }
  .page-actions { display: flex; justify-content: flex-start; flex-wrap: wrap; gap: 8px; }
  .section-title { margin: 0; font-size: 20px; }
  .form-card {
    display: grid;
    gap: 10px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 12px;
    background: var(--color-surface);
    box-shadow: none;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }
  .form-card:hover { border-color: var(--color-border-strong); }
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
    box-shadow: none;
  }
  .filter-fields { display: grid; gap: 10px; }
  .filter-field { display: grid; gap: 6px; }
  .filter-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .table-scroll { width: 100%; overflow-x: auto; border-radius: var(--radius-md); }
  .data-table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-surface);
    box-shadow: none;
  }
  .data-table th,
  .data-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--color-border); }
  .data-table th { font-size: 14px; color: var(--color-text-muted); background: var(--color-surface-muted); }
  .data-table tbody tr { transition: background-color 0.2s ease; }
  .data-table tbody tr:last-child td { border-bottom: none; }
  .data-table tbody tr:hover { background: var(--color-surface-elevated); }
  .confirm-delete { position: relative; display: inline-flex; }
  .confirm-delete__toggle { position: absolute; opacity: 0; pointer-events: none; }
  .confirm-delete__modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: rgba(15, 18, 28, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 80;
  }
  .confirm-delete__toggle:checked ~ .confirm-delete__modal { opacity: 1; pointer-events: auto; }
  .confirm-delete__panel {
    width: min(320px, 100%);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    padding: 12px;
    display: grid;
    gap: 10px;
    box-shadow: none;
  }
  .confirm-delete__header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .confirm-delete__title { margin: 0; font-size: 16px; }
  .confirm-delete__close { cursor: pointer; font-size: 18px; line-height: 1; padding: 2px 6px; }
  .confirm-delete__form {
    display: grid;
    gap: 10px;
  }
  .confirm-delete__field { display: grid; gap: 4px; font-size: 13px; color: var(--color-text-muted); }
  .confirm-delete__actions { display: flex; justify-content: flex-end; gap: 8px; }
  .alert {
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    padding: 8px 10px;
    background: var(--color-surface-muted);
  }
  .alert--error { border-color: #f4bcc8; color: #8b1f3c; background: #ffe8ed; }
  .page-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0;
    pointer-events: none;
    z-index: 200;
    transition: opacity 0.2s ease;
  }
  .page-loader.is-active { opacity: 1; }
  .page-loader__bar {
    width: 35%;
    height: 100%;
    background: linear-gradient(90deg, rgba(62, 98, 255, 0), rgba(62, 98, 255, 0.7), rgba(62, 98, 255, 0));
    animation: loader-slide 1.2s ease-in-out infinite;
  }
  .home {
    width: 100%;
    max-width: none;
    margin: 0;
    gap: 16px;
  }
  /* Home cover should always span the full available width to avoid narrow layouts. */
  .home-cover {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 0;
    border: 1px solid var(--color-border);
    padding: 18px 16px;
    background: var(--color-surface-muted);
  }
  .home-cover__content {
    position: relative;
    display: grid;
    gap: 14px;
    text-align: center;
    z-index: 1;
  }
  .home-cover__title {
    margin: 0;
    font-size: 48px;
    font-family: "Playfair Display", "Times New Roman", serif;
    color: var(--color-text);
    letter-spacing: 1.5px;
  }
  .home-cover__quotes {
    border-radius: 0;
    border: none;
    padding: 0;
    background: transparent;
    text-align: center;
  }
  .home-cover__list {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    min-height: 64px;
  }
  .home-cover__item {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: var(--color-text-muted);
    position: absolute;
    inset: 0;
    opacity: 0;
    animation: quote-cycle 16s infinite;
  }
  .home-cover__item:nth-child(2) { animation-delay: 4s; }
  .home-cover__item:nth-child(3) { animation-delay: 8s; }
  .home-cover__item:nth-child(4) { animation-delay: 12s; }
  .home-cover__shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .shape {
    position: absolute;
    display: block;
    opacity: 0.4;
    border-radius: 0;
    mix-blend-mode: multiply;
    --shape-rotate: 0deg;
    animation: float-shape 10s ease-in-out infinite;
  }
  .shape--one {
    width: 120px;
    height: 50px;
    background: rgba(46, 86, 255, 0.25);
    top: 16px;
    left: 12px;
    --shape-rotate: -8deg;
    animation-delay: 0s;
  }
  .shape--two {
    width: 76px;
    height: 76px;
    background: rgba(41, 69, 208, 0.08);
    top: 18px;
    right: 32px;
    --shape-rotate: 12deg;
    animation-delay: 1.8s;
  }
  .shape--three {
    width: 160px;
    height: 38px;
    background: rgba(46, 86, 255, 0.2);
    bottom: 18px;
    left: 40px;
    --shape-rotate: 6deg;
    animation-delay: 2.6s;
  }
  .shape--four {
    width: 110px;
    height: 42px;
    background: rgba(41, 69, 208, 0.12);
    bottom: 28px;
    right: 40px;
    --shape-rotate: -10deg;
    animation-delay: 3.4s;
  }
  .shape--five {
    width: 42px;
    height: 120px;
    background: rgba(46, 86, 255, 0.18);
    top: 40%;
    right: 12%;
    --shape-rotate: 4deg;
    animation-delay: 4.2s;
  }
  @keyframes float-shape {
    0% { transform: translateY(0) rotate(var(--shape-rotate)); }
    50% { transform: translateY(-10px) rotate(var(--shape-rotate)); }
    100% { transform: translateY(0) rotate(var(--shape-rotate)); }
  }
  @keyframes quote-cycle {
    0% { opacity: 0; transform: translateY(6px); }
    5% { opacity: 1; transform: translateY(0); }
    25% { opacity: 1; transform: translateY(0); }
    30% { opacity: 0; transform: translateY(-4px); }
    100% { opacity: 0; transform: translateY(-4px); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes loader-slide {
    0% { transform: translateX(-40%); }
    50% { transform: translateX(120%); }
    100% { transform: translateX(240%); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
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
    <div class="page-loader" id="page-loader" aria-hidden="true">
      <div class="page-loader__bar"></div>
    </div>
    <script>
      const pageLoader = document.getElementById("page-loader");
      const activateLoader = () => pageLoader?.classList.add("is-active");
      const deactivateLoader = () => pageLoader?.classList.remove("is-active");
      window.addEventListener("pageshow", deactivateLoader);
      document.addEventListener("submit", (event) => {
        const target = event.target;
        if (target instanceof HTMLFormElement && target.target !== "_blank") {
          activateLoader();
        }
      });
      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest("a");
        if (!link || link.target === "_blank") return;
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        activateLoader();
      });
    </script>
  </body>
</html>`;
};
