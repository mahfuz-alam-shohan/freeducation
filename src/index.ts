import { routeRequest } from "./router";
import { Env } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await routeRequest(request, env);
    } catch (error: any) {
      console.error(error);
      return new Response(`Internal Error: ${error.message}`, { status: 500 });
    }
  },
};
