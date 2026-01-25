import { ServerRouter } from './backend/src/server/router';

export default {
  async fetch(request, env, ctx) {
    // Initialize server router
    const serverRouter = new ServerRouter({ env });
    await serverRouter.initialize();
    
    // Handle the request
    return serverRouter.handleRequest(request);
  }
};