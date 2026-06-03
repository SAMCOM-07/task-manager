import { generateEmailVerificationToken } from "../utils/generateToken";
import { resend } from "./resend";
import { pool } from "../db/pool";
import VerificationEmail from "./templates/VerificationEmail";
import PasswordResetEmail from "./templates/PasswordResetEmail";

// Function to send verification email
export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  userId: string,
) => {
  try {
    const token = generateEmailVerificationToken(userId);
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    // Store the token and its expiration in the database
    await pool.query(
      `UPDATE users SET verification_token = $1, verification_token_expires = NOW() + INTERVAL '5 minutes' WHERE id = $2`,
      [token, userId],
    );

    // Send the verification email using Resend
    const res = await resend.emails.send({
      from: `Task Manager <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({
        fullName,
        verificationLink,
      }),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  fullName: string,
  userId: string,
) => {
  try {
    const resetToken = generateEmailVerificationToken(userId);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Store the token and its expiration in the database
    await pool.query(
      `UPDATE users SET password_reset_token = $1, password_reset_token_expires = NOW() + INTERVAL '10 minutes' WHERE id = $2`,
      [resetToken, userId],
    );

    const res = await resend.emails.send({
      from: `Task Manager <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Reset your password",
      react: PasswordResetEmail({
        fullName,
        resetLink,
      }),
    });
    console.log(res);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
