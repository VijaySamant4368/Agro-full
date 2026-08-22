import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests allowed per window
  message?: string;
  keyGenerator?: (req: Request) => string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, ClientRecord>();

// Cleanup expired keys every 5 minutes to prevent memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = "Too many requests. Please try again later.",
    keyGenerator = (req: Request) =>
      req.ip ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-client",
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();

    let client = memoryStore.get(key);

    if (!client || now > client.resetTime) {
      client = {
        count: 1,
        resetTime: now + windowMs,
      };
      memoryStore.set(key, client);
    } else {
      client.count += 1;
    }

    const remaining = Math.max(0, max - client.count);
    const resetSeconds = Math.ceil((client.resetTime - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetSeconds);

    if (client.count > max) {
      res.setHeader("Retry-After", resetSeconds);
      res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: resetSeconds,
      });
      return;
    }

    next();
  };
}

// 1. Auth Limiter (Login & Register): 15 requests per 15 minutes per IP
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many authentication attempts. Please wait a few minutes before trying again.",
});

// 2. Email Resend Limiter: 3 requests per 10 minutes per IP/Email
export const emailRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: "Verification email rate limit exceeded. Please check your inbox or wait 10 minutes.",
  keyGenerator: (req) => {
    const email = req.body?.email || req.query?.email || "";
    const ip = req.ip || (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "";
    return `email_rate_${email}_${ip}`;
  },
});
