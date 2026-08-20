import { Router } from "express";
import { getFarms, getFarm, createFarm } from "../controllers/farmController.js";
import { authenticateJwt } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler(getFarms));
router.get("/:slug", asyncHandler(getFarm));
router.post("/", authenticateJwt, asyncHandler(createFarm));

export default router;
