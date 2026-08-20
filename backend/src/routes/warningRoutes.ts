import { Router } from "express";
import { getWarnings, issueWarning } from "../controllers/warningController.js";
import { authenticateJwt, requireHost } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler(getWarnings));
router.post("/manual", authenticateJwt, requireHost, asyncHandler(issueWarning));

export default router;
