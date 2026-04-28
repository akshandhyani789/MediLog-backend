import GlobalMedicine from "../models/GlobalMedicine.js";

export const getMedicineByBarcode = async (req, res) => {
  const { barcode } = req.params;

  try {
    const medicine = await GlobalMedicine.findOne({
      "barcodes.code": barcode,
    });

    if (medicine) {
      return res.json(medicine);
    }

    // ❌ Not found → send proper response
    return res.status(404).json({
      message: "Medicine not found",
    });

  } catch (err) {
    console.error("Error fetching medicine:", err);
    res.status(500).json({ error: err.message });
  }
};