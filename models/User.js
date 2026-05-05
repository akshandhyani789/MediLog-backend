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
      required: true,
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

    profileImage: {
      type: String,
      default: "",
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    notificationThreshold: {
      type: Number,
      default: 7,
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