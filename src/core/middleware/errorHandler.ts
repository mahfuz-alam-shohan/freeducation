import { Context } from 'hono';

export const errorHandler = async (c: Context, next: () => Promise<void>) => {
  try {
    await next();
  } catch (error) {
    console.error('Error occurred:', error);
    
    if (error instanceof Error) {
      return c.json({
        error: error.message,
        timestamp: new Date().toISOString()
      }, 500);
    }
    
    return c.json({
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, 500);
  }
};
