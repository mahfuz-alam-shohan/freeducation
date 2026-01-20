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
import { baseStyles } from "./styles";
import { clientScript } from "./client-script";
import type { DeviceType, PageLayoutProps } from "../types/layout";

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
    <div class="loader" id="page-loader" aria-hidden="true">
      <div class="loader__spinner"></div>
    </div>
    <script>${clientScript}</script>
  </body>
</html>`;
};
