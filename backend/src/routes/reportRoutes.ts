import { Router } from "express";
import { uploadReport, getReports } from "../controllers/reportController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler(getReports));
router.post("/", authenticateJwt, asyncHandler(uploadReport));

export default router;
