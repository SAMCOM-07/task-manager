import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route";
import dotenv from "dotenv";
import { taskRouter } from "./routes/task.route";
import { authMiddleware } from "./middlewares/auth.middleware";
import { userRouter } from "./routes/user.route";
import { getTaskAIHelp } from "./controllers/ai.controller";
import { emailMiddleware } from "./middlewares/email.middleware";
import { globalRateLimiter } from "./middlewares/rate-limits/global.limit";
import { aiRateLimiter } from "./middlewares/rate-limits/ai.limit";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      "http://localhost:5173",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(globalRateLimiter);
app.use("/api/auth", authRouter);
app.use("/api/users", authMiddleware, emailMiddleware, userRouter);
app.use("/api/tasks", authMiddleware, emailMiddleware, taskRouter);
app.post(
  "/api/ai/task-help",
  authMiddleware,
  emailMiddleware,
  aiRateLimiter,
  getTaskAIHelp,
);

export default app;
