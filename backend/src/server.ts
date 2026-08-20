import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { isLiveSupabaseConfigured } from "./config/supabase.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [ENV.CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    supabaseConnected: isLiveSupabaseConfigured(),
    environment: ENV.NODE_ENV,
  });
});

// API Routes
app.use("/api", apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(ENV.PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AgroSafe Backend Server running on port ${ENV.PORT}`);
  console.log(`🌐 Supabase DB Integration: ${isLiveSupabaseConfigured() ? "Connected (Live)" : "Local Mock Storage (Waiting for .env credentials)"}`);
  console.log(`📡 Base API URL: http://localhost:${ENV.PORT}/api`);
  console.log(`====================================================`);
});

export default app;
