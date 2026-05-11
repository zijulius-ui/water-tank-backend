import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

console.log("AUTH ROUTE FILE ACTIVE");

const router = express.Router();

/* -----------------------------
   LOGIN ROUTE
------------------------------*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN REQUEST:", email, password);

  const user = await User.findOne({ email });

  console.log("FOUND USER:", user);

  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

  res.json({ msg: "Login success" });
});


/* -----------------------------
   SIGNUP ROUTE
------------------------------*/
router.post("/signup", async (req, res) => {
  try {
    const { email, password, tankId } = req.body;

    console.log("SIGNUP REQUEST:", email, tankId);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      tankId
    });

    console.log("USER CREATED:", newUser.email);

    res.json({ msg: "User created successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;