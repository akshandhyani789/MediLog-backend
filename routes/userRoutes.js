import express from "express";
import admin from "../config/firebase.js";
import User from "../models/User.js";
import { updateNotificationSettings,  } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { isValidIndianPhone } from "../utils/phoneValidator.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

// 🔥 helper function (clean data)
const formatName = (name) => {
  if (!name) return name;

  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// ========================================
// ✅ LOGIN (Firebase Sync)
// ========================================
router.post("/firebase-login", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name } = decoded; // ❌ removed phone

    const user = await User.findOneAndUpdate(
      { firebaseUID: uid },
      {
        $setOnInsert: {
          firebaseUID: uid,
          email,
          name: formatName(name),
          phone: "", // ✅ initialize phone as empty string
          isOnboarded: false,
          emailNotifications: true,
          notificationThreshold: 7,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    const isFirstLogin = !user.isOnboarded;

    res.json({ isFirstLogin, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ========================================
// ✅ COMPLETE ONBOARDING
// ========================================
router.put("/complete-onboarding", protect, async (req, res) => {
  try {
    const decoded = req.user;

    const { name, phone, age, role, businessName, ownerName, businessPhone } =
      req.body;

    if (phone && !isValidIndianPhone(phone)) {
      return res.status(400).json({
        error: "Invalid phone number. Enter a valid 10-digit Indian mobile number.",
      });
    }

    if (businessPhone && !isValidIndianPhone(businessPhone)) {
      return res.status(400).json({
        error: "Invalid business phone number. Enter a valid 10-digit Indian mobile number.",
      });
    }

    const updateData = {
      isOnboarded: true,
    };

    if (name) updateData.name = formatName(name);
    if (phone) updateData.phone = phone.trim();
    if (age) updateData.age = age;

    if (role) updateData.role = role;
    if (businessName) updateData.businessName = businessName;
    if (ownerName) updateData.ownerName = formatName(ownerName);
    if (businessPhone) updateData.businessPhone = businessPhone.trim();

    const user = await User.findOneAndUpdate(
      { firebaseUID: decoded.uid },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

router.put("/notification-settings", protect, updateNotificationSettings);

router.get("/notification-settings", protect, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      emailNotifications: user.emailNotifications ?? true,
      notificationThreshold: user.notificationThreshold ?? 7,
    });

  } catch (error) {
    console.error("❌ Fetch settings error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/update-profile", protect, updateProfile);


export default router;

