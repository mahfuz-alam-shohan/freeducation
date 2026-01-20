import type { DeviceType } from "../../../../../types/layout";
import { renderPageLayout } from "../../../../../layouts/pageLayout";
import type { AdminSession } from "../../../../../services/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../../../utils";
import type { Env } from "../../../../../routes/utils";
import { renderBanglaNineTenSecondPaperHome } from "./views";

type BanglaRouteContext = {
  device: DeviceType;
  session: AdminSession | null;
};

const renderContent = (context: BanglaRouteContext, content: string): Response =>
  htmlResponse(renderPageLayout({ device: context.device, content, session: context.session }));

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
