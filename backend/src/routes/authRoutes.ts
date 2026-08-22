import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  me,
} from "../controllers/authController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authRateLimiter, emailRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, asyncHandler(register));
router.post("/login", authRateLimiter, asyncHandler(login));
router.get("/verify-email", asyncHandler(verifyEmail));
router.post("/verify-email", asyncHandler(verifyEmail));
router.post("/resend-verification", emailRateLimiter, asyncHandler(resendVerification));
router.get("/me", authenticateJwt, asyncHandler(me));

export default router;
