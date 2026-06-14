// In-memory rate limiter — resets on server restart.
// For production, replace with a Redis-backed limiter (e.g. @upstash/ratelimit).

const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now  = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetInMs: WINDOW_MS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, resetInMs: entry.resetAt - now };
}

export function clearRateLimit(key: string): void {
  attempts.delete(key);
}
