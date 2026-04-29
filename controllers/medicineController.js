import GlobalMedicine from "../models/GlobalMedicine.js";

export const getMedicineByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    console.log("🔍 Searching barcode:", barcode);

    const medicine = await GlobalMedicine.findOne({
      "barcodes.code": barcode,
    });

    if (!medicine) {
      console.log("❌ Not found in DB");
      return res.status(404).json({ error: "Medicine not found" });
    }

    console.log("✅ Found:", medicine.name);

    // 🔥 Clean response for frontend
    res.json({
      name: medicine.name,
      brand: medicine.brand,
      category: medicine.uses?.[0] || "General",
      dosage: medicine.dosage,
    });

  } catch (error) {
    console.error("❌ Barcode search error:", error);
    res.status(500).json({ error: error.message });
  }
};