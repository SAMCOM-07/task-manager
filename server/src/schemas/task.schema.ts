import { z } from "zod";

// Validation schema for creating a task

// type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(30, "Title cannot exceed 30 characters"),
  description: z.string().trim().min(1, "Description cannot be empty"),
  priority: z.enum(["low", "medium", "high"], {
    error: () => ({ message: "Priority is required." }),
  }),
  status: z.enum(["todo", "in_progress", "completed"], {
    error: () => ({ message: "Status is required." }),
  }),
  category: z.enum(["work", "education", "personal", "career"], {
    error: () => ({ message: "Category is required." }),
  }),
  due_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid due date format")
    .refine(
      (date) => new Date(date) > new Date(),
      "Due date must be in the future",
    ),
});
