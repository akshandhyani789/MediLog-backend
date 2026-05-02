import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Validate MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set!");
    }

    console.log("    Attempting MongoDB connection...");

    // Connect with production-grade options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection pooling
      maxPoolSize: 10,
      minPoolSize: 5,

      // Timeouts (increased for production)
      serverSelectionTimeoutMS: 15000, // Wait max 15s to find server
      socketTimeoutMS: 45000, // Socket timeout 45s
      connectTimeoutMS: 10000, // Connection timeout 10s

      // Retry logic
      family: 4, // Use IPv4, skip IPv6
      retryWrites: true, // Retry writes on transient errors
      w: "majority", // Wait for majority replica acknowledgment
    });

    // Get connection details
    const mongoConnection = mongoose.connection;
    const dbName = mongoConnection.db?.getName?.() || mongoConnection.name || "unknown";

    console.log(` MongoDB connected successfully`);
    console.log(`   Host: ${mongoConnection.host}`);
    console.log(`   Port: ${mongoConnection.port}`);
    console.log(`   Database: ${dbName}`);

    // Handle connection events
    mongoConnection.on("disconnected", () => {
      console.warn("  MongoDB disconnected");
    });

    mongoConnection.on("error", (err) => {
      console.error(" MongoDB connection error:", err.message);
    });

    return conn;

  } catch (err) {
    console.error(" MongoDB Connection Failed:");
    console.error(`   Error: ${err.message}`);

    if (err.message.includes("MONGO_URI")) {
      console.error("   Solution: Set MONGO_URI environment variable");
    } else if (err.message.includes("authentication")) {
      console.error("   Solution: Check MongoDB username/password in MONGO_URI");
    } else if (err.message.includes("ECONNREFUSED")) {
      console.error("   Solution: MongoDB server is not running or not accessible");
    } else if (err.message.includes("ENOTFOUND")) {
      console.error("   Solution: Check MongoDB connection string - DNS resolution failed");
    }

    // Re-throw so server knows to exit
    throw err;
  }
};

export default connectDB;