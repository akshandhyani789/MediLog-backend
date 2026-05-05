import cron from "node-cron";
import User from "../models/User.js";
import UserMedicine from "../models/UserMedicine.js";
import sendEmail from "../utils/sendEmail.js";

const startExpiryCron = () => {
  cron.schedule("0 21 * * *", async () => {

    try {
      const users = await User.find({
        emailNotifications: true,
      });

      for (const user of users) {
        if (!user.email || !user.firebaseUID) continue;

        const medicines = await UserMedicine.find({
          userId: user.firebaseUID,
        });

        const thresholdDays = user.notificationThreshold ?? 7;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const med of medicines) {
          if (!med.expiryDate) continue;

          const expiryDate = new Date(med.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);

          const diffDays = Math.ceil(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
          );

          // Send email only if medicine is expiring within threshold
          if (diffDays <= thresholdDays && diffDays >= 0) {
            const medicineName =
              med.customMedicine?.name || med.name || "Your medicine";

            await sendEmail({
              to: user.email,
              subject: `⚠️ Medicine Expiry Alert - ${medicineName}`,
              html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #0f766e; color: white; padding: 16px; text-align: center;">
                      <h2 style="margin: 0;">MediLog</h2>
                      <p style="margin: 0; font-size: 14px;">Medicine Expiry Reminder</p>
                    </div>

                    <div style="padding: 20px;">
                      <h3>Hello ${user.name || "User"},</h3>

                      <p>Your medicine is nearing its expiry date.</p>

                      <div style="background: #f9fafb; padding: 15px; border-radius: 10px;">
                        <p><strong>Medicine:</strong> ${medicineName}</p>
                        <p><strong>Brand:</strong> ${med.customMedicine?.brand || "Not specified"}</p>
                        <p><strong>Dosage:</strong> ${med.dosage || "Not specified"}</p>
                        <p><strong>Category:</strong> ${med.category || "Not specified"}</p>
                        <p><strong>Stock:</strong> ${med.stock}</p>
                        <p><strong>Expiry Date:</strong> ${expiryDate.toDateString()}</p>
                        <p style="color: #dc2626;"><strong>Expires in:</strong> ${diffDays} day(s)</p>
                      </div>

                      <p>Please replace or use this medicine before expiry.</p>

                      <div style="text-align: center; margin-top: 20px;">
                        <a href="https://medilog-henna.vercel.app"
                          style="background-color: #0f766e; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none;">
                          View Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              `,
            });

            console.log(`✅ Email sent to ${user.email} for ${medicineName}`);
          }
        }
      }

      console.log("✅ Expiry email check completed");
    } catch (err) {
      console.error("❌ Cron error:", err.message || err);
    }
  });
};

export default startExpiryCron;