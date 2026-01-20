// Performance optimization: Database query cache
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const cachedQuery = async <T>(
  db: any, // D1Database type
  query: string,
  cacheKey: string,
  params?: any[],
  ttl: number = 30000 // 30 seconds
): Promise<T[]> => {
  const now = Date.now();
  const cached = queryCache.get(cacheKey);
  
  if (cached && now - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  
  const stmt = params ? db.prepare(query).bind(...params) : db.prepare(query);
  const result = await stmt.all<T>();
  
  queryCache.set(cacheKey, {
    data: result.results,
    timestamp: now,
    ttl
  });
  
  return result.results;
};

// Clean up expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      queryCache.delete(key);
    }
  }
}, 300000);
