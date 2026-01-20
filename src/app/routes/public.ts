import { renderPageLayout } from "../../ui/layouts/pageLayout";
import type { DeviceType } from "../../core/types/layout";
import { renderHomeContent } from "../../ui/pages/home/content";
import type { AdminSession } from "../../core/security/session";
import { htmlResponse, jsonResponse } from "../../core/http";
import { getOpenAPIJSON, getOpenAPIYAML } from "../../docs/openapi";

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

  if (url.pathname === "/api-docs") {
    const format = url.searchParams.get("format") || "json";
    const content = format === "yaml" ? getOpenAPIYAML() : getOpenAPIJSON();
    const contentType = format === "yaml" ? "application/x-yaml" : "application/json";
    
    return new Response(content, {
      status: 200,
      headers: { 
        "content-type": contentType,
        "access-control-allow-origin": "*",
      },
    });
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
