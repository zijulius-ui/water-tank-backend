import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

console.log("AUTH ROUTE FILE ACTIVE");
console.log("SIGNUP ROUTE LOADED");

const router = express.Router();

/* -----------------------------
   LOGIN ROUTE
------------------------------*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

   
    const token = jwt.sign(
      { email: user.email },
      "process.env.JWT_SECRET", // ⚠️ move this to .env later
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login success",
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* -----------------------------
   SIGNUP ROUTE
------------------------------*/
router.post("/signup", async (req, res) => {
console.log("SIGNUP REQUEST RECEIVED");
  try {
    const { email, password } = req.body;

    console.log("SIGNUP REQUEST:", email, tankId);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,

    });

    console.log("USER CREATED:", newUser.email);

    res.json({ msg: "User created successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;