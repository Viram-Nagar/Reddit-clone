const rateLimit = require("express-rate-limit");

// ─── General API limiter ──────────────────────────────
// 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  skip: (req) => {
    // Skip rate limiting for GET requests in development
    return process.env.NODE_ENV === "development" && req.method === "GET";
  },
});

// ─── Auth limiter ─────────────────────────────────────
// Stricter: 10 attempts per 15 minutes per IP
// Prevents brute-force password attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  skipSuccessfulRequests: true, // Don't count successful logins
});

// ─── Create post limiter ──────────────────────────────
// 20 posts per hour per IP
const createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many posts created, please slow down",
  },
});

// ─── Vote limiter ─────────────────────────────────────
// 200 votes per 15 minutes per IP
const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many votes, please slow down",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  createPostLimiter,
  voteLimiter,
};
