export const rateLimitCode = `import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Use Upstash Redis in production, in-memory fallback in development
const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;

export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
      analytics: true,
    })
  : null;

// Unified helper — always returns the same shape
export async function checkRateLimit(identifier: string) {
  if (!ratelimit) {
    // Development: no Redis configured — allow all requests
    return { success: true, limit: 10, remaining: 10, reset: Date.now() };
  }

  return await ratelimit.limit(identifier);
}`;
