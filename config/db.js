import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // 🔥 important fix
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;