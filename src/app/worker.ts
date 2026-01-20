import { ensureSchema } from "../core/db/manager";
import { handleRequest } from "./router";
import type { Env } from "./env";

let schemaReady: Promise<void> | null = null;

const runSchemaCheck = (env: Env): Promise<void> => {
  if (!env.DB) {
    return Promise.resolve();
  }

  if (!schemaReady) {
    schemaReady = ensureSchema(env.DB);
  }

  return schemaReady;
};

const renderServiceError = (error: unknown): Response => {
  const message = error instanceof Error ? error.message : "Unknown error";

  return new Response(`Service unavailable: ${message}`, {
    status: 500,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      await runSchemaCheck(env);
      return await handleRequest(request, env);
    } catch (error) {
      return renderServiceError(error);
    }
  },
};
