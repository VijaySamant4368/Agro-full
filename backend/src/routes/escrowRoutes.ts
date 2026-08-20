import { Router } from "express";
import {
  getEscrows,
  releasePayout,
  triggerEmergencyRefund,
} from "../controllers/escrowController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler(getEscrows));
router.post("/:paymentId/release", authenticateJwt, asyncHandler(releasePayout));
router.post("/:paymentId/refund", authenticateJwt, asyncHandler(triggerEmergencyRefund));

export default router;
