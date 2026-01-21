import type { DeviceType, PageLayoutProps } from "../../../core/types/layout";
import { renderPageLayout } from "../../../ui/layouts/pageLayout";
import type { AdminSession } from "../../../core/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../core/http";
import { createCSRFToken, setCSRFCookie } from "../../../core/middleware/csrf";
import type { Env } from "../../../app/env";
import { createMathematicsNineTenChapter, getMathematicsNineTenChapter, listMathematicsNineTenChapters } from "./9-10/data";
import { renderMathematicsNineTenDetail, renderMathematicsNineTenList } from "./9-10/views";
import { renderMathematicsHome } from "./views";

type MathematicsRouteContext = {
  device: DeviceType;
  session: AdminSession | null;
  nonce?: string;
};

const parseNumberParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const renderContent = (context: MathematicsRouteContext, content: string): Response => {
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

export const handleMathematicsRoutes = async (
  request: Request,
  env: Env,
  context: MathematicsRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const basePath = "/admin/modules/subjects/mathematics";

  if (!url.pathname.startsWith(basePath)) {
    return null;
  }

  if (!context.session) {
    return redirectResponse("/login");
  }

  if (url.pathname === basePath) {
    if (request.method === "GET") {
      return renderContent(context, renderMathematicsHome());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === `${basePath}/9-10`) {
    if (request.method === "GET") {
      const successMessage = url.searchParams.get("updated") === "1" ? "Chapter saved." : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "Please enter a chapter name." : undefined;
      const items = await listMathematicsNineTenChapters(env.DB);
      return renderContent(context, renderMathematicsNineTenList({ items, successMessage, errorMessage }));
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === `${basePath}/9-10/new`) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await request.formData();
    const title = formData.get("title");

    if (typeof title !== "string" || !title.trim()) {
      return redirectResponse(`${basePath}/9-10?error=invalid`);
    }

    await createMathematicsNineTenChapter(env.DB, { title: title.trim() });
    return redirectResponse(`${basePath}/9-10?updated=1`);
  }

  const chapterMatch = url.pathname.match(/^\/admin\/modules\/subjects\/mathematics\/9-10\/(\d+)$/);
  if (chapterMatch) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const chapterId = parseNumberParam(chapterMatch[1]);
    if (!chapterId) {
      return redirectResponse(`${basePath}/9-10`);
    }

    const item = await getMathematicsNineTenChapter(env.DB, chapterId);
    if (!item) {
      return redirectResponse(`${basePath}/9-10`);
    }

    return renderContent(context, renderMathematicsNineTenDetail(item));
  }

  return jsonResponse({ error: "Not found" }, 404);
};
