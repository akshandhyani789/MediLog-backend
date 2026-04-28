import admin from "../config/firebase.js";

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // uid + email
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;