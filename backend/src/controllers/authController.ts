import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_type, first_name, last_name, email, password, phone_number } = req.body;
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ success: false, error: "Missing required registration fields" });
      return;
    }

    const result = await registerUser({
      user_type: user_type || "guest",
      first_name,
      last_name,
      email,
      password,
      phone_number,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: "Email and password are required" });
      return;
    }

    const result = await loginUser({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message || "Invalid email or password" });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (err: any) {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
};
