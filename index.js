import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";

import medicineRoutes from "./routes/medicineRoutes.js";
import userMedicineRoutes from "./routes/userMedicineRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ocrRoutes from "./routes/ocrRoute.js";

import startExpiryCron from "./cron/expiryNotifier.js";

dotenv.config();

const app = express();

// ========================
// ENV (🔥 FIX IS HERE)
// ========================
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || "development";

// ========================
// MIDDLEWARE
// ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://medilog-henna.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================
// ROUTES
// ========================
app.get("/", (req, res) => {
  res.json({
    message: "🚀 MediLog Backend is running",
    health: "/health",
    status: "OK",
  });
});

app.use("/api/medicines", medicineRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/barcode", medicineRoutes);

// ========================
// HEALTH CHECK
// ========================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    environment: NODE_ENV,
  });
});

// ========================
// START SERVER
// ========================
const startServer = async () => {
  try {
    await connectDB();

    // optional cron (safe now)
    startExpiryCron();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🌐 http://localhost:${PORT}`);
      console.log(`🧪 http://localhost:${PORT}/health`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();