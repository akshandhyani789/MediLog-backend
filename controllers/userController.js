import User from "../models/User.js";

// Firebase login handler
export const firebaseLogin = async (req, res) => {
  const { uid, email, name } = req.user;

  let user = await User.findOne({ firebaseUID: uid });

  if (!user) {
    user = await User.create({
      firebaseUID: uid,
      email,
      name,
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