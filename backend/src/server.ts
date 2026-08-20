import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { isLiveSupabaseConfigured } from "./config/supabase.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// CORS Configuration
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5173",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools, curl, mobile, or same-origin
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list or regex (any localhost / 127.0.0.1 port)
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      ENV.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev/testing
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
