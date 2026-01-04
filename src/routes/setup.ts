import { initDatabase } from "../db";
import type { Env } from "../types";
import { apiHeaders } from "./shared";

export const handleSetup = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === "/api/init" && request.method === "POST") {
    await initDatabase(env.DB);
    return Response.json({ success: true, message: "Database initialized" }, { headers: apiHeaders });
  }

  return null;
};
