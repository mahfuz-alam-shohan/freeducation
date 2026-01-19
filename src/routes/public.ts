import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import { renderHomeContent } from "../pages/home/content";
import type { AdminSession } from "../services/security/session";
import { htmlResponse, jsonResponse } from "./utils";

type PublicRouteContext = {
  adminReady: boolean;
  device: DeviceType;
  session: AdminSession | null;
};

const renderHome = (device: DeviceType, session: AdminSession | null): Response => {
  const content = renderHomeContent();
  return htmlResponse(renderPageLayout({ device, content, session }));
};

export const handlePublicRoutes = (request: Request, context: PublicRouteContext): Response | null => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return jsonResponse({ status: "ok" });
  }

  if (url.pathname === "/" || url.pathname === "/home") {
    if (!context.adminReady) {
      return null;
    }
    return renderHome(context.device, context.session);
  }

  return null;
};
