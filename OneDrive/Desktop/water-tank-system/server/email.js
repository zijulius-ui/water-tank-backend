const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "juliuszimran@gmail.com",
        pass: "xoet gpqu owqq xwpl"
    }
});

function sendLeakAlert(data) {

    const mailOptions = {
        from: "juliuszimran@gmail.com",
        to: data.email,
        subject: "Water Tank Leak Detected!",
        text: `
LEAK ALERT DETECTED

Water Level: ${data.waterLevel}
Temperature: ${data.temperature}
Humidity: ${data.humidity}
Turbidity: ${data.turbidity}
Leak Status: ${data.leakDetected}

Please check the system immediately.
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Email Error:", err);
        } else {
            console.log("Email Sent:", info.response);
        }
    });
}

module.exports = sendLeakAlert;