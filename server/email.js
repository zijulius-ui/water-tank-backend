const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
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

            text:
`Warning! A leak was detected in your water tank system.

Tank ID: ${data.tankId}
Water Level: ${data.waterLevel} cm
Temperature: ${data.temperature} °C
Humidity: ${data.humidity} %
Turbidity: ${data.turbidity} %

Please check your system immediately.`

        });

        console.log("Leak alert email sent!");

    } catch (error) {

        console.log("Email Error:", error);

    }

}


module.exports = sendLeakAlert;