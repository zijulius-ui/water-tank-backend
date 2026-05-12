import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { sendLeakEmail } from "./email.js";
import User from "./models/User.js";
import SensorData from "./models/SensorData.js";
import authRoutes from "./routes/auth.js";

console.log("EMAIL MODULE LOADED");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;

  next();
};

/* -----------------------------
   INIT
------------------------------*/
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

/* -----------------------------
   MIDDLEWARE
------------------------------*/
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);


/* -----------------------------
   DB CONNECTION
------------------------------*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

/* -----------------------------
   EMAIL COOLDOWN
------------------------------*/
let lastAlertTime = 0;
const ALERT_COOLDOWN = 30000; // 30 seconds

/* -----------------------------
   ROUTES
------------------------------*/
app.get("/", (req, res) => {
  res.send("Water Tank Monitoring Backend Running");
});

/* -----------------------------
   TEST EMAIL (FIXED)
------------------------------*/
app.get("/test-email", async (req, res) => {
  try {
    const user = await User.findOne();

    if (!user) {
      return res.status(404).send("No user found in database");
    }

    await sendLeakEmail(user.email);

    res.send("Test email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* -----------------------------
   POST SENSOR DATA (MAIN LOGIC)
------------------------------*/
app.post("/api/sensors", auth, async (req, res) => {
  console.log("TOKEN USER:", req.user);
  try {
    const data = new SensorData(req.body);
    await data.save();

    const now = Date.now();

    const leakDetected =
      req.body.leakDetected === true ||
      req.body.leakDetected === "true";

    // Respond immediately
    res.status(201).json({
      message: "Sensor data saved successfully",
      data,
    });

    // -----------------------------
    // LEAK ALERT EMAIL LOGIC
    // -----------------------------
    console.log("REQ USER:", req.user);

    const user = await User.findById(req.user.id);

    console.log("DB USER:", user);
    console.log("LEAK:", leakDetected);
    console.log("TIME OK:", now - lastAlertTime > ALERT_COOLDOWN);
    console.log("USER EXISTS:", !!user);

    if (leakDetected && now - lastAlertTime > ALERT_COOLDOWN && user) {
      console.log("🚨 LEAK TRIGGERED");

      console.log("Sending email to:", user.email);

      try {
        await sendLeakEmail(user.email);

        console.log("EMAIL SENT SUCCESSFULLY");

        lastAlertTime = now;
      } catch (err) {
        console.log("EMAIL ERROR:", err.message);
      }
    }

    // realtime update
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
   SOCKET
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