import cron from "node-cron";
import User from "../models/User.js";
import UserMedicine from "../models/UserMedicine.js";
import sendEmail from "../utils/sendEmail.js";

const startExpiryCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running expiry check...");

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
            (expiryDate - today) / (1000 * 60 * 60 * 24),
          );


          // ✅ ONLY SEND VALID ALERTS
          if (diffDays <= thresholdDays && diffDays >= 0) {
            const medicineName = med.customMedicine?.name || "Your medicine";

            await sendEmail({
              to: user.email,
              subject: `⚠️ Medicine Expiry Alert - ${medicineName}`,
              html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #0f766e; color: white; padding: 16px; text-align: center;">
        <h2 style="margin: 0;">MediLog</h2>
        <p style="margin: 0; font-size: 14px;">Medicine Management System</p>
      </div>

      <!-- Body -->
      <div style="padding: 20px;">
        <h3 style="color: #111;">Hello ${user.name || "User"},</h3>
        
        <p style="color: #444;">
          This is a reminder that your medicine is nearing its expiry date.
        </p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin: 15px 0;">
          <p><strong>Medicine:</strong> ${medicineName}</p>
          <p><strong>Brand:</strong> ${med.customMedicine?.brand || "Not specified"}</p>
          <p><strong>Dosage:</strong> ${med.dosage || "Not specified"}</p>
          <p><strong>Category:</strong> ${med.category || "Not specified"}</p>
          <p><strong>Stock:</strong> ${med.stock}</p>
          <p><strong>Expiry Date:</strong> ${expiryDate.toDateString()}</p>
          <p style="color: #dc2626;"><strong>Expires in:</strong> ${diffDays} day(s)</p>
        </div>

        <p style="color: #444;">
          Please ensure timely usage or replacement to avoid any inconvenience.
        </p>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://medilog-henna.vercel.app" 
             style="background-color: #0f766e; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none;">
             View Dashboard
          </a>
        </div>

        <p style="margin-top: 20px; font-size: 13px; color: #777;">
          If you have already taken action, you can ignore this message.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #555;">
        © ${new Date().getFullYear()} MediLog • All rights reserved
      </div>

    </div>
  </div>
  `,
            });
            console.log(
              `✅ Email sent to akshandhyani987@gmail.com for ${medicineName}`,
            );
          }
        }
      }

      console.log("✅ Expiry check completed");
    } catch (err) {
      console.error("❌ Cron error:", err.message || err);
    }
  });
};

export default startExpiryCron;
