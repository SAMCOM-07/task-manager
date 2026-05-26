// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// export interface AuthenticatedRequest extends Request {
//   user?: any; // You can define a more specific type based on your JWT payload
// }

// export const authMiddleware = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

//     req.user = decoded; // attach user info
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
