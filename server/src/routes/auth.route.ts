import express from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh-token", refreshTokenController);