import User from "../models/User.js";

// Firebase login handler
export const firebaseLogin = async (req, res) => {
  const { uid, email, name, phone } = req.user;

  let user = await User.findOne({ firebaseUID: uid });

  if (!user) {
    user = await User.create({
      firebaseUID: uid,
      email,
      name,
      phone,
       emailNotifications: true,
      notificationThreshold: 7,
      isFirstLogin: true,
    });

    return res.json({ isFirstLogin: true, user });
  }

  res.json({ isFirstLogin: user.isFirstLogin, user });
};

// Update profile after first login
export const updateProfile = async (req, res) => {
  const { uid } = req.user;

  const updatedUser = await User.findOneAndUpdate(
    { firebaseUID: uid },
    { ...req.body, isFirstLogin: false },
    { new: true }
  );

  res.json(updatedUser);
};

export const updateNotificationSettings = async (req, res) => {
  const { uid } = req.user;
  const { emailNotifications, notificationThreshold } = req.body;

  const user = await User.findOneAndUpdate(
    { firebaseUID: uid },
    { emailNotifications, notificationThreshold },
    { new: true }
  );

  res.json(user);
};