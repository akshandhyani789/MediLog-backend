import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

// Routes
import medicineRoutes from "./routes/medicineRoutes.js";
import userMedicineRoutes from "./routes/userMedicineRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ocrRoutes from "./routes/ocrRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// =======================
// ✅ STEP 1: ENVIRONMENT VALIDATION
// =======================
const validateEnv = () => {
  const required = ["MONGO_URI", "FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ FATAL: Missing required environment variables:");
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
};

validateEnv();

// =======================
// ✅ STEP 2: MIDDLEWARE SETUP
// =======================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://medi-log-frontend.vercel.app",
      "https://medilog-henna.vercel.app",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  })
);

// =======================
// ✅ STEP 3: API ROUTES (No double slashes)
// =======================
app.use("/api/medicines", medicineRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ocr", ocrRoutes);

// =======================
// ✅ STEP 4: HEALTH CHECK ENDPOINTS
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "MediLog API running 🚀",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// =======================
// ✅ STEP 5: 404 JSON HANDLER (not HTML)
// =======================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    message: `No ${req.method} handler for ${req.path}`,
  });
});

// =======================
// ✅ STEP 6: GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: NODE_ENV === "development" ? err.message : "An error occurred",
    path: req.path,
  });
});

// =======================
// ✅ STEP 7: START SERVER
// =======================
const startServer = async () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 MediLog Backend Starting...");
  console.log("=".repeat(60));
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`📍 Port: ${PORT}`);
  console.log("=".repeat(60) + "\n");

  try {
    // Connect to MongoDB
    console.log("🔄 Step 1: Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Step 1 Complete: MongoDB connected\n");

    // Start HTTP server
    console.log("🔄 Step 2: Starting HTTP server on 0.0.0.0...");
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log("✅ Step 2 Complete: HTTP server listening\n");
      console.log("=".repeat(60));
      console.log("✨ SERVER READY");
      console.log("=".repeat(60));
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📍 Base API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log("=".repeat(60) + "\n");
    });

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ Server error:", err.message);
      if (err.code === "EADDRINUSE") {
        console.error(`   Port ${PORT} is already in use!`);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ FATAL: Server failed to start");
    console.error("=".repeat(60));
    console.error("Error:", error.message);
    console.error("=".repeat(60) + "\n");
    process.exit(1);
  }
};

// =======================
// ✅ STEP 8: GRACEFUL SHUTDOWN
// =======================
process.on("SIGTERM", () => {
  console.log("\n📡 SIGTERM received - Shutting down gracefully...");
  mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n📡 SIGINT received - Shutting down gracefully...");
  mongoose.connection.close();
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// =======================
// ✅ START APPLICATION
// =======================
startServer();