import cron from "node-cron";
import User from "./models/User.js";
import sendEmail from "./utils/sendEmail.js";

// runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("🔔 Running medicine reminder job...");

    const now = new Date();

    const users = await User.find({
      emailNotifications: true,
    });

    for (const user of users) {
      if (!user.email) continue;

      const thresholdDays = user.notificationThreshold ?? 7;

      if (!user.medicines?.length) continue;

      for (const med of user.medicines) {
        if (!med.expiryDate) continue;

        const expiry = new Date(med.expiryDate);

        // normalize dates (IMPORTANT FIX)
        const reminderDate = new Date(expiry);
        reminderDate.setHours(0, 0, 0, 0);

        reminderDate.setDate(reminderDate.getDate() - thresholdDays);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // check window
        if (today < reminderDate) continue;
        if (today > expiry) continue;

        // prevent duplicate emails
        if (med.emailSent === true) continue;

        console.log(`📧 Sending email to ${user.email} for ${med.name}`);

        await sendEmail({
          to: user.email,
          subject: `⚠️ Medicine Expiry Reminder - ${med.name}`,
          text: `Hello ${user.name || "User"},

Your medicine "${med.name}" will expire on ${expiry.toDateString()}.

Please take necessary action.

- MediLog System`,
        });

        // mark as sent
        med.emailSent = true;
      }

      await user.save();
    }

    console.log("✅ Reminder job completed");
  } catch (err) {
    console.error("❌ Reminder cron error:", err);
  }
});