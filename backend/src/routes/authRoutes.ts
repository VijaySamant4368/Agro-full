import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", authenticateJwt, asyncHandler(me));

export default router;
