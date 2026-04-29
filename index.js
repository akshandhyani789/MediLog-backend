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

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medi-log-frontend.vercel.app", // ❌ removed trailing slash
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =======================
// ✅ ROUTES
// =======================
app.use("/api/medicines", medicineRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ocr", ocrRoutes);

// =======================
// ✅ TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.status(200).send("API running 🚀");
});

// =======================
// ✅ START SERVER (RENDER SAFE)
// =======================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔄 Starting backend...");

    // ⚠️ DB CONNECTION SAFETY
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await connectDB();

    // ✅ IMPORTANT: MUST BIND TO 0.0.0.0 FOR RENDER
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:");
    console.error(error.message);

    // ❌ CRITICAL: EXIT so Render shows proper error logs
    process.exit(1);
  }
};

startServer();