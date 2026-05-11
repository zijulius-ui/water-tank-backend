import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();

import sendLeakAlert from "./email.js";
import User from "./models/User.js";
import SensorData from "./models/SensorData.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";

console.log("AUTH ROUTES LOADED");

/* -----------------------------
   APP INIT
------------------------------*/
const app = express();

/* -----------------------------
   MIDDLEWARE
------------------------------*/
app.use(cors());
app.use(express.json());

/* -----------------------------
   ROUTES
------------------------------*/
app.use("/api", authRoutes);

/* -----------------------------
   HTTP SERVER
------------------------------*/
const server = http.createServer(app);

/* -----------------------------
   SOCKET.IO
------------------------------*/
const io = new Server(server, {
  cors: { origin: "*" }
});

/* -----------------------------
   CONNECT TO MONGODB
------------------------------*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

/* -----------------------------
   EMAIL COOLDOWN
------------------------------*/
let lastAlertTime = 0;
const ALERT_COOLDOWN = 30000;

/* -----------------------------
   HOME ROUTE
------------------------------*/
app.get("/", (req, res) => {
  res.send("Water Tank Monitoring Backend Running");
});

/* -----------------------------
   TEST EMAIL
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
    const data = new SensorData(req.body);
    await data.save();

    const now = Date.now();
    const leakDetected = req.body.leakDetected === true;

    const user = await User.findOne({ tankId: req.body.tankId });

    res.status(201).json({
      message: "Sensor data saved successfully",
      data
    });

    if (leakDetected && now - lastAlertTime > ALERT_COOLDOWN && user) {
      sendLeakAlert(user.email, req.body)
        .then(() => console.log("Leak email sent!"))
        .catch((err) => console.log("Email failed:", err));

      lastAlertTime = now;
    }

    io.emit("sensor-update", data);
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