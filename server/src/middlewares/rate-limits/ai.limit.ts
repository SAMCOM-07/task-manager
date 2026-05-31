import rateLimit from "express-rate-limit";

// AI assistant rate limiter
export const aiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    error: "Too many requests, please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
