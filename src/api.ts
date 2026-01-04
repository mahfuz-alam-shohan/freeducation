import { initDatabase } from "./db";
import type { Env } from "./types";
import { handleAuth } from "./routes/auth";
import { handleClasses } from "./routes/classes";
import { handleContent } from "./routes/content";
import { handleFonts } from "./routes/fonts";
import { handleSettings } from "./routes/settings";
import { handleSetup } from "./routes/setup";
import { handleThumbnails } from "./routes/thumbnails";
import { handleUsers } from "./routes/users";
import { handleVideos } from "./routes/videos";
import { apiHeaders, corsHeaders } from "./routes/shared";

export { corsHeaders };

const handlers = [
  handleFonts,
  handleThumbnails,
  handleSetup,
  handleAuth,
  handleUsers,
  handleVideos,
  handleContent,
  handleClasses,
  handleSettings,
];

export async function handleApiRequest(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") return new Response(null, { headers: apiHeaders });
  if (!path.startsWith("/api/")) return null;

  try {
    await initDatabase(env.DB);

    for (const handler of handlers) {
      const response = await handler(request, env, path);
      if (response) return response;
    }
  } catch (e: any) {
    return Response.json({ success: false, error: e.message || "Internal Server Error" }, { status: 500, headers: apiHeaders });
  }

  return null;
}
