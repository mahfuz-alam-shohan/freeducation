import { syncSchema } from "./structure.js";

let schemaReadyPromise;

export async function ensureSchema(env) {
  if (!schemaReadyPromise) {
    schemaReadyPromise = syncSchema(env);
  }

  await schemaReadyPromise;
}
