import cron from "node-cron";
import User from "../models/User.js";
import UserMedicine from "../models/UserMedicine.js";
import sendEmail from "../utils/sendEmail.js";

const startExpiryCron = () => {
  // Runs every day at 9 PM
  cron.schedule(
    "0 21 * * *",
    async () => {
      console.log("⏰ Running 9 PM expiry check...");

      try {
        const users = await User.find({
          emailNotifications: true,
        });

        console.log("👤 Users found:", users.length);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const user of users) {
          if (!user.email || !user.firebaseUID) continue;

          const medicines = await UserMedicine.find({
            userId: user.firebaseUID,
          });

          console.log(`💊 Medicines found for ${user.email}:`, medicines.length);

          const thresholdDays = user.notificationThreshold ?? 7;

          for (const med of medicines) {
            if (!med.expiryDate) continue;

            const expiryDate = new Date(med.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);

            const diffDays = Math.ceil(
              (expiryDate - today) / (1000 * 60 * 60 * 24)
            );

            const medicineName = med.customMedicine?.name || "Your medicine";

            console.log(`${medicineName} expires in ${diffDays} day(s)`);

            if (diffDays > thresholdDays || diffDays < 0) continue;

            // Check if already notified today
            if (med.lastNotifiedAt) {
              const lastNotified = new Date(med.lastNotifiedAt);
              lastNotified.setHours(0, 0, 0, 0);

              if (lastNotified.getTime() === today.getTime()) {
                console.log(`⏭️ Already notified today for ${medicineName}`);
                continue;
              }
            }

            await sendEmail({
              to: user.email,
              subject: `⚠️ Medicine Expiry Alert - ${medicineName}`,
              html: `
                <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
                  <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
                    <div style="background:#0f766e; color:white; padding:18px; text-align:center;">
                      <h2 style="margin:0;">MediLog</h2>
                      <p style="margin:4px 0 0;">Medicine Expiry Reminder</p>
                    </div>

                    <div style="padding:22px;">
                      <h3>Hello ${user.name || "User"},</h3>

                      <p>Your medicine is nearing its expiry date. Please review the details below:</p>

                      <div style="background:#f9fafb; padding:16px; border-radius:10px; margin:16px 0;">
                        <p><strong>Medicine:</strong> ${medicineName}</p>
                        <p><strong>Brand:</strong> ${med.customMedicine?.brand || "Not specified"}</p>
                        <p><strong>Dosage:</strong> ${med.dosage || "Not specified"}</p>
                        <p><strong>Category:</strong> ${med.category || "Not specified"}</p>
                        <p><strong>Stock:</strong> ${med.stock}</p>
                        <p><strong>Expiry Date:</strong> ${expiryDate.toDateString()}</p>
                        <p style="color:#dc2626;"><strong>Expires in:</strong> ${diffDays} day(s)</p>
                      </div>

                      <p>Please take necessary action to avoid using expired medicine.</p>
                    </div>

                    <div style="background:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#555;">
                      © ${new Date().getFullYear()} MediLog. All rights reserved.
                    </div>
                  </div>
                </div>
              `,
            });

            med.lastNotifiedAt = new Date();
            await med.save();

            console.log(`✅ Email sent to ${user.email} for ${medicineName}`);
          }
        }

        console.log("✅ Expiry check completed");
      } catch (err) {
        console.error("❌ Cron error:", err.message || err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

export default startExpiryCron;