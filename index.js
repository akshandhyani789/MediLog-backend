import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load env first
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
// ✅ ROUTES (SYNC IMPORT - safer for Render)
// =======================
import medicineRoutes from "./routes/medicineRoutes.js";
import userMedicineRoutes from "./routes/userMedicineRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ocrRoutes from "./routes/ocrRoute.js";

app.use("/api/medicines", medicineRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ocr", ocrRoutes);

// =======================
// ✅ TEST ROUTES
// =======================
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "API running 🚀" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// =======================
// ✅ START SERVER (IMPORTANT FIX)
// =======================
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    // ❗ STEP 1: START LISTENER FIRST (FIXES RENDER TIMEOUT)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // ❗ STEP 2: CONNECT DB AFTER SERVER STARTS
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

  } catch (err) {
    console.error("❌ Server failed:", err);
    process.exit(1);
  }
};

startServer();

// =======================
// ✅ GRACEFUL SHUTDOWN
// =======================
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  process.exit(0);
});