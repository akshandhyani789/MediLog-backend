// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// // Routes
// import medicineRoutes from "./routes/medicineRoutes.js";
// import userMedicineRoutes from "./routes/userMedicineRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import ocrRoutes from "./routes/ocrRoute.js";

// dotenv.config();

// const app = express();

// // =======================
// // MIDDLEWARE
// // =======================
// app.use(express.json());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://medi-log-frontend.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // =======================
// // ROUTES
// // =======================
// app.use("/api/medicines", medicineRoutes);
// app.use("/api/user-medicines", userMedicineRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/ocr", ocrRoutes);

// // =======================
// // TEST ROUTES
// // =======================
// app.get("/", (req, res) => {
//   res.send("🚀 MediLog Backend Running");
// });


// // =======================
// // START SERVER (IMPORTANT FOR RENDER)
// // =======================
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

import express from "express";

console.log("START");

const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 5000;

// 🔥 CRITICAL FIX FOR RENDER
app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER RUNNING ON PORT", PORT);
});