import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/pool";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { sanitizer } from "../utils/sanitizer";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";

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

    //   Check if email or username already exists
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

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }, // token lasts 2 days
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, user, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// handle logout
export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
