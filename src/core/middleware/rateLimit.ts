// Rate limiting stores
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const apiRateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: Request) => string;
  store?: Map<string, { count: number; resetTime: number }>;
  usePersistentStore?: boolean;
}

export const createRateLimitMiddleware = (config: RateLimitConfig) => {
  const { windowMs, maxRequests, keyGenerator = defaultKeyGenerator, usePersistentStore = false } = config;
  
  // Choose store based on whether we need persistence
  const selectedStore = usePersistentStore ? apiRateLimitStore : rateLimitStore;

  return (request: Request): Response | null => {
    const key = keyGenerator(request);
    const now = Date.now();

    // Clean up old entries (only for in-memory stores)
    if (!usePersistentStore) {
      for (const [storeKey, data] of selectedStore.entries()) {
        if (data.resetTime < now) {
          selectedStore.delete(storeKey);
        }
      }
    }

    const existing = selectedStore.get(key);
    
    if (!existing || existing.resetTime < now) {
      // New window
      selectedStore.set(key, { count: 1, resetTime: now + windowMs });
      return null;
    }

    if (existing.count >= maxRequests) {
      return new Response('Too many requests', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain',
          'Retry-After': Math.ceil((existing.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': existing.resetTime.toString(),
        },
      });
    }

    existing.count++;
    return null;
  };
};

const defaultKeyGenerator = (request: Request): string => {
  const forwarded = request.headers.get("X-Forwarded-For");
  const forwardedIp = forwarded ? forwarded.split(",")[0]?.trim() : null;
  const ip = request.headers.get("CF-Connecting-IP") || forwardedIp || "unknown";
  return `${ip}:${new URL(request.url).pathname}`;
};

// Predefined rate limit configurations
export const RATE_LIMITS = {
  AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5, usePersistentStore: false }, // In-memory for UI
  GENERAL: { windowMs: 15 * 60 * 1000, maxRequests: 100, usePersistentStore: false }, // In-memory for UI
  API: { windowMs: 1 * 60 * 1000, maxRequests: 30, usePersistentStore: true }, // Persistent for API
} as const;
