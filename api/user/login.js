import express from "express";
import admin from "../config/firebase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name } = decoded;

    // 🔥 Check DB
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

    return res.json({ isFirstLogin: false, user });

  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;