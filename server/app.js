require("dotenv").config();

const sendLeakAlert = require("./email");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const SensorData = require("./models/SensorData");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

/* -----------------------------
   CONNECT TO MONGODB
------------------------------*/
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Error:", err));

/* -----------------------------
   EMAIL COOLDOWN CONTROL (NEW)
------------------------------*/
let lastAlertTime = 0;
const ALERT_COOLDOWN = 30000; // 30 seconds

/* -----------------------------
   HOME ROUTE
------------------------------*/
app.get("/", (req, res) => {
    res.send("Water Tank Monitoring Backend Running");
});

/* -----------------------------
   TEST EMAIL ROUTE
------------------------------*/
app.get("/test-email", async (req, res) => {
    try {
        await sendLeakAlert("juliuszimran@gmail.com", {
            waterLevel: 5,
            temperature: 28,
            humidity: 80,
            leakDetected: true
        });

        res.send("Email test sent successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* -----------------------------
   POST SENSOR DATA
------------------------------*/
app.post("/api/sensors", async (req, res) => {
    try {

	console.log(req.body);

        const data = new SensorData(req.body);
        await data.save();

        const now = Date.now();
        const leakDetected = req.body.leakDetected === true;

        // ONLY SEND EMAIL IF:
        // - leak detected
        // - cooldown passed
        if (leakDetected && (now - lastAlertTime > ALERT_COOLDOWN)) {

            const user = await User.findOne({ tankId: req.body.tankId });

            if (user) {
                await sendLeakAlert(user.email, req.body);
                lastAlertTime = now; // update timer
            }
        }

        io.emit("sensor-update", data);

        res.status(201).json({
            message: "Sensor data saved successfully",
            data
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------
   GET SENSOR DATA
------------------------------*/
app.get("/api/sensors", async (req, res) => {
    try {
        const data = await SensorData.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------
   SOCKET CONNECTION
------------------------------*/
io.on("connection", (socket) => {
    console.log("Client connected");
});

/* -----------------------------
   START SERVER
------------------------------*/
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});