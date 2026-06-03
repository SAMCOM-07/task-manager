import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/pool";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { sanitizer } from "../utils/sanitizer";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
} from "../utils/generateToken";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../emails/sendEmail";

const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// handle register
export const registerController = async (req: Request, res: Response) => {
  let data = sanitizer(req.body);
  data = {
    ...data,
    username: data.username?.toLowerCase(),
    email: data.email?.toLowerCase(),
    fullName: data.fullName?.toLowerCase(),
  };

  const validationResult = createUserSchema.safeParse(data);

  if (!validationResult.success) {
    return res
      .status(400)
      .json({ error: validationResult.error.flatten().fieldErrors });
  }

  try {
    const { password, email, username, fullName } = validationResult.data;
    const hashedPassword = (await bcrypt.hash(password, 10)) as string;
    const id = randomUUID();

    //   Check if email exists
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    // check if username already exists
    const usernameCheckQuery = "SELECT * FROM users WHERE username = $1";
    const usernameCheckResult = await pool.query(usernameCheckQuery, [
      username,
    ]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (usernameCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const insertQuery =
      "INSERT INTO users (id, username, email, password, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, full_name";
    const values = [id, username, email, hashedPassword, fullName];
    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    const accessToken = generateAccessToken(user.id);

    const refreshToken = generateRefreshToken(user.id);

    // send verification email
    await sendVerificationEmail(email, fullName, user.id);

    // store refresh token in cookie
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    // send verification email

    res.status(201).json({
      success: true,
      token: accessToken,
      message: "User registered successfully",
      user: {
        ...user,
        verification_token: undefined,
        verification_token_expires: undefined,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error occurred while registering" });
  }
};

// handle login
export const loginController = async (req: Request, res: Response) => {
  let data = sanitizer(req.body);
  data = {
    ...data,
    email: data.email?.toLowerCase(),
  };

  const validationResult = loginUserSchema.safeParse(data);

  if (!validationResult.success) {
    return res
      .status(400)
      .json({ error: validationResult.error.flatten().fieldErrors });
  }

  const { email, password } = validationResult.data;

  try {
    // check if user exists
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Email not registered" });
    }

    const user = userResult.rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // store refresh token in cookie
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    // send verification email if email is not verified
    if (!user.email_verified) {
      await sendVerificationEmail(email, user.full_name, user.id);
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
        verification_token: undefined,
        verification_token_expires: undefined,
      },
      token: accessToken,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// handle token refresh
export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as {
      userId: string;
    };

    const newAccessToken = generateAccessToken(decoded.userId);

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({
      error: "Invalid refresh token",
    });
  }
};

// handle logout
export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", getRefreshCookieOptions());
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// handle email verification
export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Verification token missing",
      });
    }
    const userQuery = `SELECT * FROM users WHERE verification_token = $1 AND verification_token_expires > NOW()`;

    const userResult = await pool.query(userQuery, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const user = userResult.rows[0];

    await pool.query(
      `UPDATE users SET email_verified = true, verification_token = NULL, verification_token_expires = NULL WHERE id = $1`,
      [user.id],
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server error" });
  }
};

// handle resend verification email
export const resendVerificationEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;
    if (!email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Email not registered" });
    }
    const user = userResult.rows[0];

    if (user.email_verified) {
      return res
        .status(400)
        .json({ error: "Email is already verified, please log in" });
    }

    // send verification email
    await sendVerificationEmail(email, user.full_name, user.id);

    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// handle forgot password
export const getPasswordResetEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email.toLowerCase()]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Email not registered" });
    }

    const user = userResult.rows[0];

    // Send password reset email
    await sendPasswordResetEmail(email, user.full_name, user.id);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

// handle reset password
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Reset token missing" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const userQuery = `SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_token_expires > NOW()`;
    const userResult = await pool.query(userQuery, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const user = userResult.rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await pool.query(
      `UPDATE users SET password = $1, password_reset_token = NULL, password_reset_token_expires = NULL WHERE id = $2`,
      [hashedPassword, user.id],
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
