import type { Bindings } from '../types';

export const dbAll = async <T>(env: Bindings, query: string, ...bindings: unknown[]) => {
  const { results } = await env.DB.prepare(query).bind(...bindings).all<T>();
  return results;
};

export const dbFirst = async <T>(env: Bindings, query: string, ...bindings: unknown[]) => {
  return env.DB.prepare(query).bind(...bindings).first<T>();
};

export const dbRun = async (env: Bindings, query: string, ...bindings: unknown[]) => {
  return env.DB.prepare(query).bind(...bindings).run();
};
