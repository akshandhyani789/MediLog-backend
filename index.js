import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import ocrRoutes from "./routes/ocrRoute.js";
import os from "os";

import medicineRoutes from "./routes/medicineRoutes.js";
import userMedicineRoutes from "./routes/userMedicineRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ ADD THIS

dotenv.config();
await connectDB();

const app = express();

// ✅ Get local IP for CORS
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const LOCAL_IP = getLocalIP();

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ Enhanced CORS for mobile access
app.use(cors({
  origin: function (origin, callback) {
    // Define allowed origins
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      `http://${LOCAL_IP}:5173`,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      `http://${LOCAL_IP}:3000`,
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) > -1 || origin.includes("localhost") || origin.includes(LOCAL_IP)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ ROUTES
app.use("/api/medicines", medicineRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/users", userRoutes); // ✅ VERY IMPORTANT
app.use("/api/ocr", ocrRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
