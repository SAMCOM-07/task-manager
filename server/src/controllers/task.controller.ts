import { Request, Response } from "express";
import { pool } from "../db/pool";
import { randomUUID } from "crypto";
import { sanitizer } from "../utils/sanitizer";
import { createTaskSchema } from "../schemas/task.schema";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// create task controller
export const createTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = sanitizer(req.body);

  // Validate input with Zod
  const validationResult = createTaskSchema.safeParse(data);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const { title, description, status, priority, due_date, category } =
      validationResult.data;
    const userId = req.user?.userId;
    const id = randomUUID();

    const insertQuery =
      "INSERT INTO tasks (id, title, description, status, due_date, priority, category, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const values = [
      id,
      title,
      description,
      status,
      due_date,
      priority,
      category,
      userId,
    ];
    const result = await pool.query(insertQuery, values);

    res
      .status(200)
      .json({ message: "Task created successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// read tasks controller with filters by query params and also search by title or description
export const readTasksController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    const { filter, search } = req.query;

    let query = "SELECT * FROM tasks WHERE user_id = $1";
    const values: string[] = [userId!];
    let index = 2;

    if (filter) {
      if (filter === "overdue") {
        query += ` AND due_date < NOW() AND status != 'completed'`;
      } else {
        query += ` AND (status = $${index} OR priority = $${index} OR category = $${index})`;
        values.push(filter as string);
        index++;
      }
    }

    if (search) {
      query += ` AND (title ILIKE $${index} OR description ILIKE $${index})`;
      values.push(`%${search}%`);
      index++;
    }

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Tasks fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// update task controller
export const updateTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = sanitizer(req.body);
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  // Validate input with Zod
  const validationResult = createTaskSchema.safeParse(data);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const userId = req.user?.userId;

    // Check if task exists and belongs to the user
    const checkQuery = "SELECT * FROM tasks WHERE id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [taskId, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    } else if (checkResult.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this task" });
    }

    const { title, description, status, priority, due_date, category } =
      validationResult.data;

    const updateQuery =
      "UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4, priority = $5, category = $6 WHERE id = $7 AND user_id = $8 RETURNING *";
    const values = [
      title,
      description,
      status,
      due_date,
      priority,
      category,
      taskId,
      userId,
    ];
    const result = await pool.query(updateQuery, values);
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// delete task controller
export const deleteTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const userId = req.user?.userId;
    // check if task exists and belongs to the user
    const checkQuery = "SELECT * FROM tasks WHERE id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [taskId, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    } else if (checkResult.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this task" });
    }

    const deleteQuery = "DELETE FROM tasks WHERE id = $1 AND user_id = $2";
    await pool.query(deleteQuery, [taskId, userId]);

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// clear all tasks controller
export const clearAllTasksController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    const deleteQuery = "DELETE FROM tasks WHERE user_id = $1";
    await pool.query(deleteQuery, [userId]);
    res
      .status(200)
      .json({ success: true, message: "All tasks cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear tasks" });
  }
};
