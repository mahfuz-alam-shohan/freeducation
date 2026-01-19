import { ensureSchema } from "./db/manager";
import { handleRequest, type Env } from "./routes/router";

let schemaReady: Promise<void> | null = null;

const runSchemaCheck = (env: Env): Promise<void> => {
  if (!schemaReady) {
    schemaReady = ensureSchema(env.DB);
  }

  return schemaReady;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    await runSchemaCheck(env);
    return handleRequest(request, env);
  },
};
