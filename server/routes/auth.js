import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

console.log("AUTH ROUTE FILE ACTIVE");

const router = express.Router();

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

export default router;