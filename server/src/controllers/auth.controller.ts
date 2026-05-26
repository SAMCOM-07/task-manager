import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/pool";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { sanitizer } from "../utils/sanitizer";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

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
  const data = sanitizer(req.body);

  const validationResult = createUserSchema.safeParse(data);

  if (!validationResult.success) {
    return res
      .status(400)
      .json({ error: validationResult.error.flatten().fieldErrors });
  }

  try {
    const { password, email, username } = validationResult.data;
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
      "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email";
    const values = [id, username, email, hashedPassword];
    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    const accessToken = generateAccessToken(user.id);

    const refreshToken = generateRefreshToken(user.id);

    // store refresh token in cookie
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    res.status(201).json({
      success: true,
      token: accessToken,
      message: "User registered successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error occurred while registering" });
  }
};

// handle login
export const loginController = async (req: Request, res: Response) => {
  const data = sanitizer(req.body);

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

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
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
