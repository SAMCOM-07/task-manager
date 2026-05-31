import { Request, Response, NextFunction } from "express";
import { pool } from "../db/pool";
import { AuthenticatedRequest } from "./auth.middleware";

export const emailMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const result = await pool.query(
      "SELECT email_verified FROM users WHERE id = $1",
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Email not verified",
      });
    }

    next();
  } catch (error) {
    console.error("Error in email verification middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
