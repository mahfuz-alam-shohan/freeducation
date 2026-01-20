import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import { renderHomeContent } from "../pages/home/content";
import type { AdminSession } from "../services/security/session";
import { htmlResponse, jsonResponse } from "./utils";

type PublicRouteContext = {
  adminReady: boolean;
  device: DeviceType;
  session: AdminSession | null;
};

const getCacheStore = (): Cache | null => {
  const cacheStorage = (globalThis as { caches?: CacheStorage }).caches;
  return cacheStorage?.default ?? null;
};

const renderHome = (device: DeviceType, session: AdminSession | null, cacheable: boolean): Response => {
  const content = renderHomeContent();
  const headers: HeadersInit | undefined = cacheable
    ? {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        Vary: "User-Agent",
      }
    : undefined;
  return htmlResponse(renderPageLayout({ device, content, session }), 200, headers);
};

export const handlePublicRoutes = async (request: Request, context: PublicRouteContext): Promise<Response | null> => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return jsonResponse({ status: "ok" });
  }

  if (url.pathname === "/" || url.pathname === "/home") {
    if (!context.adminReady) {
      return null;
    }
    const isCacheable = request.method === "GET" && !context.session;
    if (isCacheable) {
      const cache = getCacheStore();
      const cacheKey = new Request(`${url.origin}${url.pathname}?device=${context.device}`);
      const cached = await cache?.match(cacheKey);
      if (cached) {
        return cached;
      }
      const response = renderHome(context.device, context.session, true);
      await cache?.put(cacheKey, response.clone());
      return response;
    }
    return renderHome(context.device, context.session, false);
  }

  return null;
};
