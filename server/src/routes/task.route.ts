import express from "express";
import {
  clearAllTasksController,
  createTaskController,
  deleteTaskController,
  readTasksController,
  updateTaskController,
} from "../controllers/task.controller";

export const taskRouter = express.Router();

taskRouter.post("/create", createTaskController);
taskRouter.get("/read", readTasksController);
taskRouter.patch("/update/:id", updateTaskController);
taskRouter.delete("/delete/:id", deleteTaskController);
taskRouter.delete("/clear", clearAllTasksController);
