import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true, // ✅ make email required (important for notifications)
    },

    role: {
      type: String,
      enum: ["individual", "vendor"],
      default: "individual",
    },

    // COMMON
    name: String,
    phone: String,
    age: Number,

    // 🔔 NOTIFICATION SETTINGS (NEW)
    emailNotifications: {
      type: Boolean,
      default: true, // ✅ email alerts ON by default
    },

    notificationThreshold: {
      type: Number,
      default: 7, // days before expiry
    },

    // INDIVIDUAL ONLY
    healthProfile: {
      conditions: [String],
    },

    // VENDOR ONLY
    businessName: String,
    ownerName: String,
    businessPhone: String,

    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);