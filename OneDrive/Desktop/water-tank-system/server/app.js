require("dotenv").config();

const sendLeakAlert = require("./email");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Import MongoDB model
const SensorData = require("./models/SensorData");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup (real-time updates)
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
   HOME ROUTE
------------------------------*/
app.get("/", (req, res) => {
    res.send("Water Tank Monitoring Backend Running");
});

/* -----------------------------
   POST SENSOR DATA (ESP32 sends here)
------------------------------*/
app.post("/api/sensors", async (req, res) => {
    try {
        const data = new SensorData(req.body);
        await data.save();

  if (req.body.leakDetected === true) {

            // find user by tankId
            const user = await User.findOne({ tankId: req.body.tankId });

            if (user) {
                sendLeakAlert({
                    ...req.body,
                    email: user.email   // pass dynamic email
                });
            }
        }

        // Send real-time update to frontend
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
   GET SENSOR DATA (for web dashboard)
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
