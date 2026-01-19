import { ensureSchema } from "./db/manager";
import { handleRequest, type Env } from "./routes/router";

let schemaReady: Promise<void> | null = null;

const runSchemaCheck = (env: Env): Promise<void> => {
  if (!env.DB) {
    return Promise.reject(new Error("Database binding is missing."));
  }

  if (!schemaReady) {
    schemaReady = ensureSchema(env.DB);
  }

  return schemaReady;
};

const renderServiceError = (): Response =>
  new Response("Service unavailable. Please try again later.", {
    status: 500,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      await runSchemaCheck(env);
      return await handleRequest(request, env);
    } catch {
      return renderServiceError();
    }
  },
};
