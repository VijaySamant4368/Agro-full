import { Router } from "express";
import authRoutes from "./authRoutes.js";
import farmRoutes from "./farmRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import escrowRoutes from "./escrowRoutes.js";
import reportRoutes from "./reportRoutes.js";
import warningRoutes from "./warningRoutes.js";
import safetyRoutes from "./safetyRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/farms", farmRoutes);
apiRouter.use("/bookings", bookingRoutes);
apiRouter.use("/escrow", escrowRoutes);
apiRouter.use("/reports", reportRoutes);
apiRouter.use("/warnings", warningRoutes);
apiRouter.use("/safety", safetyRoutes);
apiRouter.use("/notifications", notificationRoutes);

export default apiRouter;
