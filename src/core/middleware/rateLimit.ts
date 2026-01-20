// Rate limiting store (in production, use KV or external store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: Request) => string;
  store?: Map<string, { count: number; resetTime: number }>;
}

export const createRateLimitMiddleware = (config: RateLimitConfig) => {
  const { windowMs, maxRequests, keyGenerator = defaultKeyGenerator, store = rateLimitStore } = config;

  return (request: Request): Response | null => {
    const key = keyGenerator(request);
    const now = Date.now();

    // Clean up old entries
    for (const [storeKey, data] of store.entries()) {
      if (data.resetTime < now) {
        store.delete(storeKey);
      }
    }

    const existing = store.get(key);
    
    if (!existing || existing.resetTime < now) {
      // New window
      store.set(key, { count: 1, resetTime: now + windowMs });
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
  AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  GENERAL: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  API: { windowMs: 1 * 60 * 1000, maxRequests: 30 }, // 30 requests per minute
} as const;
