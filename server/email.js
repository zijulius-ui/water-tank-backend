require("dns").setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

// FIXED TRANSPORTER (stable on Render)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendLeakAlert(userEmail, data) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Water Tank Leak Detected!!",
            text: `
Warning! A leak was detected in your water tank system.

Tank ID: ${data.tankId}
Water Level: ${data.waterLevel} cm
Temperature: ${data.temperature} °C
Humidity: ${data.humidity} %
Turbidity: ${data.turbidity || "N/A"} %

Please check your system immediately.
            `
        });

        console.log("Leak alert email sent!");

    } catch (error) {
        console.log("Email Error:", error);
    }
}

module.exports = sendLeakAlert;