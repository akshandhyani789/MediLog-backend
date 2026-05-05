import User from "../models/User.js";
import { isValidIndianPhone } from "../utils/phoneValidator.js";

export const firebaseLogin = async (req, res) => {
  try {
    const { uid, email, name, phone, picture } = req.user;

    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        email,
        name,
        phone,
        profileImage: picture || "",
        emailNotifications: true,
        notificationThreshold: 7,
        isOnboarded: false,
      });

      return res.json({
        isFirstLogin: true,
        user,
      });
    }

    // If old user has no profile image, set Firebase Google image
    if (!user.profileImage && picture) {
      user.profileImage = picture;
      await user.save();
    }

    res.json({
      isFirstLogin: !user.isOnboarded,
      user,
    });
  } catch (error) {
    console.error("❌ Firebase login error:", error);

    res.status(500).json({
      error: "Firebase login failed",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const {
      name,
      fullName,
      ownerName,
      businessName,
      phone,
      businessPhone,
      role,
      age,
      healthProfile,
      profileImage,
    } = req.body;

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

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (fullName !== undefined) updateData.name = fullName;
    if (ownerName !== undefined) updateData.ownerName = ownerName;
    if (businessName !== undefined) updateData.businessName = businessName;
    if (phone !== undefined) updateData.phone = phone;
    if (businessPhone !== undefined) updateData.businessPhone = businessPhone;
    if (role !== undefined) updateData.role = role;
    if (age !== undefined) updateData.age = age;
    if (healthProfile !== undefined) updateData.healthProfile = healthProfile;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await User.findOneAndUpdate(
  { firebaseUID: uid },
  { $set: updateData },
  { new: true, runValidators: true }
);

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Profile update error:", error);

    res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const { uid } = req.user;

    const {
      role,
      name,
      phone,
      age,
      healthProfile,
      businessName,
      ownerName,
      businessPhone,
      profileImage,
    } = req.body;

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

    if (role !== undefined) updateData.role = role;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = age;
    if (healthProfile !== undefined) updateData.healthProfile = healthProfile;
    if (businessName !== undefined) updateData.businessName = businessName;
    if (ownerName !== undefined) updateData.ownerName = ownerName;
    if (businessPhone !== undefined) updateData.businessPhone = businessPhone;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUID: uid },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Onboarding error:", error);

    res.status(500).json({
      error: "Failed to complete onboarding",
    });
  }
};

export const getNotificationSettings = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUID: uid }).select(
      "emailNotifications notificationThreshold"
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      emailNotifications: user.emailNotifications,
      notificationThreshold: user.notificationThreshold,
    });
  } catch (error) {
    console.error("❌ Get notification settings error:", error);

    res.status(500).json({
      error: "Failed to get notification settings",
    });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const { uid } = req.user;
    const { emailNotifications, notificationThreshold } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUID: uid },
      { emailNotifications, notificationThreshold },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Notification update error:", error);

    res.status(500).json({
      error: "Failed to update notification settings",
    });
  }
};