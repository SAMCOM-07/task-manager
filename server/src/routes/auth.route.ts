import express from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerificationEmailController,
  verifyEmailController,
  getPasswordResetEmailController,
  resetPasswordController,
} from "../controllers/auth.controller";
import {
  authRateLimiter,
  emailVerificationRateLimiter,
  resendVerificationEmailRateLimiter,
} from "../middlewares/rate-limits/auth.limit";

export const authRouter = express.Router();

authRouter.post("/register", authRateLimiter, registerController);
authRouter.post("/login", authRateLimiter, loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.post(
  "/verify-email/:token",
  emailVerificationRateLimiter,
  verifyEmailController,
);
authRouter.post(
  "/resend-verification-email",
  resendVerificationEmailRateLimiter,
  resendVerificationEmailController,
);
authRouter.post(
  "/password-reset-email",
  authRateLimiter,
  getPasswordResetEmailController,
);
authRouter.post(
  "/reset-password/:token",
  authRateLimiter,
  resetPasswordController,
);
