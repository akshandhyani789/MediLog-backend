export const getMedicineByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    let med = await GlobalMedicine.findOne({
      "barcodes.code": barcode,
    });

    if (!med) {
      // 🔥 fallback (simulate API or manual)
      med = await GlobalMedicine.create({
        name: "Unknown Medicine",
        barcodes: [{ code: barcode }],
        source: "scan",
      });
    }

    res.json(med);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};