import type { Bindings } from '../types';

// Safe wrapper for D1 Database operations
export const dbRun = async (env: Bindings, query: string, ...args: any[]) => {
  try {
    return await env.DB.prepare(query).bind(...args).run();
  } catch (e) {
    console.error(`DB Run Error: ${query}`, e);
    throw e;
  }
};

export const dbAll = async <T = any>(env: Bindings, query: string, ...args: any[]): Promise<T[]> => {
  try {
    const stmt = env.DB.prepare(query).bind(...args);
    const result = await stmt.all();
    // Handle different D1 return shapes safely
    return (result.results || []) as T[];
  } catch (e) {
    console.error(`DB All Error: ${query}`, e);
    return []; // Return empty array instead of crashing
  }
};

export const dbFirst = async <T = any>(env: Bindings, query: string, ...args: any[]): Promise<T | null> => {
  try {
    const stmt = env.DB.prepare(query).bind(...args);
    const result = await stmt.first();
    return result as T | null;
  } catch (e) {
    console.error(`DB First Error: ${query}`, e);
    return null; // Return null instead of crashing
  }
};
