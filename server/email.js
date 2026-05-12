import nodemailer from "nodemailer";

export const sendLeakEmail = async (userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify(); // 👈 important debug step

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "⚠️ Water Tank Leak Alert",
      text: "Leak detected in your tank! Please check immediately.",
    });

    console.log("EMAIL SENT TO:", userEmail);
  } catch (err) {
    console.log("EMAIL FAILED:", err.message);
  }
};