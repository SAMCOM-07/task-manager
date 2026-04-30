import express from "express";
import {
  getCurrentUserController,
  updateUserDetailsController,
  changePasswordController,
  deleteAccountController,
} from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/me", getCurrentUserController);
userRouter.patch("/update", updateUserDetailsController);
userRouter.delete("/account", deleteAccountController);
userRouter.post("/change-password", changePasswordController);
userRouter.delete("/delete-account", deleteAccountController);
