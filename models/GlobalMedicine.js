import mongoose from "mongoose";

const globalMedicine = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: String,

  composition: [
    {
      ingredient: String,
      strength: String,
    },
  ],

  uses: [String],
  dosage: String,

  barcodes: [
    {
      code: { type: String, required: true },
    },
  ],

  source: {
    type: String,
    default: "manual",
  },

}, { timestamps: true });

// 🔥 IMPORTANT (fast barcode search)
globalMedicine.index({ "barcodes.code": 1 });

export default mongoose.model("GlobalMedicine", globalMedicine);