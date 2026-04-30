import { z } from "zod";

// Validation schema for creating a user
export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9$_-]+$/,
      "Username can only contain letters, numbers, hyphens, dollar signs, and underscores",
    )
    .min(6, "Username must be at least 6 characters long")
    .max(12, "Username cannot exceed 12 characters"),
  email: z.string().email("Invalid email format").transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(25, "Password cannot exceed 25 characters"),
});

// login schema
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format").transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(25, "Password cannot exceed 25 characters"),
});

// update user schema

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9$_-]+$/,
        "Username can only contain letters, numbers, hyphens, dollar signs, and underscores",
      )
      .min(6, "Username must be at least 6 characters long")
      .max(12, "Username cannot exceed 12 characters")
      .optional(),
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(25, "Password cannot exceed 25 characters")
      .optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(25, "Password cannot exceed 25 characters")
      .optional(),
  })
  .refine((data) => data.username || data.currentPassword || data.newPassword, {
    message:
      "At least one of username, currentPassword, or newPassword must be provided",
  });
