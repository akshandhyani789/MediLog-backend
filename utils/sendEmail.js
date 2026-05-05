import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"MediLog" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("📨 Email accepted by SMTP:", info.messageId);
    console.log("📩 Sent to:", to);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;