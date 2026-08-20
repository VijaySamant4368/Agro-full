import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    user_type: string;
  };
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Access token missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      id: number;
      email: string;
      user_type: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Token expired or unauthorized" });
  }
};

export const requireHost = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || (req.user.user_type !== "host" && req.user.user_type !== "admin")) {
    res.status(403).json({ success: false, error: "Forbidden: Host permissions required" });
    return;
  }
  next();
};
