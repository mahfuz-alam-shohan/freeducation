import type { DeviceType, PageLayoutProps } from "../../../../../core/types/layout";
import { renderPageLayout } from "../../../../../ui/layouts/pageLayout";
import type { AdminSession } from "../../../../../core/security/session";
import { htmlResponse, jsonResponse, redirectResponse } from "../../../../../core/http";
import { createCSRFToken, setCSRFCookie } from "../../../../../core/middleware/csrf";
import type { Env } from "../../../../../app/env";
import {
  createBanglaElevenTwelveLiteratureItem,
  createBanglaElevenTwelveSahapathItem,
  deleteBanglaElevenTwelveLiteratureItem,
  deleteBanglaElevenTwelveSahapathItem,
  getBanglaElevenTwelveLiteratureItem,
  getBanglaElevenTwelveSahapathItem,
  listBanglaElevenTwelveLiteratureItems,
  listBanglaElevenTwelveSahapathItems,
  updateBanglaElevenTwelveLiteratureItem,
  updateBanglaElevenTwelveSahapathItem,
  updateBanglaElevenTwelveSahapathItemCategory,
  updateBanglaElevenTwelveSahapathItemTitle,
} from "./data";
import {
  renderBanglaElevenTwelveHome,
  renderBanglaElevenTwelveLiteratureDetail,
  renderBanglaElevenTwelveLiteratureHome,
  renderBanglaElevenTwelveLiteratureList,
  renderBanglaElevenTwelveSahapathDetail,
  renderBanglaElevenTwelveSahapathList,
} from "./views";

type BanglaRouteContext = {
  device: DeviceType;
  session: AdminSession | null;
  nonce?: string;
};

const sahapathCategories = ["natok", "uponnash"] as const;

type LiteratureCategory = "goddo" | "poddo";

const parseNumberParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

const buildSwapPrompt = (url: URL): {
  entryId: number;
  targetId: number;
  entryTitle: string;
  entryCategory: string;
  targetCategory: string;
} | null => {
  if (url.searchParams.get("swap") !== "1") {
    return null;
  }

  const entryId = parseNumberParam(url.searchParams.get("entryId"));
  const targetId = parseNumberParam(url.searchParams.get("targetId"));
  const entryTitle = url.searchParams.get("title");
  const entryCategory = url.searchParams.get("entryCategory");
  const targetCategory = url.searchParams.get("targetCategory");

  if (!entryId || !targetId || !entryTitle || !entryCategory || !targetCategory) {
    return null;
  }

  return { entryId, targetId, entryTitle, entryCategory, targetCategory };
};

export const handleBanglaElevenTwelveFirstPaperRoutes = async (
  request: Request,
  env: Env,
  context: BanglaRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const basePath = "/admin/modules/subjects/bangla/11-12/first-paper";

  if (!url.pathname.startsWith(basePath)) {
    return null;
  }

  if (!context.session) {
    return redirectResponse("/login");
  }

  if (url.pathname === basePath) {
    if (request.method === "GET") {
      return renderContent(context, renderBanglaElevenTwelveHome());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === `${basePath}/literature`) {
    if (request.method === "GET") {
      return renderContent(context, renderBanglaElevenTwelveLiteratureHome());
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === `${basePath}/sahapath`) {
    if (request.method === "GET") {
      const items = await listBanglaElevenTwelveSahapathItems(env.DB);
      const usedCategories = new Set(items.map((item) => item.category));
      const availableCategories = sahapathCategories.filter((category) => !usedCategories.has(category));
      const successMessage = url.searchParams.get("updated") === "1" ? "তথ্য সংরক্ষণ হয়েছে।" : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "অনুগ্রহ করে তথ্য পূরণ করুন।" : undefined;
      const swapPrompt = buildSwapPrompt(url);
      return renderContent(
        context,
        renderBanglaElevenTwelveSahapathList({
          items,
          availableCategories,
          ...(successMessage ? { successMessage } : {}),
          ...(errorMessage ? { errorMessage } : {}),
          ...(swapPrompt ? { swapPrompt } : {}),
        }),
      );
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === `${basePath}/sahapath/new`) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await request.formData();
    const category = formData.get("category");
    const title = formData.get("title");

    if (typeof category !== "string" || typeof title !== "string") {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    const items = await listBanglaElevenTwelveSahapathItems(env.DB);
    if (items.some((item) => item.category === category)) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    await createBanglaElevenTwelveSahapathItem(env.DB, { category, title: trimmedTitle });
    return redirectResponse(`${basePath}/sahapath?updated=1`);
  }

  if (url.pathname === `${basePath}/sahapath/edit`) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await request.formData();
    const itemId = parseNumberParam(formData.get("id")?.toString() ?? null);
    const category = formData.get("category");
    const title = formData.get("title");

    if (!itemId || typeof category !== "string" || typeof title !== "string") {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    const items = await listBanglaElevenTwelveSahapathItems(env.DB);
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    const conflictingItem = items.find((item) => item.category === category && item.id !== itemId);
    if (conflictingItem) {
      const params = new URLSearchParams({
        swap: "1",
        entryId: String(itemId),
        targetId: String(conflictingItem.id),
        title: trimmedTitle,
        entryCategory: currentItem.category,
        targetCategory: conflictingItem.category,
      });
      return redirectResponse(`${basePath}/sahapath?${params.toString()}`);
    }

    await updateBanglaElevenTwelveSahapathItem(env.DB, { id: itemId, category, title: trimmedTitle });
    return redirectResponse(`${basePath}/sahapath?updated=1`);
  }

  if (url.pathname === `${basePath}/sahapath/switch`) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await request.formData();
    const entryId = parseNumberParam(formData.get("entryId")?.toString() ?? null);
    const targetId = parseNumberParam(formData.get("targetId")?.toString() ?? null);
    const entryTitle = formData.get("entryTitle");
    const entryCategory = formData.get("entryCategory");
    const targetCategory = formData.get("targetCategory");

    if (
      !entryId ||
      !targetId ||
      typeof entryTitle !== "string" ||
      typeof entryCategory !== "string" ||
      typeof targetCategory !== "string"
    ) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    const trimmedTitle = entryTitle.trim();
    if (!trimmedTitle) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    await updateBanglaElevenTwelveSahapathItemTitle(env.DB, { id: entryId, title: trimmedTitle });
    await updateBanglaElevenTwelveSahapathItemCategory(env.DB, { id: entryId, category: targetCategory });
    await updateBanglaElevenTwelveSahapathItemCategory(env.DB, { id: targetId, category: entryCategory });

    return redirectResponse(`${basePath}/sahapath?updated=1`);
  }

  if (url.pathname === `${basePath}/sahapath/delete`) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await request.formData();
    const itemId = parseNumberParam(formData.get("id")?.toString() ?? null);
    if (!itemId) {
      return redirectResponse(`${basePath}/sahapath?error=invalid`);
    }

    await deleteBanglaElevenTwelveSahapathItem(env.DB, itemId);
    return redirectResponse(`${basePath}/sahapath?updated=1`);
  }

  const sahapathDetailMatch = url.pathname.match(/^\/admin\/modules\/subjects\/bangla\/11-12\/sahapath\/(\d+)$/);
  if (sahapathDetailMatch) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const itemId = Number(sahapathDetailMatch[1]);
    const item = await getBanglaElevenTwelveSahapathItem(env.DB, itemId);
    if (!item) {
      return redirectResponse(`${basePath}/sahapath`);
    }

    return renderContent(context, renderBanglaElevenTwelveSahapathDetail(item));
  }

  const literatureDetailMatch = url.pathname.match(
    /^\/admin\/modules\/subjects\/bangla\/11-12\/literature\/(goddo|poddo)\/(\d+)$/,
  );
  if (literatureDetailMatch) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const itemId = Number(literatureDetailMatch[2]);
    const item = await getBanglaElevenTwelveLiteratureItem(env.DB, itemId);
    if (!item) {
      return redirectResponse(`${basePath}/literature`);
    }

    return renderContent(context, renderBanglaElevenTwelveLiteratureDetail(item));
  }

  const literatureCategoryMatch = url.pathname.match(
    /^\/admin\/modules\/subjects\/bangla\/11-12\/literature\/(goddo|poddo)$/,
  );
  if (literatureCategoryMatch) {
    const category = literatureCategoryMatch[1] as LiteratureCategory;

    if (request.method === "GET") {
      const items = await listBanglaElevenTwelveLiteratureItems(env.DB, category);
      const successMessage = url.searchParams.get("updated") === "1" ? "তথ্য সংরক্ষণ হয়েছে।" : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "অনুগ্রহ করে তথ্য পূরণ করুন।" : undefined;
      return renderContent(
        context,
        renderBanglaElevenTwelveLiteratureList({
          items,
          category,
          ...(successMessage ? { successMessage } : {}),
          ...(errorMessage ? { errorMessage } : {}),
        }),
      );
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const literatureActionMatch = url.pathname.match(
    /^\/admin\/modules\/subjects\/bangla\/11-12\/literature\/(goddo|poddo)\/(new|edit|delete)$/,
  );
  if (literatureActionMatch) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const category = literatureActionMatch[1] as LiteratureCategory;
    const action = literatureActionMatch[2];
    const formData = await request.formData();

    if (action === "new") {
      const title = formData.get("title");
      if (typeof title !== "string" || !title.trim()) {
        return redirectResponse(`${basePath}/literature/${category}?error=invalid`);
      }
      await createBanglaElevenTwelveLiteratureItem(env.DB, { category, title: title.trim() });
      return redirectResponse(`${basePath}/literature/${category}?updated=1`);
    }

    if (action === "edit") {
      const itemId = parseNumberParam(formData.get("id")?.toString() ?? null);
      const title = formData.get("title");
      if (!itemId || typeof title !== "string" || !title.trim()) {
        return redirectResponse(`${basePath}/literature/${category}?error=invalid`);
      }
      await updateBanglaElevenTwelveLiteratureItem(env.DB, { id: itemId, title: title.trim() });
      return redirectResponse(`${basePath}/literature/${category}?updated=1`);
    }

    if (action === "delete") {
      const itemId = parseNumberParam(formData.get("id")?.toString() ?? null);
      if (!itemId) {
        return redirectResponse(`${basePath}/literature/${category}?error=invalid`);
      }
      await deleteBanglaElevenTwelveLiteratureItem(env.DB, itemId);
      return redirectResponse(`${basePath}/literature/${category}?updated=1`);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
};
