import mongoose from "mongoose";

const userMedicine = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GlobalMedicine",
  },

  customMedicine: {
    name: String,
    brand: String,
  },

  dosage: String,
  frequency: String,

  // ✅ NEW FIELD
  category: {
    type: String,
    enum: ["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Sachet", "Other"],
    default: "Tablet",
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
  },

  expiryDate: {
    type: Date,
    required: true,
  },
  lastNotifiedAt: Date, // ✅ to track last notification

}, { timestamps: true });

export default mongoose.model("UserMedicine", userMedicine);