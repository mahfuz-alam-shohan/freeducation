import type { DeviceType, PageLayoutProps } from "../../../core/types/layout";
import { renderPageLayout } from "../../../ui/layouts/pageLayout";
import type { AdminSession } from "../../../core/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../core/http";
import { createCSRFToken, setCSRFCookie } from "../../../core/middleware/csrf";
import type { Env } from "../../../app/env";
import {
  createHigherMathematicsNineTenChapter,
  getHigherMathematicsNineTenChapter,
  listHigherMathematicsNineTenChapters,
} from "./9-10/data";
import { renderHigherMathematicsNineTenDetail, renderHigherMathematicsNineTenList } from "./9-10/views";
import {
  createHigherMathematicsElevenTwelveChapter,
  getHigherMathematicsElevenTwelveChapter,
  listHigherMathematicsElevenTwelveChapters,
} from "./11-12/data";
import {
  renderHigherMathematicsElevenTwelveDetail,
  renderHigherMathematicsElevenTwelveHome,
  renderHigherMathematicsElevenTwelveList,
} from "./11-12/views";
import { renderHigherMathematicsHome } from "./views";

type HigherMathematicsRouteContext = {
  device: DeviceType;
  session: AdminSession | null;
  nonce?: string;
};

const validPapers = new Set(["first", "second"]);

const parseNumberParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const renderContent = (context: HigherMathematicsRouteContext, content: string): Response => {
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

export const handleHigherMathematicsRoutes = async (
  request: Request,
  env: Env,
  context: HigherMathematicsRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const basePath = "/admin/modules/subjects/higher-mathematics";

  if (!url.pathname.startsWith(basePath)) {
    return null;
  }

  if (!context.session) {
    return redirectResponse("/login");
  }

  if (url.pathname === basePath) {
    if (request.method === "GET") {
      return renderContent(context, renderHigherMathematicsHome());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === `${basePath}/9-10`) {
    if (request.method === "GET") {
      const successMessage = url.searchParams.get("updated") === "1" ? "Chapter saved." : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "Please enter a chapter name." : undefined;
      const items = await listHigherMathematicsNineTenChapters(env.DB);
      return renderContent(context, renderHigherMathematicsNineTenList({ items, successMessage, errorMessage }));
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

    await createHigherMathematicsNineTenChapter(env.DB, { title: title.trim() });
    return redirectResponse(`${basePath}/9-10?updated=1`);
  }

  const nineTenChapterMatch = url.pathname.match(/^\/admin\/modules\/subjects\/higher-mathematics\/9-10\/(\d+)$/);
  if (nineTenChapterMatch) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const chapterId = parseNumberParam(nineTenChapterMatch[1]);
    if (!chapterId) {
      return redirectResponse(`${basePath}/9-10`);
    }

    const item = await getHigherMathematicsNineTenChapter(env.DB, chapterId);
    if (!item) {
      return redirectResponse(`${basePath}/9-10`);
    }

    return renderContent(context, renderHigherMathematicsNineTenDetail(item));
  }

  if (url.pathname === `${basePath}/11-12`) {
    if (request.method === "GET") {
      return renderContent(context, renderHigherMathematicsElevenTwelveHome());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const paperMatch = url.pathname.match(/^\/admin\/modules\/subjects\/higher-mathematics\/11-12\/(first|second)$/);
  if (paperMatch) {
    if (request.method === "GET") {
      const paper = paperMatch[1];
      const successMessage = url.searchParams.get("updated") === "1" ? "Chapter saved." : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "Please enter a chapter name." : undefined;
      const items = await listHigherMathematicsElevenTwelveChapters(env.DB, paper);
      return renderContent(
        context,
        renderHigherMathematicsElevenTwelveList({ items, paper, successMessage, errorMessage }),
      );
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const paperNewMatch = url.pathname.match(/^\/admin\/modules\/subjects\/higher-mathematics\/11-12\/(first|second)\/new$/);
  if (paperNewMatch) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const paper = paperNewMatch[1];
    if (!validPapers.has(paper)) {
      return redirectResponse(`${basePath}/11-12`);
    }

    const formData = await request.formData();
    const title = formData.get("title");

    if (typeof title !== "string" || !title.trim()) {
      return redirectResponse(`${basePath}/11-12/${paper}?error=invalid`);
    }

    await createHigherMathematicsElevenTwelveChapter(env.DB, { paper, title: title.trim() });
    return redirectResponse(`${basePath}/11-12/${paper}?updated=1`);
  }

  const paperChapterMatch = url.pathname.match(
    /^\/admin\/modules\/subjects\/higher-mathematics\/11-12\/(first|second)\/(\d+)$/,
  );
  if (paperChapterMatch) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const paper = paperChapterMatch[1];
    const chapterId = parseNumberParam(paperChapterMatch[2]);

    if (!validPapers.has(paper) || !chapterId) {
      return redirectResponse(`${basePath}/11-12`);
    }

    const item = await getHigherMathematicsElevenTwelveChapter(env.DB, chapterId, paper);
    if (!item) {
      return redirectResponse(`${basePath}/11-12/${paper}`);
    }

    return renderContent(context, renderHigherMathematicsElevenTwelveDetail(item));
  }

  return jsonResponse({ error: "Not found" }, 404);
};
