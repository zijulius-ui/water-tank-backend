import nodemailer from "nodemailer";

export default async function sendLeakAlert(email, data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "⚠️ Water Leak Detected!",
    html: `
      <h2>Leak Alert 🚨</h2>
      <p><b>Tank ID:</b> ${data.tankId}</p>
      <p><b>Water Level:</b> ${data.waterLevel}</p>
      <p><b>Temperature:</b> ${data.temperature}</p>
      <p><b>Leak Detected:</b> ${data.leakDetected}</p>
    `
  };

  await transporter.sendMail(mailOptions);
}