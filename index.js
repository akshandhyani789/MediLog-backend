import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load env FIRST before any other imports
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// ✅ MIDDLEWARE
// =======================
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medi-log-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =======================
// ✅ ROUTES (lazy loaded to prevent startup crashes)
// =======================
const loadRoutes = async () => {
  try {
    const { default: medicineRoutes } = await import("./routes/medicineRoutes.js");
    const { default: userMedicineRoutes } = await import("./routes/userMedicineRoutes.js");
    const { default: userRoutes } = await import("./routes/userRoutes.js");
    const { default: ocrRoutes } = await import("./routes/ocrRoute.js");

    app.use("/api/medicines", medicineRoutes);
    app.use("/api/user-medicines", userMedicineRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/ocr", ocrRoutes);

    console.log("✅ All routes loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load routes:", err.message);
    throw err;
  }
};

// =======================
// ✅ TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "API running 🚀" });
});

// =======================
// ✅ HEALTH CHECK (important for Render)
// =======================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// =======================
// ✅ START SERVER
// =======================
const startServer = async () => {
  console.log("=".repeat(50));
  console.log("🚀 MediLog Backend Starting...");
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📍 Port: ${PORT}`);
  console.log("=".repeat(50));

  // 1. Validate required environment variables
  console.log("🔍 Validating environment variables...");
  if (!process.env.MONGO_URI) {
    console.error("❌ FATAL: MONGO_URI is not defined!");
    console.error("   Please set MONGO_URI environment variable.");
    process.exit(1);
  }
  console.log("✅ MONGO_URI is defined");

  try {
    // 2. Load routes
    console.log("🔄 Loading routes...");
    await loadRoutes();

    // 3. Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    const { default: connectDB } = await import("./config/db.js");
    await connectDB();

    // 4. Start HTTP server (CRITICAL: bind to 0.0.0.0 for Render)
    console.log(`🔄 Starting HTTP server on 0.0.0.0:${PORT}...`);
    
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log("=".repeat(50));
      console.log(`✅ Server successfully running!`);
      console.log(`🌐 Listening on: http://0.0.0.0:${PORT}`);
      console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
      console.log("=".repeat(50));
    });

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ Server error:", err);
      if (err.code === "EADDRINUSE") {
        console.error(`   Port ${PORT} is already in use!`);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error("=".repeat(50));
    console.error("❌ FATAL: Server failed to start!");
    console.error("=".repeat(50));
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
};

// =======================
// ✅ GRACEFUL SHUTDOWN
// =======================
process.on("SIGTERM", () => {
  console.log("📡 SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📡 SIGINT received, shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();