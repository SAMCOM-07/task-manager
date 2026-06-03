import { Request, Response } from "express";
import { pool } from "../db/pool";
import { sanitizer } from "../utils/sanitizer";
import { updateUserSchema } from "../schemas/user.schema";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// handle get current user
export const getCurrentUserController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user?.userId;
    const userQuery =
      "SELECT id, username, email, full_name FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];
    res
      .status(200)
      .json({ success: true, message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error fetching current user" });
  }
};

// update user info
export const updateUserDetailsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = sanitizer(req.body);

  const validatedResult = updateUserSchema.safeParse(data);

  if (!validatedResult.success) {
    return res
      .status(400)
      .json({ error: validatedResult.error.flatten().fieldErrors });
  }

  try {
    const userId = req.user?.userId;

    const { fullName } = validatedResult.data;

    if (!fullName) {
      return res.status(400).json({ error: "Full name is required" });
    }

    // check if user exists
    const userCheckQuery = "SELECT * FROM users WHERE id = $1";
    const value = [userId];

    const userCheckResult = await pool.query(userCheckQuery, value);

    if (userCheckResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const query = `UPDATE users SET full_name = COALESCE($1, full_name) WHERE id = $2 RETURNING id, username, email, full_name
  `;
    const values = [fullName.toLowerCase(), userId];
    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user details" });
  }
};

// change password controller
export const changePasswordController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = sanitizer(req.body);

  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = data;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    // Check if user exists
    const userCheckQuery = "SELECT * FROM users WHERE id = $1";
    const userCheckResult = await pool.query(userCheckQuery, [userId]);

    if (userCheckResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      userCheckResult.rows[0].password,
    );

    if (!passwordMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "New password cannot be the same as current password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updateQuery =
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, email";
    const result = await pool.query(updateQuery, [hashedPassword, userId]);
    let user = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Error changing password" });
  }
};

// delete account controller with password verification
export const deleteAccountController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = sanitizer(req.body);

  try {
    const userId = req.user?.userId;
    const { password } = data;

    // Validate input
    if (!password) {
      return res
        .status(400)
        .json({ error: "Password is required to delete account" });
    }

    // Check if user exists
    const userCheckQuery = "SELECT * FROM users WHERE id = $1";
    const userCheckResult = await pool.query(userCheckQuery, [userId]);

    if (userCheckResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(
      password,
      userCheckResult.rows[0].password,
    );

    if (!passwordMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    // Delete user's tasks first
    await pool.query("DELETE FROM tasks WHERE user_id = $1", [userId]);

    // Delete user from database
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
};
