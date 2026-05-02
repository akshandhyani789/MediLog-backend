import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const data = await resend.emails.send({
      from: "MedTrack <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("📧 Email sent:", data);
    return data;
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};

export default sendEmail;