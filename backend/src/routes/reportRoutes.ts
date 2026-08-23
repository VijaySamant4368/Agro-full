import { Router } from "express";
import { uploadReport, getReports } from "../controllers/reportController.js";
import { optionalAuthJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler(getReports));
router.post("/", optionalAuthJwt, asyncHandler(uploadReport));

export default router;
