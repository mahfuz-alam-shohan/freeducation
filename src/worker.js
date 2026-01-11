import { handleApi } from "./server.js";
import { renderApp } from "./client.js";

export default {
  async fetch(request, env) {
    const apiResponse = await handleApi(request, env);
    if (apiResponse) return apiResponse;

    const url = new URL(request.url);
    const headers = {
      "Content-Type": "text/html",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    };

    return new Response(renderApp(url.pathname), { headers });
  },
};
