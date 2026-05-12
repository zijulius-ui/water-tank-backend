import nodemailer from "nodemailer";

export const sendLeakEmail = async (userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      // 🔥 FORCE IPv4 (THIS FIXES YOUR ERROR)
      family: 4,
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "⚠️ Water Tank Leak Alert",
      text: "Leak detected in your tank! Please check immediately.",
    });

    console.log("EMAIL SENT:", info.messageId);
  } catch (err) {
    console.log("EMAIL FAILED:", err.message);
  }
};