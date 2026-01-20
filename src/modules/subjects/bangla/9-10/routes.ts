import type { DeviceType } from "../../../../core/types/layout";
import { renderPageLayout } from "../../../../ui/layouts/pageLayout";
import type { AdminSession } from "../../../../core/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../../core/http";
import { createCSRFToken, setCSRFCookie } from "../../../../core/middleware/csrf";
import type { Env } from "../../../../app/env";
import { handleBanglaNineTenFirstPaperRoutes } from "./first-paper/routes";
import { handleBanglaNineTenSecondPaperRoutes } from "./second-paper/routes";
import { renderBanglaNineTenPaperSelection } from "./views";

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

export const handleBanglaNineTenRoutes = async (
  request: Request,
  env: Env,
  context: BanglaRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const basePath = "/admin/modules/subjects/bangla/9-10";

  if (!url.pathname.startsWith(basePath)) {
    return null;
  }

  if (!context.session) {
    return redirectResponse("/login");
  }

  if (url.pathname === basePath) {
    if (request.method === "GET") {
      return renderContent(context, renderBanglaNineTenPaperSelection());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname.startsWith(`${basePath}/first-paper`)) {
    return handleBanglaNineTenFirstPaperRoutes(request, env, context);
  }

  if (url.pathname.startsWith(`${basePath}/second-paper`)) {
    return handleBanglaNineTenSecondPaperRoutes(request, env, context);
  }

  return null;
};
