import UserMedicine from "../models/UserMedicine.js";

// ➕ Add medicine to user
export const addUserMedicine = async (req, res) => {
  try {
    // Get userId from Firebase Auth (set by middleware)
    const userId = req.user.uid;

    console.log("🔥 Adding medicine for user:", userId);
    console.log("📦 Request body:", req.body);

    // Validate required fields
    if (!req.body.customMedicine || !req.body.customMedicine.name) {
      return res.status(400).json({ error: "Medicine name is required" });
    }

    if (!req.body.expiryDate) {
      return res.status(400).json({ error: "Expiry date is required" });
    }

    if (req.body.stock === undefined || req.body.stock === null) {
      return res.status(400).json({ error: "Stock is required" });
    }

    // Prepare medicine data
    const medicineData = {
      userId,
      customMedicine: {
        name: req.body.customMedicine.name.trim(),
        brand: req.body.customMedicine.brand?.trim() || "",
      },
      dosage: req.body.dosage?.trim() || "",
      frequency: req.body.frequency?.trim() || "",
      expiryDate: new Date(req.body.expiryDate),
      stock: parseInt(req.body.stock),
      category: (req.body.category?.trim() || "Tablet"),
    };

    console.log("✅ Saving medicine data:", medicineData);

    // Create and save to MongoDB
    const newMedicine = new UserMedicine(medicineData);
    const savedMedicine = await newMedicine.save();

    console.log("🎉 Medicine saved successfully:", savedMedicine);

    res.status(201).json({
      message: "Medicine added successfully",
      medicine: savedMedicine,
    });

  } catch (error) {
    console.error("❌ Error adding medicine:", error);
    res.status(500).json({ error: error.message || "Failed to add medicine" });
  }
};

// 📋 Get user medicines
export const getUserMedicines = async (req, res) => {
  try {
    const userId = req.user.uid;

    console.log("🔍 Fetching medicines for user:", userId);

    const meds = await UserMedicine.find({ userId })
      .populate("medicineId");

    const formatted = meds.map((med) => ({
      _id: med._id,
      name: med.medicineId?.name || med.customMedicine?.name,
      brand: med.medicineId?.brand || med.customMedicine?.brand,
      category: med.category || "Unknown",
      dosage: med.dosage,
      frequency: med.frequency,
      expiryDate: med.expiryDate,
      stock: med.stock,
      createdAt: med.createdAt,
    }));

    console.log("✅ Fetched medicines:", formatted);

    res.json(formatted);

  } catch (error) {
    console.error("❌ Error fetching medicines:", error);
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete user medicine
export const deleteUserMedicine = async (req, res) => {
  try {
    const userId = req.user.uid;
    const medicineId = req.params.id;

    console.log("🗑️ Deleting medicine:", medicineId, "for user:", userId);

    const medicine = await UserMedicine.findById(medicineId);

    // Verify ownership
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    if (medicine.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized - not your medicine" });
    }

    await UserMedicine.findByIdAndDelete(medicineId);

    console.log("✅ Medicine deleted successfully");

    res.json({ message: "Medicine deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting medicine:", error);
    res.status(500).json({ error: error.message });
  }
};
export const updateUserMedicine = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    console.log("✏️ Updating medicine:", id);

    const medicine = await UserMedicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // 🔒 Ownership check
    if (medicine.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ✅ Proper field mapping (VERY IMPORTANT)
    if (req.body.name !== undefined) {
      medicine.customMedicine.name = req.body.name;
    }

    if (req.body.brand !== undefined) {
      medicine.customMedicine.brand = req.body.brand;
    }

    if (req.body.category !== undefined) {
      medicine.category = req.body.category;
    }

    if (req.body.stock !== undefined) {
      medicine.stock = Number(req.body.stock);
    }

    if (req.body.expiryDate) {
      medicine.expiryDate = new Date(req.body.expiryDate);
    }

    const updated = await medicine.save();

    console.log("✅ Updated:", updated);

    res.json({
      message: "Medicine updated successfully",
      medicine: updated,
    });

  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ error: error.message });
  }
};