import express from "express";
import {
  clearAllTasksController,
  createTaskController,
  deleteTaskController,
  readTasksController,
  updateTaskController,
} from "../controllers/task.controller";
import {
  clearAllTasksRateLimiter,
  taskCreationRateLimiter,
  taskDeletionRateLimiter,
  taskUpdateRateLimiter,
} from "../middlewares/rate-limits/task.limit";

export const taskRouter = express.Router();

taskRouter.post("/create", taskCreationRateLimiter, createTaskController);
taskRouter.get("/read", readTasksController);
taskRouter.patch("/update/:id", taskUpdateRateLimiter, updateTaskController);
taskRouter.delete("/delete/:id", taskDeletionRateLimiter, deleteTaskController);
taskRouter.delete("/clear", clearAllTasksRateLimiter, clearAllTasksController);
