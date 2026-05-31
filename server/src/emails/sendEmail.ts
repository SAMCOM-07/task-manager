import { generateVerificationToken } from "../utils/generateToken";
import { resend } from "./resend";
import VerifyEmail from "./templates/VerifyEmail";
import { pool } from "../db/pool";

// Function to send verification email
export const sendVerificationEmail = async (
  email: string,
  username: string,
  userId: string,
) => {
  try {
    const token = generateVerificationToken(userId);
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const res = await resend.emails.send({
      from: `Task Manager <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      react: VerifyEmail({
        username,
        verificationLink,
      }),
    });

    // Store the token and its expiration in the database
    await pool.query(
      `UPDATE users SET verification_token = $1, verification_token_expires = NOW() + INTERVAL '5 minutes' WHERE id = $2`,
      [token, userId],
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};