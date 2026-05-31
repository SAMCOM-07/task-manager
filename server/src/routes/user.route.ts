import express from "express";
import {
  getCurrentUserController,
  updateUserDetailsController,
  changePasswordController,
  deleteAccountController,
} from "../controllers/user.controller";
import {
  accountDeletionRateLimiter,
  passwordChangeRateLimiter,
  profileUpdateRateLimiter,
} from "../middlewares/rate-limits/user.limit";

export const userRouter = express.Router();

userRouter.get("/me", getCurrentUserController);
userRouter.patch(
  "/update",
  profileUpdateRateLimiter,
  updateUserDetailsController,
);
userRouter.post(
  "/change-password",
  passwordChangeRateLimiter,
  changePasswordController,
);
userRouter.delete(
  "/delete-account",
  accountDeletionRateLimiter,
  deleteAccountController,
);
