import type { DeviceType, PageLayoutProps } from "../../../../core/types/layout";
import { renderPageLayout } from "../../../../ui/layouts/pageLayout";
import type { AdminSession } from "../../../../core/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../../core/http";
import { createCSRFToken, setCSRFCookie } from "../../../../core/middleware/csrf";
import type { Env } from "../../../../app/env";
import { handleBanglaElevenTwelveFirstPaperRoutes } from "./first-paper/routes";
import { handleBanglaElevenTwelveSecondPaperRoutes } from "./second-paper/routes";
import { renderBanglaElevenTwelvePaperSelection } from "./views";

type BanglaRouteContext = {
  device: DeviceType;
  session: AdminSession | null;
  nonce?: string;
};

const renderContent = (context: BanglaRouteContext, content: string): Response => {
  const csrfToken = createCSRFToken();
  const layoutProps: PageLayoutProps = { device: context.device, content, session: context.session, csrfToken };
  if (context.nonce) {
    layoutProps.nonce = context.nonce;
  }
  return htmlResponse(renderPageLayout(layoutProps), 200, {
    "Set-Cookie": setCSRFCookie(csrfToken),
    "Cache-Control": "no-store",
  });
};

export const handleBanglaElevenTwelveRoutes = async (
  request: Request,
  env: Env,
  context: BanglaRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const basePath = "/admin/modules/subjects/bangla/11-12";

  if (!url.pathname.startsWith(basePath)) {
    return null;
  }

  if (!context.session) {
    return redirectResponse("/login");
  }

  if (url.pathname === basePath) {
    if (request.method === "GET") {
      return renderContent(context, renderBanglaElevenTwelvePaperSelection());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname.startsWith(`${basePath}/first-paper`)) {
    return handleBanglaElevenTwelveFirstPaperRoutes(request, env, context);
  }

  if (url.pathname.startsWith(`${basePath}/second-paper`)) {
    return handleBanglaElevenTwelveSecondPaperRoutes(request, env, context);
  }

  return null;
};
