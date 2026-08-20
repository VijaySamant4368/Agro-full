import { Router } from "express";
import { getMatrix, querySafetyStatus } from "../controllers/safetyController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/matrix", asyncHandler(getMatrix));
router.get("/query", asyncHandler(querySafetyStatus));

export default router;
