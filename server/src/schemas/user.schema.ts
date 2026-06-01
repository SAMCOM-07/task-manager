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
  fullName: z
    .string()
    .trim()
    .toLowerCase()
    .min(6, "Full name must be at least 6 characters long")
    .max(50, "Full name cannot exceed 50 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(25, "Password cannot exceed 25 characters"),
});

// login schema
export const loginUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(25, "Password cannot exceed 25 characters"),
});

// update user schema

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(6, "Full name must be at least 6 characters long")
      .max(50, "Full name cannot exceed 50 characters")
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
  .refine((data) => data.fullName || data.currentPassword || data.newPassword, {
    message:
      "At least one of fullName, currentPassword, or newPassword must be provided",
  });
