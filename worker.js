// Freeducation Platform - Modular Worker Entry Point

import worker from './src/index.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle API routes first
      const apiResponse = await worker.handleRoute?.(request, env, ctx);
      if (apiResponse) {
        return apiResponse;
      }

      // Handle static files and other routes
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Serve the main application for all non-API routes
      return new Response(worker.generateHTML?.(pathname), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600',
        }
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
