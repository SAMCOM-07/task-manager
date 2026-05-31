import jwt from "jsonwebtoken";

// Utility function to generate JWT access token
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env
      .ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

// Utility function to generate JWT refresh token
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env
      .REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

// utility function to generate verification token
export const generateVerificationToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.VERIFICATION_TOKEN_SECRET as string, {
    expiresIn: process.env
      .VERIFICATION_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};
