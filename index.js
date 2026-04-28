import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import ocrRoutes from "./routes/ocrRoute.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import userMedicineRoutes from "./routes/userMedicineRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ CORS (FIXED for production + Vercel)
app.use(cors({
  origin: [
    "http://localhost:5173",              // local frontend
    "https://medi-log-frontend.vercel.app/",         // your Vercel domain (change if needed)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ ROUTES
app.use("/api/medicines", medicineRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ocr", ocrRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running...");
});

// ✅ START SERVER (FIXED properly)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();