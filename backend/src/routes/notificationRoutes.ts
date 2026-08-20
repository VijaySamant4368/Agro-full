import { Router } from "express";
import {
  getNotifications,
  markRead,
  markAllRead,
} from "../controllers/notificationController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", authenticateJwt, asyncHandler(getNotifications));
router.patch("/:id/read", authenticateJwt, asyncHandler(markRead));
router.post("/read-all", authenticateJwt, asyncHandler(markAllRead));

export default router;
