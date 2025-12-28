import { routeRequest } from "./router";
import { renderErrorPage } from "./admin/render";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await routeRequest(request, env);
    } catch (error) {
      return renderErrorPage(request, error);
    }
  },
};
