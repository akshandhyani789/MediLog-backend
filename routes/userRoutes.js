import express from "express";
import admin from "../config/firebase.js";
import User from "../models/User.js";

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
          isOnboarded: false,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const isFirstLogin =
      user.createdAt.getTime() === user.updatedAt.getTime();

    res.json({ isFirstLogin, user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ========================================
// ✅ COMPLETE ONBOARDING
// ========================================
router.put("/complete-onboarding", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    // ✅ Extract all fields - both individual and vendor
    const { 
      name, 
      phone, 
      age, 
      role, 
      businessName, 
      ownerName, 
      businessPhone 
    } = req.body;

    console.log("📥 Request body:", req.body);

    // ✅ Build update object with all provided fields
    const updateData = {
      isOnboarded: true,
    };

    // Add individual fields if provided
    if (name) updateData.name = formatName(name);
    if (phone) updateData.phone = phone;
    if (age) updateData.age = age;
    
    // Add vendor-specific fields if provided
    if (role) {
      console.log("Setting role to:", role);
      updateData.role = role;
    }
    if (businessName) {
      console.log("Setting businessName to:", businessName);
      updateData.businessName = businessName;
    }
    if (ownerName) {
      console.log("Setting ownerName to:", ownerName);
      updateData.ownerName = formatName(ownerName);
    }
    if (businessPhone) {
      console.log("Setting businessPhone to:", businessPhone);
      updateData.businessPhone = businessPhone;
    }

    console.log("🔄 Update data being sent:", updateData);

    const user = await User.findOneAndUpdate(
      { firebaseUID: decoded.uid },
      {
        $set: updateData,
      },
      { new: true }
    );

    console.log("✅ Updated user:", user);

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

export default router;