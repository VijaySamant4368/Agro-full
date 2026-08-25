import { Router } from "express";
import { getWarnings, issueWarning, revokeWarningHandler } from "../controllers/warningController.js";
import { authenticateJwt, requireHost } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler(getWarnings));
router.post("/manual", authenticateJwt, requireHost, asyncHandler(issueWarning));
router.post("/:id/revoke", authenticateJwt, asyncHandler(revokeWarningHandler));

export default router;
