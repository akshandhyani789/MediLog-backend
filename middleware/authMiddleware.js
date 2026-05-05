import admin from "../config/firebase.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided. Use: Authorization: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name || "",
      phone: decoded.phone_number || "",
      picture: decoded.picture || "",
    };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);

    return res.status(401).json({
      error: "Invalid or expired token",
      message: error.message,
    });
  }
};

export default protect;