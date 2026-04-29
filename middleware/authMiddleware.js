import admin from "../config/firebase.js";

const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided. Use: Authorization: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Firebase
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded; // Contains uid, email, etc.
      next();
    } catch (firebaseError) {
      return res.status(401).json({
        error: "Invalid or expired token",
        message: firebaseError.message,
      });
    }

  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    res.status(500).json({
      error: "Authentication failed",
      message: err.message,
    });
  }
};

export default protect;