import { Router } from "express";
import { createBooking, getBookings } from "../controllers/bookingController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", authenticateJwt, asyncHandler(getBookings));
router.post("/", authenticateJwt, asyncHandler(createBooking));

export default router;
