import type { DeviceType } from "../../../../../core/types/layout";
import { renderPageLayout } from "../../../../../ui/layouts/pageLayout";
import type { AdminSession } from "../../../../../core/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../../../core/http";
import { createCSRFToken, setCSRFCookie } from "../../../../../core/middleware/csrf";
import type { Env } from "../../../../../app/env";
import { renderBanglaNineTenSecondPaperHome } from "./views";

type BanglaRouteContext = {
  device: DeviceType;
  session: AdminSession | null;
};

const renderContent = (context: BanglaRouteContext, content: string): Response => {
  const csrfToken = createCSRFToken();
  return htmlResponse(renderPageLayout({ device: context.device, content, session: context.session, csrfToken }), 200, {
    "Set-Cookie": setCSRFCookie(csrfToken),
    "Cache-Control": "no-store",
  });
};

export const handleBanglaNineTenSecondPaperRoutes = async (
  request: Request,
  _env: Env,
  context: BanglaRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const basePath = "/admin/modules/subjects/bangla/9-10/second-paper";

  if (!url.pathname.startsWith(basePath)) {
    return null;
  }

  if (!context.session) {
    return redirectResponse("/login");
  }

  if (url.pathname === basePath) {
    if (request.method === "GET") {
      return renderContent(context, renderBanglaNineTenSecondPaperHome());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  return null;
};
