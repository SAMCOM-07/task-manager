import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route";
import dotenv from "dotenv";
import { taskRouter } from "./routes/task.route";
import { authMiddleware } from "./middlewares/auth.middleware";
import { userRouter } from "./routes/user.route";

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", authMiddleware, userRouter);
app.use("/api/tasks", authMiddleware, taskRouter);

export default app;
