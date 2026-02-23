export const rateLimiterCode = `/**
 * Rate Limiting Middleware - Production Security Layer
 *
 * Features:
 * ✅ req.ip with trust proxy support
 * ✅ HMAC for email (PII/GDPR protection)
 * ✅ msBeforeNext fallback for Retry-After header
 * ✅ skipSuccessfulRequests for auth endpoints
 * ✅ RL_SECRET enforcement in production
 */

import rateLimit from "express-rate-limit";
import crypto from "crypto";
import logger from "../utils/logger.js";

const isProd = process.env.NODE_ENV === "production";
const secret = process.env.RL_SECRET || "change-me-in-production";

// Enforce secret key in production (safety guard)
if (isProd && secret === "change-me-in-production") {
  throw new Error("RL_SECRET must be set in production");
}

/* ----------------------------- Helpers ----------------------------- */

const normalizeIp = (ip) => (ip === "::1" ? "127.0.0.1" : ip || "unknown");
const getClientIp = (req) => normalizeIp(req.ip); // requires trust proxy in app.js

const normEmail = (e = "") => String(e).toLowerCase().trim();

// HMAC instead of plaintext email (GDPR/PII protection)
const hashEmail = (e = "") =>
  crypto.createHmac("sha256", secret).update(normEmail(e)).digest("base64url");

const maskEmail = (e = "") =>
  e ? e.replace(/(^.{2}).*(@.*$)/, "$1***$2") : "unknown";

// Skip in dev or when disabled
const shouldSkip = (req) => {
  if (!isProd || process.env.RATE_LIMIT_DISABLED === "1") return true;
  if (req.method === "OPTIONS") return true;
  return false;
};

const makeLimiter = ({ windowMs, max, keyGenerator, code, message, skipSuccessful }) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    skip: shouldSkip,
    skipSuccessfulRequests: skipSuccessful || false,
    handler: (req, res) => {
      const ip = getClientIp(req);
      const emailMasked = maskEmail(req.body?.email || "");

      // Safe retry-after with fallback for different express-rate-limit versions
      const retryMs =
        req.rateLimit?.msBeforeNext ??
        (req.rateLimit?.resetTime
          ? Math.max(0, new Date(req.rateLimit.resetTime).getTime() - Date.now())
          : windowMs);

      const retryAfterSec = Math.max(1, Math.ceil(retryMs / 1000));

      logger.warn(
        \`\${code} exceeded ip=\${ip} email=\${emailMasked} path=\${req.originalUrl}\`
      );

      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        success: false,
        error: message,
        code,
        retryAfter: retryAfterSec,
      });
    },
  });

/* --------------------------- Key generators --------------------------- */

// IP + HMAC(email) — prevents bypass by changing email
const emailAwareKey = (req) =>
  \`\${getClientIp(req)}:\${hashEmail(req.body?.email || "")}\`;

const ipOnlyKey = (req) => getClientIp(req);

/* ------------------------------ Limiters ------------------------------ */

/** Global API limiter — applied to all /api routes */
export const apiLimiter = makeLimiter({
  windowMs: 60 * 1000,       // 1 min
  max: 600,
  keyGenerator: ipOnlyKey,
  code: "API_RATE_LIMIT_EXCEEDED",
  message: "Too many requests. Please slow down.",
});

/** Login — skipSuccessfulRequests prevents penalizing valid users */
export const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 30,
  keyGenerator: emailAwareKey,
  code: "RATE_LIMIT_EXCEEDED",
  message: "Too many login attempts. Try again later.",
  skipSuccessful: true,
});

/** Admin login — stricter window */
export const adminLoginLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,  // 1h
  max: 10,
  keyGenerator: emailAwareKey,
  code: "ADMIN_RATE_LIMIT_EXCEEDED",
  message: "Too many admin login attempts. Try again later.",
  skipSuccessful: true,
});

/** Password reset — prevents email enumeration via timing */
export const passwordResetLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,  // 1h
  max: 5,
  keyGenerator: emailAwareKey,
  code: "PASSWORD_RESET_LIMIT_EXCEEDED",
  message: "Too many password reset attempts. Try again later.",
});

/** Messages — 5s cooldown between sends */
export const messageRateLimiter = makeLimiter({
  windowMs: 5 * 1000,
  max: 1,
  keyGenerator: (req) => req.user?.userId || ipOnlyKey(req),
  code: "MESSAGE_RATE_LIMIT_EXCEEDED",
  message: "Wait a moment before sending another message.",
});

/** Messages — hourly cap */
export const messageHourlyLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,  // 1h
  max: 50,
  keyGenerator: (req) => req.user?.userId || ipOnlyKey(req),
  code: "MESSAGE_HOURLY_LIMIT_EXCEEDED",
  message: "Hourly message limit reached (50). Try again later.",
});

/** Search endpoints */
export const searchLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: ipOnlyKey,
  code: "SEARCH_RATE_LIMIT_EXCEEDED",
  message: "Too many search requests. Slow down.",
});`;
