import rateLimit from "express-rate-limit";

// auth rate limiter
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many attempts, please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// email verification rate limiter
export const emailVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    error: "Too many attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// resend verification email rate limiter
export const resendVerificationEmailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: {
    error: "Too many attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// password reset rate limiter
export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    error: "Too many attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
