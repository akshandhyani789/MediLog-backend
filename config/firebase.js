import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate Firebase environment variables
const validateFirebaseEnv = () => {
  const required = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(", ")}\n` +
      "Please set these in your .env file or Render environment variables."
    );
  }
};

try {
  validateFirebaseEnv();

  // Build service account configuration
  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  // Initialize Firebase Admin SDK only once
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK initialized");
  }

} catch (error) {
  console.error("❌ Firebase Configuration Error:");
  console.error(`   ${error.message}`);
  process.exit(1);
}

export default admin;