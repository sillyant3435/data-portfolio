import { headers } from "next/headers";

// In-memory store for IP-based rate limiting (for development)
// For production, use Redis via @upstash/ratelimit
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiter using IP address
 * Stores request count per IP with automatic reset
 * 
 * @param limit - Max requests allowed per window
 * @param windowMs - Time window in milliseconds
 * @returns boolean - true if request is allowed, false if rate limited
 */
export async function checkRateLimit(
  limit: number = 5,
  windowMs: number = 3600000 // 1 hour
): Promise<boolean> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (record && now < record.resetTime) {
    // Within same window
    if (record.count >= limit) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return false;
    }
    record.count++;
  } else {
    // New window or first request
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
  }

  return true;
}
