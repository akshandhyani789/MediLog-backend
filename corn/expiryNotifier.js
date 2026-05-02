import cron from "node-cron";
import User from "../models/User.js";
import UserMedicine from "../models/UserMedicine.js";
import sendEmail from "../utils/sendEmail.js";

const startExpiryCron = () => {
  // 🕘 Runs every day at 9 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running expiry check...");

    try {
      const users = await User.find({ emailNotifications: true });

      for (const user of users) {
        const medicines = await UserMedicine.find({
          user: user._id,
        });

        const today = new Date();

        for (const med of medicines) {
          const expiryDate = new Date(med.expiryDate);
          const diffDays = Math.ceil(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
          );

          // ✅ check threshold
          if (diffDays <= user.notificationThreshold && diffDays >= 0) {
            
            // 🚫 prevent duplicate emails (optional but important)
            if (med.lastNotifiedAt) {
              const last = new Date(med.lastNotifiedAt);
              const diff = (today - last) / (1000 * 60 * 60 * 24);

              if (diff < 1) continue; // skip if notified today
            }

            // 📧 send email
            await sendEmail({
              to: user.email,
              subject: "⚠️ Medicine Expiry Alert",
              text: `${med.name} is expiring in ${diffDays} days.`,
            });

            // ✅ update last notified
            med.lastNotifiedAt = new Date();
            await med.save();

            console.log(`📧 Email sent to ${user.email}`);
          }
        }
      }
    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });
};

export default startExpiryCron;