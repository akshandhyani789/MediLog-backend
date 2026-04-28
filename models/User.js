import mongoose from "mongoose";

const  userSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },

    email: String,

    role: {
      type: String,
      enum: ["individual", "vendor"],
      default: "individual", // default
    },

    // COMMON
    name: String,
    phone: String,
    age: Number,

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