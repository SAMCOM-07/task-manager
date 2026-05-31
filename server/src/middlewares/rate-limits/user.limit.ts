import rateLimit from "express-rate-limit";

// profile update rate limiter
export const profileUpdateRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts, please try again after 10 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// password change rate limiter
export const passwordChangeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// account deletion rate limiter
export const accountDeletionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
