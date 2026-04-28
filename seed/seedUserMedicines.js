import mongoose from "mongoose";
import dotenv from "dotenv";
import UserMedicine from "../models/UserMedicine.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const userId = "ZKQRl1c3OfffGO0ov59ZRk62KJX2";

    // 🧹 Clear existing data for this user
    await UserMedicine.deleteMany({ userId });
    console.log("Old medicines removed");

    // ❌ No manual medicines inserted

    console.log("✅ Database cleaned (no seed data inserted)");
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seedData();