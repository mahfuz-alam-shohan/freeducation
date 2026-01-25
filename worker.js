import { RequestRouter } from './backend/src/core/RequestRouter';

export default {
  async fetch(request, env, ctx) {
    // Initialize request router
    const requestRouter = new RequestRouter({ env });
    await requestRouter.initialize();
    
    // Handle the request
    return requestRouter.handleRequest(request);
  }
};